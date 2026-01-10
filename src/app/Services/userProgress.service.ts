import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProgress } from '../models/UserProgress';

interface response {
    success: boolean;
    videosProgress : UserProgress;
}

@Injectable({
    providedIn: 'root',
})
export class UserProgressService {

    private base_url: string = 'http://localhost:4000/skillup/api/v1/user-progress/';
    constructor(private http: HttpClient) { }

    getUserProgress(userId?:string, courseId?:string): Observable<response> {
        let url = `${this.base_url}?userId=${userId}&courseId=${courseId}`;
        return this.http.get<response>(url);
    }

}
