import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseDetailDto } from '../models/Course/CourseDetailDto';
import { AuthResponse } from '../models/AuthResponse';
import { ApiResponse } from '../models/ApiResponse';
import { DraftCourse } from '../models/Course/DraftCourse';
import { AppObject } from '../baseSettings/AppObject';
import { SectionList } from '../models/Course/SectionList';
import { basePath } from '../baseSettings/basePath';
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

    private base_url: string = `${basePath}draftedCourse/`;
    constructor(private http: HttpClient) { }

    getAllCourses(query: any): Observable<response> {
        let params: any = {};

        if (query.page) params.page = query.page;
        if (query.sortOrder) params.sortOrder = query.sortOrder;
        if (query.language) params.language = query.language;
        if (query.category) params.category = query.category;
        if (query.searchText) params.searchText = query.searchText;
        if (query.level) params.level = query.level;
        if (query.priceType) params.priceType = query.priceType;

        return this.http.get<response>(`${this.base_url}getAllCourses`, { params });
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
        const headers = AppObject.prepareGetJsonHeader();
        return this.http.get<ApiResponse<DraftCourse>>(url, { headers });
    }

    getAllDraftedCourseById(educatorId: any): Observable<ApiResponse<DraftCourse[]>> {
        let url = this.base_url + `?educatorId=${educatorId}`;
        const headers = AppObject.prepareGetJsonHeader();
        return this.http.get<ApiResponse<DraftCourse[]>>(url, { headers });
    }

    getReleasedCourses(educatorId: any): Observable<ApiResponse<DraftCourse[]>> {
        let url = this.base_url + `released?educatorId=${educatorId}`;
        const headers = AppObject.prepareGetJsonHeader();
        return this.http.get<ApiResponse<DraftCourse[]>>(url, { headers });
    }

    createCourse(data: CourseDetailDto): Observable<ApiResponse<DraftCourse>> {
        let url = this.base_url + 'create';
        const headers = AppObject.preparePostJsonHeader();
        return this.http.post<ApiResponse<DraftCourse>>(url, data, { headers });
    }

    updateCourse(courseId: string, data: CourseDetailDto): Observable<ApiResponse<DraftCourse>> {
        let url = this.base_url + 'update?courseId=' + courseId;
        const headers = AppObject.preparePostJsonHeader();
        return this.http.post<ApiResponse<DraftCourse>>(url, data, { headers });
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
        const headers = AppObject.preparePostJsonHeader();
        return this.http.post<ApiResponse<string>>(url, {}, { headers });
    }

    getEnrolledStudents(courseId: string, educatorId: string): Observable<any> {
        let url = this.base_url + `enrolled-students?courseId=${courseId}&educatorId=${educatorId}`;
        const headers = AppObject.prepareGetJsonHeader();
        return this.http.get<any>(url, { headers });
    }

}
