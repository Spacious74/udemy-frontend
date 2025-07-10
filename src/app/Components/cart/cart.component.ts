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
    private store: Store<{ userInfo: UserList, cart: Cart[] }>,
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
    this.router.navigate(['/'])
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

}
