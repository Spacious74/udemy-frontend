import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
interface cartResponse  {
  cartItemsLength: number,
  isEmpty: boolean,
  cart: {
    _id: 'string',
    userId: 'string',
    cartItems: [],
    createdAt: Date,
    updatedAt: Date,
  }
}
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private base_url: string = 'http://localhost:4000/skillup/api/v1/';
  constructor(private http: HttpClient) { }

  getCart() : Observable<cartResponse>{
    let url = this.base_url + 'cart/get/' + localStorage.getItem("userId");
    return this.http.get<cartResponse>(url,  { withCredentials: true });
  }
}
