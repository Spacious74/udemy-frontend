import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../Services/cart.service';
import { Store } from '@ngrx/store';
import { Cart } from '../../models/Cart';
import { Observable } from 'rxjs';
import { removeFromCartAction } from '../../store/actions/cart.action';
import { CookieService } from 'ngx-cookie-service';
import { UserList } from '../../models/UserList';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  providers : [ToastMessageService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  public cartData$ : Observable<Cart[]>
  public course : any[];
  public cartItemsLength: number = 0;
  public cartData : Cart[];
  public userDetails : UserList;
  public token : string = null;

  constructor(
    private cartService : CartService,
    private store : Store<{userInfo : UserList, cart : Cart[]}>,
    private cookieService : CookieService,
    private toastMsgService : ToastMessageService
  ){
    this.cartData$ = this.store.select("cart");
  }

  ngOnInit(): void {

    this.token = this.cookieService.get("skillUpToken");
    this.cartData$.subscribe((res)=>{
      this.cartItemsLength = res.length;
    });

    this.store.select("userInfo").subscribe((res)=>{
      this.userDetails = res;
    });

    if(this.token){
      this.fetchCartData();
    }else{
      this.loadCartFromLocalStorage();
    }

  }
  
  fetchCartData(){
    this.cartService.getCart(this.userDetails._id).subscribe((res)=>{
      this.cartData = res.cart.cartItems;
    },(err)=>{
      this.toastMsgService.showError("Error", "Some internal error occured.");
    })
  }

  loadCartFromLocalStorage(){
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartData = cart;
  }

  removeFromCart(courseId:string){

    let payloadData = {courseId: courseId};
    this.store.dispatch(removeFromCartAction({payload : payloadData}));

    if(this.token){
      this.cartService.removeFromCart(this.userDetails._id, courseId).subscribe((res)=>{
        if(res.success){
          this.toastMsgService.showSuccess("Success", "Item removed from cart.");
        }
      },(err)=>{
        this.toastMsgService.showError("Error", err.message);
      })
    }else{
      let cart = JSON.parse(localStorage.getItem('cart') || '[]'); 
      cart = cart.filter((item: any) => item.courseId !== courseId);
      localStorage.setItem('cart', JSON.stringify(cart));
    }

  }

}
