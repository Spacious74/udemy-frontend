import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { basePath } from '../baseSettings/basePath';
import { AppObject } from '../baseSettings/AppObject';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/AuthResponse';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  public previousUrl : string | null = null;
  constructor(private http: HttpClient, private router : Router) {
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

  login(userData : any): Observable<AuthResponse> {
    let url = basePath + 'user/login';
    return this.http.post<AuthResponse>(url, userData);
  }

  getUserData(token):Observable<AuthResponse>{
    let url = basePath + 'user/getUserLogonData';
    const headers = AppObject.prepareGetJsonHeader();
    console.log("Header = ",headers);
    return this.http.get<AuthResponse>(url, {headers});
  }

  getPreviousUrl(): string | null {
    return this.previousUrl;
  }
}
