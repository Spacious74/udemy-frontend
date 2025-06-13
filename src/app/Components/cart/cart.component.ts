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
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  providers : [ToastMessageService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  public course : any[];
  public cartItemsLength: number = 0;
  public cartData : CartItem[];
  public userDetails : UserList;
  public token : string = null;

  constructor(
    private cartService : CartService,
    private store : Store<{userInfo : UserList, cart : Cart[]}>,
    private toastMsgService : ToastMessageService
  ){}

  ngOnInit(): void {
    this.store.select("userInfo").subscribe((res)=>{
      this.userDetails = res;
      this.fetchCartData();
    });
  }
  
  fetchCartData(){
    this.cartService.getCart(this.userDetails._id).subscribe((res)=>{
      this.cartData = res.cart.cartItems;
      this.cartItemsLength = res.cartItemsLength;
    },(err)=>{
      this.toastMsgService.showError("Error", "Some internal error occured.");
    })
  }

  loadCartFromLocalStorage(){
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartData = cart;
  }

  removeFromCart(courseId:string){

    this.cartService.removeFromCart(this.userDetails._id, courseId).subscribe((res)=>{
      if(res.success){
        this.toastMsgService.showSuccess("Success", "Item removed from cart.");
      }
    },(err)=>{
      this.toastMsgService.showError("Error", err.message);
    })

  }

}
