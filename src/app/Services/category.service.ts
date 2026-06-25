import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';
import { basePath } from '../baseSettings/basePath';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private url = basePath + 'courseCategory/';

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.url + 'getAll');
  }

  getAllParentCategories(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.url + 'parents');
  }

  getSubCategoriesByParentId(parentId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.url + 'sub/' + parentId);
  }
}
