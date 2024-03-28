import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private signupUrl: string = 'http://localhost:4000/skillup/api/v1/user/register';
  private loginUrl: string = 'http://localhost:4000/skillup/api/v1/user/login';
  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId : Object) {}
  public username: string = '';
  public email: string = '';
  register(userData: any) {
    return this.http.post<any>(this.signupUrl, userData, { withCredentials: true });
  }
  login(userData : any){
    return this.http.post<any>(this.loginUrl, userData, { withCredentials: true });
  }
  isLoggedIn() {
    if (isPlatformBrowser(this.platformId)) {
      return document.cookie.includes('mytoken');
    }else{
      return false;
    }
  }
}
