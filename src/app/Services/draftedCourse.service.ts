import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseDetailDto } from '../models/Course/CourseDetailDto';
import { AuthResponse } from '../models/AuthResponse';
import { ApiResponse } from '../models/ApiResponse';
import { CourseList } from '../models/Course/CourseList';
import { DraftCourse } from '../models/Course/DraftCourse';
import { AppObject } from '../baseSettings/AppObject';

@Injectable({
    providedIn: 'root',
})
export class DraftedCourseService {

    private base_url: string = 'http://localhost:4000/skillup/api/v1/draftedCourse/';
    constructor(private http: HttpClient) { }

    getCourseByCourseAndEducatorId(courseId : string, educatorId:string): Observable<ApiResponse<DraftCourse>> {
        let url = this.base_url + `getByCourseAndEducatorId?courseId=${courseId}&educatorId=${educatorId}`;
        return this.http.get<ApiResponse<DraftCourse>>(url);
    }

    getAllDraftedCourseById(educatorId: any): Observable<ApiResponse<DraftCourse[]>> {
        let url = this.base_url + `?educatorId=${educatorId}`;
        return this.http.get<ApiResponse<DraftCourse[]>>(url);
    }

    createCourse(data: CourseDetailDto): Observable<ApiResponse<DraftCourse>> {
        let url = this.base_url + 'create';
        return this.http.post<ApiResponse<DraftCourse>>(url, data);
    }

    updateCourse(courseId : string, data: CourseDetailDto): Observable<ApiResponse<DraftCourse>> {
        let url = this.base_url + 'update?courseId=' + courseId;
        return this.http.post<ApiResponse<DraftCourse>>(url, data);
    }

    uploadThumbnail(formData:any, courseId:string):Observable<AuthResponse>{
        let url = this.base_url + '/upload-thumbnail?courseId=' + courseId;
        const headers = AppObject.preparePostFormHeader();
        return this.http.post<AuthResponse>(url, formData, {headers});
    }

    deleteThumbnail(courseId:string):Observable<AuthResponse>{
        let url = this.base_url + '/remove-thumbnail?courseId=' + courseId;
        const headers = AppObject.preparePostFormHeader();
        return this.http.delete<AuthResponse>(url, {headers});
    }

}
