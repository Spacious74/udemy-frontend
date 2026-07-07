import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog } from '../models/Blog';
import { basePath } from '../baseSettings/basePath';
@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = `${basePath}blog`; // Adjust base URL as needed based on environment

  constructor(private http: HttpClient) { }

  createBlog(blogData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, blogData, { withCredentials: true });
  }

  getAllBlogs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  getLatestBlogs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/latest`);
  }

  getBlogById(idOrSlug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${idOrSlug}`);
  }

  getAdminBlogs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/all`, { withCredentials: true });
  }

  toggleVisibility(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/visibility`, {}, { withCredentials: true });
  }
}
