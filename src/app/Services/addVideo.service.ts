import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';
import { SectionList } from '../models/Course/SectionList';
import { VideoList } from '../models/Course/VideoList';
import { AppObject } from '../baseSettings/AppObject';
import { basePath } from '../baseSettings/basePath';
interface videoResponse {
    success : boolean;
    videoObj : VideoList
}
@Injectable({
    providedIn: 'root',
})
export class AddVideoService {

    private base_url: string = `${basePath}videoModule/`;
    constructor(private http: HttpClient) { }

    getAllVideoSections(courseId: any): Observable<ApiResponse<SectionList[]>> {
        let url = this.base_url + `getAllSections?courseId=${courseId}`;
        const headers = AppObject.prepareGetJsonHeader();
        return this.http.get<ApiResponse<SectionList[]>>(url, { headers });
    }

    addSection(courseId: any, sectionName: string): Observable<ApiResponse<SectionList[]>> {
        let url = this.base_url + `add?courseId=${courseId}`;
        const headers = AppObject.preparePostJsonHeader();
        return this.http.post<ApiResponse<SectionList[]>>(url, { sectionName }, { headers });
    }

    updateSection(courseId: string, sectionId: string, sectionName: string): Observable<ApiResponse<SectionList[]>> {
        let url = this.base_url + `update?courseId=${courseId}&sectionId=${sectionId}`;
        const headers = AppObject.preparePostJsonHeader();
        return this.http.put<ApiResponse<SectionList[]>>(url, { sectionName }, { headers });
    }

    deleteSection(courseId: string, sectionId: string): Observable<ApiResponse<SectionList[]>> {
        let url = this.base_url + `delete?courseId=${courseId}&sectionId=${sectionId}`;
        const headers = AppObject.preparePostJsonHeader();
        return this.http.delete<ApiResponse<SectionList[]>>(url, { headers });
    }

    addVideoToSection(courseId: string, sectionId: string, videoTitle: string, isFree: boolean): Observable<ApiResponse<SectionList[]>> {
        let url = this.base_url + `addVideo?courseId=${courseId}&sectionId=${sectionId}`;
        const headers = AppObject.preparePostJsonHeader();
        return this.http.post<ApiResponse<SectionList[]>>(url, { videoTitle, isFree }, { headers });
    }

    addVideoFile(courseId: string, sectionId: string, videoId: string, videoInfo: any) {
        let url = this.base_url + `addVideoFile?courseId=${courseId}&sectionId=${sectionId}&videoId=${videoId}`;
        const headers = AppObject.preparePostJsonHeader();
        return this.http.put<ApiResponse<SectionList[]>>(url, videoInfo, { headers });
    }

    updateVideoFile(courseId: string, sectionId: string, videoId: string, videoInfo: any) {
        let url = this.base_url + `updateVideoFile?courseId=${courseId}&sectionId=${sectionId}&videoId=${videoId}`;
        const headers = AppObject.preparePostJsonHeader();
        return this.http.put<ApiResponse<SectionList[]>>(url, videoInfo, { headers });
    }

    updateVideoTitle(courseId: string, sectionId: string, videoId: string, videoTitle: string, isFree: boolean): Observable<ApiResponse<SectionList[]>> {
        let url = this.base_url + `updateVideoTitle?courseId=${courseId}&sectionId=${sectionId}&videoId=${videoId}`;
        const headers = AppObject.preparePostJsonHeader();
        return this.http.put<ApiResponse<SectionList[]>>(url, { videoTitle, isFree }, { headers });
    }

    deleteVideo(courseId: string, sectionId: string, videoId: string): Observable<ApiResponse<SectionList[]>> {
        let url = this.base_url + `deleteVideo?courseId=${courseId}&sectionId=${sectionId}&videoId=${videoId}`;
        const headers = AppObject.preparePostJsonHeader();
        return this.http.delete<ApiResponse<SectionList[]>>(url, { headers });
    }

}