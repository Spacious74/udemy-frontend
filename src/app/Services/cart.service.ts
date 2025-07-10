import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Cart } from '../models/Cart';
interface cartResponse {
  cartItemsLength: number;
  cart: Cart;
  message: string;
  success: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class CartService {

  private base_url: string = 'http://localhost:4000/skillup/api/v1/cart/';
  constructor(private http: HttpClient, private cookieService : CookieService) { }

  getCart(userId: string): Observable<cartResponse> {

    let url = this.base_url + 'getCart?userId=' + userId;

    var headers = new HttpHeaders({ 'credentials': 'include' });
    headers = headers.append('content-type', 'application/json');
    const token = this.cookieService.get("skillUpToken");
    headers = headers.append('AUTH_TOKEN', token);

    return this.http.get<cartResponse>(url, {headers, withCredentials: true });

  }

  addToCart(userId: string, courseId: string): Observable<cartResponse> {
    let url = this.base_url + `addToCart?userId=${userId}&courseId=${courseId}`;
    var headers = new HttpHeaders({ 'credentials': 'include' });
    headers = headers.append('content-type', 'application/json');
    const token = this.cookieService.get("skillUpToken");
    headers = headers.append('AUTH_TOKEN', token);
    return this.http.post<cartResponse>(url, {headers, withCredentials: true });
  }

  removeFromCart(userId: string, courseId: string): Observable<cartResponse> {
    let url = this.base_url + `removeFromCart?userId=${userId}&courseId=${courseId}`;
    return this.http.post<cartResponse>(url, null);
  }

  mergeCart(userId: string, cartItems: string): Observable<cartResponse> {
    let url = this.base_url + `mergeCart?userId=${userId}`;
    var headers = new HttpHeaders({ 'credentials': 'include' });
    const token = this.cookieService.get("skillUpToken");
    headers = headers.append('AUTH_TOKEN', token);
    return this.http.post<cartResponse>(url, {cartItems } , {headers, withCredentials: true });
  }

}
