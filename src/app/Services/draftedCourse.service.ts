import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseDetailDto } from '../models/Course/CourseDetailDto';
import { AuthResponse } from '../models/AuthResponse';
import { ApiResponse } from '../models/ApiResponse';
import { CourseList } from '../models/Course/CourseList';
import { DraftCourse } from '../models/Course/DraftCourse';

@Injectable({
    providedIn: 'root',
})
export class DraftedCourseService {

    private base_url: string = 'http://localhost:4000/skillup/api/v1/draftedCourse/';
    constructor(private http: HttpClient) { }
    public requestedCourse: any;

    getOneDraftedCourseById(courseId : string): Observable<ApiResponse<DraftCourse>> {
        let url = this.base_url + `courseId=${courseId}`;
        return this.http.get<ApiResponse<DraftCourse>>(url);
    }

    getAllDraftedCourseById(educatorId: any): Observable<ApiResponse<CourseList[]>> {
        let url = this.base_url + `?educatorId=${educatorId}`;
        return this.http.get<ApiResponse<CourseList[]>>(url);
    }

    createCourse(data: CourseDetailDto): Observable<ApiResponse<DraftCourse>> {
        let url = this.base_url + 'create';
        return this.http.post<ApiResponse<DraftCourse>>(url, data);
    }

}
