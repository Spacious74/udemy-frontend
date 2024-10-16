import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
interface response {
  totalCourses: number;
  filteredResults: any[];
}
interface courseDetailsResponse {
  message: string;
  course: Object;
  reviews: {
    courseId: any;
    reviewArr: [{
      desc: string;
      rating: number;
      userId: string;
      username: string;
      _id: string;
    }];
  };
}
@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private base_url: string = 'http://localhost:4000/skillup/api/v1/';
  constructor(private http: HttpClient) {}
  public requestedCourse: any;

  fetchCourses(
    page: number,
    sort?: string,
    lang?: string,
    cate?: string,
    searchText? : string,
  ): Observable<response> {
    let url = this.base_url + 'course?page=' + page;
    if (sort) {
      url += '&sortOrder=' + sort;
    }
    if (lang) {
      url += '&language=' + lang;
    }
    if(cate){
      url += '&category=' + cate;
      console.log("Selected category : ", cate);
    }
    if(searchText){
      url += '&searchText='+searchText;
    }
    return this.http.get<response>(url);
  }

  getCourseById(id: any): Observable<courseDetailsResponse> {
    let url = this.base_url + 'course/' + id;
    return this.http.get<courseDetailsResponse>(url);
  }
}
