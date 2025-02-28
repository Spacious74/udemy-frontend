import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppObject } from '../baseSettings/AppObject';
import { ApiResponse } from '../models/ApiResponse';
import { SectionList } from '../models/Course/SectionList';

@Injectable({
    providedIn: 'root',
})
export class AddVideoService {

    private base_url: string = 'http://localhost:4000/skillup/api/v1/videoModule/';
    constructor(private http: HttpClient) { }

    getAllVideoSections(courseId: any): Observable<ApiResponse<SectionList[]>> {
        let url = this.base_url + `getAllSections?courseId=${courseId}`;
        return this.http.get<ApiResponse<SectionList[]>>(url);
    }

    addSection(courseId: any, sectionName : string): Observable<ApiResponse<SectionList[]>>{
        let url = this.base_url + `add?courseId=${courseId}`;
        return this.http.post<ApiResponse<SectionList[]>>(url,{sectionName});
    }

    updateSection(courseId: string, sectionId:string, sectionName : string): Observable<ApiResponse<SectionList[]>>{
        let url = this.base_url + `update?courseId=${courseId}&sectionId=${sectionId}`;
        return this.http.put<ApiResponse<SectionList[]>>(url, {sectionName});
    }

    deleteSection(courseId:string, sectionId:string): Observable<ApiResponse<SectionList[]>>{
        let url = this.base_url + `delete?courseId=${courseId}&sectionId=${sectionId}`;
        return this.http.delete<ApiResponse<SectionList[]>>(url);
    }

    addVideoToSection(courseId: string, sectionId: string, videoTitle: string): Observable<ApiResponse<SectionList[]>>{
        let url = this.base_url + `addVideo?courseId=${courseId}&sectionId=${sectionId}`;
        return this.http.post<ApiResponse<SectionList[]>>(url, {videoTitle});
    }

    updateVideoFile(courseId : string, sectionId:string, videoId:string, videoInfo:any){
        let url = this.base_url + `updateVideoFile?courseId=${courseId}&sectionId=${sectionId}&videoId=${videoId}`;
        return this.http.put<ApiResponse<SectionList[]>>(url, videoInfo);
    }

    updateVideoTitle(courseId: string, sectionId: string, videoId: string, videoTitle: string): Observable<ApiResponse<SectionList[]>>{
        let url = this.base_url + `updateVideoTitle?courseId=${courseId}&sectionId=${sectionId}&videoId=${videoId}`;
        return this.http.put<ApiResponse<SectionList[]>>(url, {videoTitle});
    }

    deleteVideo(courseId: string, sectionId: string, videoId: string): Observable<ApiResponse<SectionList[]>>{
        let url = this.base_url + `deleteVideo?courseId=${courseId}&sectionId=${sectionId}&videoId=${videoId}`;
        return this.http.delete<ApiResponse<SectionList[]>>(url);
    }

}