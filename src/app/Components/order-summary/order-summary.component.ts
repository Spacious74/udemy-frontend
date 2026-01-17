declare var Razorpay: any;
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DraftedCourseService } from '../../Services/draftedCourse.service';
import { DraftCourse } from '../../models/Course/DraftCourse';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../models/CartItems';
import { CartService } from '../../Services/cart.service';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { Store } from '@ngrx/store';
import { UserList } from '../../models/UserList';
import { CookieService } from 'ngx-cookie-service';
import { ButtonModule } from 'primeng/button';
import { PaymentService } from '../../Services/payment.service';
import { appEnv } from '../../../config/environment';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './order-summary.component.html',
  styleUrl: './orderSummary.css'
})
export class OrderSummaryComponent implements OnInit {

  public isCart: boolean = false;
  public courseId: string = '';
  public courseDetail: DraftCourse;
  public cartData: CartItem[] = [];
  public userDetails: UserList;
  public totalCartPrice: number = 0;
  public discountedPrice: number = 0;
  public discountPercentage: number = 10;
  public cartItemsLength: number = 0;

  constructor(
    private courseService: DraftedCourseService,
    private cartService: CartService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private navRouter: Router,
    private toastMsgService: ToastMessageService,
    private location: Location,
    private store: Store<{ userInfo: UserList }>,
    private cookieService: CookieService,
  ) { }

  ngOnInit(): void {
    let token = this.cookieService.get("skillUpToken");
    if (!token) {
      this.navRouter.navigate(['/login']);
      return;
    }

    this.store.select("userInfo").subscribe((res) => {
      this.userDetails = res;
    });

    this.route.queryParams.subscribe((params) => {
      this.courseId = params['courseId'];
      this.isCart = params['isCart'] == 'true';
      this.loadOrderedItems();
    })

  }

  onCancel() {
    this.location.back();
  }

  loadOrderedItems() {
    if (this.isCart) {

      this.cartService.getCart(this.userDetails._id).subscribe((res) => {
        this.cartData = res.cart.cartItems;
        this.cartItemsLength = res.cartItemsLength;
        if (res.cartItemsLength > 0) {
          this.calculateTotalPrice();
        }
      }, (err) => {
        this.toastMsgService.showError("Error", "Some internal error occured.");
      })

    } else {

      this.courseService.getCourseDetailsById(this.courseId).subscribe((res) => {
        this.courseDetail = res.course;
        this.cartData.push(
          {
            _id: null,
            coursePoster: res.course.coursePoster,
            courseId: res.course._id,
            courseName: res.course.title,
            coursePrice: res.course.price,
            educatorName: res.course.educator.edname,
            lectures: null,
            language: null,
            level: null,
          }
        )
        this.cartItemsLength = 1;
        this.calculateTotalPrice();
      })

    }
  }

  calculateTotalPrice() {
    this.totalCartPrice = this.cartData.reduce((total, item) => {
      return total + (item.coursePrice || 0);
    }, 0);
    this.discountedPrice = this.totalCartPrice - (this.totalCartPrice * (this.discountPercentage / 100));
    this.discountedPrice = parseFloat(this.discountedPrice.toFixed(0));
  }


  checkOutHandler() {

    if (this.isCart) {
      let orderData = {
        courseId: this.courseDetail._id,
        amount: this.courseDetail.price
      }
      this.singleCheckout(orderData);
    } else {
      let courseIds = this.cartData.map((dt) => dt.courseId);
      let orderData = {
        courseIds,
        amount: this.discountedPrice
      }
      this.cartCheckout(orderData, courseIds);
    }

  }

  singleCheckout(orderData: any) {
    this.paymentService.singleCheckout(orderData).subscribe((res) => {
      if (res.success) {
        this.openRazorpayCheckout(res.orderId, res.amount);
        this.toastMsgService.showSuccess("Success", "Order created successfully.");
      } else {
        this.toastMsgService.showInfo("Info", "Something went wrong, please try again later.");
      }

    }, (err) => {
      this.toastMsgService.showError("Error", err.error.message);

    });
  }

  cartCheckout(orderData: any, courseIds: string[]) {
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

  openRazorpayCheckout(orderId: String, amount: number, courseIds?: string[]) {

    const options: any = {
      key: appEnv.razorpayKey,
      amount: amount * 100,
      currency: 'INR',
      name: 'Skill Up.',
      description: 'Course Purchase',
      order_id: orderId,

      handler: (response: any) => {
        if (this.isCart) {
          this.handleCartPayment(response, courseIds || []);
        } else {
          this.handleSingleCoursePayment(response);
        }
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

  handleCartPayment(response: any, courseIds: string[]) {

    const data = {
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
      userId: this.userDetails._id,
      courseIds: courseIds
    };

    this.paymentService.cartPaymentVerify(data).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastMsgService.showSuccess('Success', 'Payment successful. Cart Courses added to your Learning.');
          this.navRouter.navigate(['/playlist']);
        }
      },
      error: (err) => {
        this.toastMsgService.showError('Error', err.error.message);
      }
    });
  }

  handleSingleCoursePayment(response: any) {

    const data = {
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
      userId: this.userDetails._id,
      courseId: this.courseDetail._id
    };

    this.paymentService.singlePaymentVerify(data).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastMsgService.showSuccess('Success', 'Payment successful. Course added to your Learning.');
          this.navRouter.navigate(['/playlist']);
        }
      },
      error: (err) => {
        this.toastMsgService.showError('Error', err.error.message);
      }
    });
  }

}
