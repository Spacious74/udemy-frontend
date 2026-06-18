import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { basePath } from '../baseSettings/basePath';
import { AppObject } from '../baseSettings/AppObject';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/AuthResponse';
import { UserDto } from '../models/UserDto';
import { CookieService } from 'ngx-cookie-service';

interface UserResponse {
  data: any,
  success: boolean
}

interface GoogleAuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public previousUrl: string | null = null;
  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Store the previous URL before navigation
        this.previousUrl = this.router.url;
      }
    });
  }

  register(userData: any): Observable<AuthResponse> {
    let url = basePath + 'user/register';
    return this.http.post<AuthResponse>(url, userData);
  }

  login(userData: any): Observable<AuthResponse> {
    let url = basePath + 'user/login';
    return this.http.post<AuthResponse>(url, userData);
  }

  googleSignup(token: string): Observable<GoogleAuthResponse> {
    let url = basePath + 'user/google/signup';
    return this.http.post<GoogleAuthResponse>(url,{ token });
  }

  googleLogin(token: string): Observable<GoogleAuthResponse> {
    let url = basePath + 'user/google/login';
    return this.http.post<GoogleAuthResponse>(url,{ token });
  }

  verifyEmail(token: string): Observable<AuthResponse> {
    let url = basePath + 'user/verify-email?token=' + token;
    return this.http.get<AuthResponse>(url);
  }

  resendVerification(email: string): Observable<AuthResponse> {
    let url = basePath + 'user/resend-verification';
    return this.http.post<AuthResponse>(url, { email });
  }

  getUserData(sendedtoken?: string): Observable<AuthResponse> {
    let url = basePath + 'user/getUserLogonData';
    var headers = new HttpHeaders({ 'credentials': 'include' });
    headers = headers.append('content-type', 'application/json');
    const token = this.cookieService.get("skillUpToken");
    headers = headers.append('AUTH_TOKEN', token);
    return this.http.get<AuthResponse>(url, { headers });
  }

  getUserCoursesEnrolled(): Observable<UserResponse> {
    let url = basePath + 'user/get-user-courses-enrolled';
    var headers = new HttpHeaders({ 'credentials': 'include' });
    headers = headers.append('content-type', 'application/json');
    const token = this.cookieService.get("skillUpToken");
    headers = headers.append('AUTH_TOKEN', token);
    return this.http.get<UserResponse>(url, { headers });
  }

  updateUser(body: UserDto): Observable<AuthResponse> {
    let url = basePath + 'user/update';
    const headers = AppObject.preparePostJsonHeader();
    return this.http.post<AuthResponse>(url, body, { headers });
  }

  uploadUserProfile(formData: any): Observable<AuthResponse> {
    let url = basePath + 'user/upload';
    const headers = AppObject.preparePostFormHeader();
    return this.http.post<AuthResponse>(url, formData, { headers });
  }

  deleteUserImage(): Observable<AuthResponse> {
    let url = basePath + 'user/deleteImage';
    const headers = AppObject.preparePostFormHeader();
    return this.http.delete<AuthResponse>(url, { headers });
  }

  getPreviousUrl(): string | null {
    if (this.previousUrl && (this.previousUrl.includes('/login') || this.previousUrl.includes('/signup') || this.previousUrl.includes('/verify-email'))) {
      return null;
    }
    return this.previousUrl;
  }
}
