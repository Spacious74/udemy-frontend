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
  },
  message : string,
  success : boolean
}
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private base_url: string = 'http://localhost:4000/skillup/api/v1/cart/';
  constructor(private http: HttpClient) { }

  getCart() : Observable<cartResponse>{
    let url = this.base_url + 'get/' + localStorage.getItem("userId");
    return this.http.get<cartResponse>(url,  { withCredentials: true });
  }

  addToCart(userId:string, courseId : string): Observable<cartResponse>{
    let url = this.base_url + `addToCart?userId=${userId}&courseId=${courseId}`;
    return this.http.post<cartResponse>(url, null);
  }

  removeFromCart(userId:string, courseId : string): Observable<cartResponse>{
    let url = this.base_url + `removeFromCart?userId=${userId}&courseId=${courseId}`;
    return this.http.post<cartResponse>(url, null);
  }

}
