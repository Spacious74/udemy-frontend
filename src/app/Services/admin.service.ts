import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { basePath } from '../baseSettings/basePath';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = basePath + 'admin';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  private getHeaders(): HttpHeaders {
    const token = this.cookieService.get('skillUpToken');
    return new HttpHeaders({
      'AUTH_TOKEN': token || ''
    });
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard-stats`, { headers: this.getHeaders() });
  }

  getUsers(page: number = 1, limit: number = 10, search: string = '', role: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (search) params = params.set('search', search);
    if (role) params = params.set('role', role);

    return this.http.get(`${this.baseUrl}/users`, { params, headers: this.getHeaders() });
  }

  getCourses(page: number = 1, limit: number = 10, search: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (search) params = params.set('search', search);

    return this.http.get(`${this.baseUrl}/courses`, { params, headers: this.getHeaders() });
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/courses/${id}`, { headers: this.getHeaders() });
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories`, { headers: this.getHeaders() });
  }

  addCategory(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/categories`, data, { headers: this.getHeaders() });
  }

  editCategory(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/categories/${id}`, data, { headers: this.getHeaders() });
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categories/${id}`, { headers: this.getHeaders() });
  }

  getTransactions(page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
      
    return this.http.get(`${this.baseUrl}/transactions`, { params, headers: this.getHeaders() });
  }
}
