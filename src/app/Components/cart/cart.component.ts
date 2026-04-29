import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../Services/cart.service';
import { CookieService } from 'ngx-cookie-service';
import { UserList } from '../../models/UserList';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { CartItem } from '../../models/CartItems';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';
import { CartStateService } from '../../Services/cartState.service';
import { FooterComponent } from '../footer/footer.component';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ButtonModule, DividerModule, FooterComponent],
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
    private cartStateService: CartStateService,
    private cookieService: CookieService,
    private store: Store<{ userInfo: UserList }>,
    private toastMsgService: ToastMessageService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

  }

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
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem("cartCourses");
      this.cartData = data ? JSON.parse(data) : [];
    } else {
      this.cartData = []; // SSR fallback
    }
    this.cartItemsLength = this.cartData.length;
    if (this.cartItemsLength > 0) {
      this.calculateTotalPrice();
    }
  }

  removeFromCart(courseId: string) {

    if (!this.token) {
      this.cartStateService.removeFromCart(null, courseId).subscribe(() => {
        this.loadCartDataFromStorage();
        this.toastMsgService.showSuccess("Success", "Course removed from cart successfully.");
      });
      return;
    }

    this.cartStateService.removeFromCart(this.userDetails._id, courseId)
      .subscribe(() => {
        this.fetchCartData();
        this.toastMsgService.showSuccess("Success", "Cart item removed.");
      });

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
