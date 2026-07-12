import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog } from '../models/Blog';
import { basePath } from '../baseSettings/basePath';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = `${basePath}blog`; // Adjust base URL as needed based on environment

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  private getHeaders(): HttpHeaders {
    const token = this.cookieService.get('skillUpToken');
    return new HttpHeaders({
      'AUTH_TOKEN': token || ''
    });
  }

  createBlog(blogData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, blogData, { headers: this.getHeaders(), withCredentials: true });
  }

  updateBlog(id: string, blogData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, blogData, { headers: this.getHeaders(), withCredentials: true });
  }

  getAllBlogs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  getLatestBlogs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/latest`, { headers: this.getHeaders() });
  }

  getBlogById(idOrSlug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${idOrSlug}`, { headers: this.getHeaders() });
  }

  getAdminBlogs(page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<any>(`${this.apiUrl}/admin/all`, { headers: this.getHeaders(), withCredentials: true, params });
  }

  toggleVisibility(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/visibility`, {}, { headers: this.getHeaders(), withCredentials: true });
  }

  uploadCoverImage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/upload-cover`, formData, { headers: this.getHeaders(), withCredentials: true });
  }

  deleteCoverImage(publicId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-cover`, { headers: this.getHeaders(), withCredentials: true, body: { public_id: publicId } });
  }

  updateCoverImage(formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-cover`, formData, { headers: this.getHeaders(), withCredentials: true });
  }
}
