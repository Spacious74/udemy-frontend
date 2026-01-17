declare var Razorpay: any;
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../Services/cart.service';
import { Cart } from '../../models/Cart';
import { CookieService } from 'ngx-cookie-service';
import { UserList } from '../../models/UserList';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { CartItem } from '../../models/CartItems';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';
import { PaymentService } from '../../Services/payment.service';
import { appEnv } from '../../../config/environment';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ButtonModule, DividerModule],
  providers: [ToastMessageService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  public course: any[];
  public cartItemsLength: number = 0;
  public cartData: CartItem[];
  public userDetails: UserList;
  public token: string = null;
  public totalCartPrice: number = 0;
  public discountedPrice: number = 0;
  public discountPercentage: number = 10;

  constructor(
    private cartService: CartService,
    private cookieService: CookieService,
    private store: Store<{ userInfo: UserList}>,
    private paymentService: PaymentService,
    private toastMsgService: ToastMessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.token = this.cookieService.get("skillUpToken");
    this.store.select("userInfo").subscribe((res) => {
      this.userDetails = res;
      if (this.token) this.fetchCartData()
      else this.loadCartDataFromStorage();
    });
  }

  navigateToHome() {
    this.router.navigate(['/courses'])
  }

  calculateTotalPrice() {
    this.totalCartPrice = this.cartData.reduce((total, item) => {
      return total + (item.coursePrice || 0);
    }, 0);
    this.discountedPrice = this.totalCartPrice - (this.totalCartPrice * (this.discountPercentage / 100));
    this.discountedPrice = parseFloat(this.discountedPrice.toFixed(0));
  }

  fetchCartData() {
    this.cartService.getCart(this.userDetails._id).subscribe((res) => {
      this.cartData = res.cart.cartItems;
      this.cartItemsLength = res.cartItemsLength;
      if (res.cartItemsLength > 0) {
        this.calculateTotalPrice();
      }
    }, (err) => {
      this.toastMsgService.showError("Error", "Some internal error occured.");
    })
  }

  loadCartDataFromStorage() {
    this.cartData = JSON.parse(localStorage.getItem("cartCourses")) || [];
    this.cartItemsLength = this.cartData.length;
    if (this.cartItemsLength > 0) {
      this.calculateTotalPrice();
    }
  }

  removeFromCart(courseId: string) {
    if (!this.token) {
      let cartCourses = JSON.parse(localStorage.getItem("cartCourses")) || [];
      cartCourses = cartCourses.filter(course => course.courseId !== courseId);
      localStorage.setItem("cartCourses", JSON.stringify(cartCourses));
      this.loadCartDataFromStorage();
      this.toastMsgService.showSuccess("Success", "Course removed from cart successfully.");
      return;
    }

    this.cartService.removeFromCart(this.userDetails._id, courseId).subscribe((res) => {
      if (res.success) {
        this.fetchCartData();
        this.toastMsgService.showSuccess("Success", res.message);
      } else {
        this.toastMsgService.showInfo("Info", res.message);
      }
    }, (err) => {
      this.toastMsgService.showError("Error", err.error.message);
    });
  }

  checkOut() {
    if (!this.token) {
      this.toastMsgService.showError("Error", "Please Login to continue checkout.");
      return;
    }

    let courseIds = this.cartData.map((dt) => dt.courseId);
    let orderData = {
      courseIds,
      amount: this.discountedPrice
    }

    this.paymentService.cartCheckout(orderData).subscribe((res) => {
      if (res.success) {
        this.openRazorpayCheckout(res.orderId, res.amount, courseIds);
        this.toastMsgService.showSuccess("Success", "Order created successfully.");
      } else {
        this.toastMsgService.showInfo("Info", "Something went wrong, please try again later.");
      }
    }, (err) => {
      this.toastMsgService.showError("Error", err.error.message);
    })

  }

  openRazorpayCheckout(orderId: String, amount: number, courseIds: string[]) {
    const options = {
      key: appEnv.razorpayKey,
      amount: amount * 100,
      currency: 'INR',
      name: 'Skill Up.',
      description: 'Course Purchase',
      order_id: orderId,
      handler: (res: any) => {
        let data = {
          razorpay_payment_id: res.razorpay_payment_id,
          razorpay_order_id: res.razorpay_order_id,
          razorpay_signature: res.razorpay_signature,
          userId: this.userDetails._id,
          courseIds: courseIds
        }
        this.paymentService.cartPaymentVerify(data).subscribe((res) => {
          if (res.success) {
            this.toastMsgService.showSuccess("Success", "Payment successful. Cart Courses added to your Learning.");

          }
        }, (err) => {
          this.toastMsgService.showError("Error", err.error.message);

        })
      },
      prefill: {
        name: this.userDetails.username,
        email: this.userDetails.email,
      },
      theme: { color: '#1A241B' }
    };
    const rzp = new Razorpay(options);
    rzp.open();
  }


  goToOrderSummaryPage() {
    this.router.navigate(
      ['/order-summary'],
      {
        queryParams: {
          courseId: null,
          isCart: true,
        }
      }
    )
  }

}
