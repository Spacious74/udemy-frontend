import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export class Reviews {
    _id?: string;  
    userId: string;
    username: string;
    rating: number;
    desc: string
}

interface response{
    success : boolean,
    message : string,
    reviews : Reviews[],
    overallRating : number,
    userReview : Reviews,
}

@Injectable({
    providedIn: 'root'
})
export class RateAndReviewService {

    private base_url: string = 'http://localhost:4000/skillup/api/v1/review/';
    constructor(private http: HttpClient,) { }

    // ✅ GET ALL REVIEWS OF A COURSE
    getReviews(userId:string, courseId: string): Observable<response> {
        return this.http.get<response>(
            `${this.base_url}getReviews?courseId=${courseId}&userId=${userId}`
        );
    }

    // ✅ ADD NEW REVIEW
    postReview(data: Reviews, courseId: string): Observable<response> {
        return this.http.post<response>(`${this.base_url}addReview?courseId=${courseId}`,data);
    }

    // ✅ UPDATE REVIEW
    updateReview(courseId:string, userId: string, data: Partial<Reviews>): Observable<response> {
        return this.http.put<response>(`${this.base_url}updateReview?courseId=${courseId}&userId=${userId}`,data);
    }

    // ✅ DELETE REVIEW
    deleteReview(courseId:string, userId: string): Observable<response> {
        return this.http.delete<response>(`${this.base_url}deleteReview?courseId=${courseId}&userId=${userId}`);
    }


}