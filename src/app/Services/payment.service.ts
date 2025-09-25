import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

interface PaymentResponse {
    message: String,
    orderId: String,
    amount: number,
    currency: String,
    success: boolean
}

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    private base_url: string = 'http://localhost:4000/skillup/api/v1/payment/';
    constructor(private http: HttpClient, private cookieService: CookieService) { }

    singleCheckout(checkOutData: any): Observable<PaymentResponse> {
        let url = this.base_url + 'single-checkout-order';
        var headers = new HttpHeaders({ 'credentials': 'include' });
        const token = this.cookieService.get("skillUpToken");
        headers = headers.append('AUTH_TOKEN', token);
        return this.http.post<PaymentResponse>(url, checkOutData, { headers, withCredentials: true });
    }

    cartCheckout(checkOutData: any): Observable<PaymentResponse> {
        let url = this.base_url + 'cart-checkout-order';
        var headers = new HttpHeaders({ 'credentials': 'include' });
        const token = this.cookieService.get("skillUpToken");
        headers = headers.append('AUTH_TOKEN', token);
        return this.http.post<PaymentResponse>(url, checkOutData, { headers, withCredentials: true });
    }

    singlePaymentVerify(body : any): Observable<PaymentResponse> {
        let url = this.base_url + 'single-payment-verification';
        var headers = new HttpHeaders({ 'credentials': 'include' });
        const token = this.cookieService.get("skillUpToken");
        headers = headers.append('AUTH_TOKEN', token);
        return this.http.post<PaymentResponse>(url, body, { headers, withCredentials: true });
    }

    cartPaymentVerify(body : any): Observable<PaymentResponse> {
        let url = this.base_url + 'cart-payment-verification';
        var headers = new HttpHeaders({ 'credentials': 'include' });
        const token = this.cookieService.get("skillUpToken");
        headers = headers.append('AUTH_TOKEN', token);
        return this.http.post<PaymentResponse>(url, body, { headers, withCredentials: true });
    }

    

}
