import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseDetailDto } from '../models/Course/CourseDetailDto';
import { AuthResponse } from '../models/AuthResponse';
import { ApiResponse } from '../models/ApiResponse';
import { DraftCourse } from '../models/Course/DraftCourse';
import { AppObject } from '../baseSettings/AppObject';
import { SectionList } from '../models/Course/SectionList';
interface response {
    totalCourses: number;
    data: any[];
    success: boolean;
}
interface courseDetailsResponse {
    message: string;
    course: DraftCourse;
    success: boolean;
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

interface courseAndPlaylistRes {
    message: string;
    success: boolean;
    course: DraftCourse;
    sectionArr : SectionList[];
}

@Injectable({
    providedIn: 'root',
})
export class DraftedCourseService {

    private base_url: string = 'http://localhost:4000/skillup/api/v1/draftedCourse/';
    constructor(private http: HttpClient) { }

    getAllCourses(page?: number, sort?: string, lang?: string, cate?: string, searchText?: string,
    ): Observable<response> {
        let url = this.base_url + 'getAllCourses?page=' + page;
        if (sort) url += '&sortOrder=' + sort;
        if (lang) url += '&language=' + lang;
        if (cate) url += '&category=' + cate;
        if (searchText) url += '&searchText=' + searchText;
        return this.http.get<response>(url);
    }

    getCourseDetailsById(courseId: string): Observable<courseDetailsResponse> {
        let url = this.base_url + `getCourseDetailsById?courseId=${courseId}`;
        return this.http.get<courseDetailsResponse>(url);
    }

    getCourseAndPlaylist(courseId: string): Observable<courseAndPlaylistRes> {
        let url = this.base_url + `getCourseAndPlaylist?courseId=${courseId}`;
        return this.http.get<courseAndPlaylistRes>(url);
    }

    getCourseByCourseAndEducatorId(courseId: string, educatorId: string): Observable<ApiResponse<DraftCourse>> {
        let url = this.base_url + `getByCourseAndEducatorId?courseId=${courseId}&educatorId=${educatorId}`;
        return this.http.get<ApiResponse<DraftCourse>>(url);
    }

    getAllDraftedCourseById(educatorId: any): Observable<ApiResponse<DraftCourse[]>> {
        let url = this.base_url + `?educatorId=${educatorId}`;
        return this.http.get<ApiResponse<DraftCourse[]>>(url);
    }

    getReleasedCourses(educatorId: any): Observable<ApiResponse<DraftCourse[]>> {
        let url = this.base_url + `released?educatorId=${educatorId}`;
        return this.http.get<ApiResponse<DraftCourse[]>>(url);
    }

    createCourse(data: CourseDetailDto): Observable<ApiResponse<DraftCourse>> {
        let url = this.base_url + 'create';
        return this.http.post<ApiResponse<DraftCourse>>(url, data);
    }

    updateCourse(courseId: string, data: CourseDetailDto): Observable<ApiResponse<DraftCourse>> {
        let url = this.base_url + 'update?courseId=' + courseId;
        return this.http.post<ApiResponse<DraftCourse>>(url, data);
    }

    uploadThumbnail(formData: any, courseId: string): Observable<AuthResponse> {
        let url = this.base_url + 'upload-thumbnail?courseId=' + courseId;
        const headers = AppObject.preparePostFormHeader();
        return this.http.post<AuthResponse>(url, formData, { headers });
    }

    deleteThumbnail(courseId: string): Observable<AuthResponse> {
        let url = this.base_url + 'remove-thumbnail?courseId=' + courseId;
        const headers = AppObject.preparePostFormHeader();
        return this.http.delete<AuthResponse>(url, { headers });
    }

    deleteCourse(courseId: string): Observable<AuthResponse> {
        let url = this.base_url + 'delete-course?courseId=' + courseId;
        const headers = AppObject.preparePostFormHeader();
        return this.http.delete<AuthResponse>(url, { headers });
    }

    releaseCourse(courseId: string): Observable<ApiResponse<string>> {
        let url = this.base_url + 'release-course?courseId=' + courseId;
        return this.http.post<ApiResponse<string>>(url, {});
    }

}
