import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../Services/cart.service';
import { Store } from '@ngrx/store';
import { Cart } from '../../models/Cart';
import { Observable } from 'rxjs';
import { removeFromCartAction } from '../../store/actions/cart.action';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  public cartData$ : Observable<Cart[]>
  public course : any[];
  public cartItemsLength: number = 0;
  public cartData : Cart[];

  constructor(
    private cartService : CartService,
    private store : Store<{cart : Cart[]}>
  ){
    this.cartData$ = this.store.select("cart");
  }

  ngOnInit(): void {
    this.cartData$.subscribe((res)=>{
      this.cartItemsLength = res.length;
    });
    this.loadCartFromLocalStorage();
  }
  
  fetchCartData(){
    this.cartService.getCart().subscribe((res)=>{
      // console.log(res);
    })
  }

  loadCartFromLocalStorage(){
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartData = cart;
  }

  removeFromCart(courseId:string){
    let payloadData = {
      courseId: courseId,
    }
    this.store.dispatch(removeFromCartAction({payload : payloadData}))
  }

}
