import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { basePath } from '../baseSettings/basePath';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class QnaService {

  private apiUrl = basePath + 'qna';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  private getAuthOptions() {
    let headers = new HttpHeaders({ 'credentials': 'include' });
    headers = headers.append('content-type', 'application/json');
    const token = this.cookieService.get("skillUpToken");
    headers = headers.append('AUTH_TOKEN', token);
    
    return {
      headers: headers,
      withCredentials: true
    };
  }

  askQuestion(courseId: string, lectureId: string, questionTitle: string, questionDescription: string): Observable<any> {
    const body = { courseId, lectureId, questionTitle, questionDescription };
    return this.http.post(`${this.apiUrl}/question`, body, this.getAuthOptions());
  }

  addAnswer(questionId: string, answer: string): Observable<any> {
    const body = { questionId, answer };
    return this.http.post(`${this.apiUrl}/answer`, body, this.getAuthOptions());
  }

  getQuestionsForLecture(lectureId: string, page: number = 1, limit: number = 5): Observable<any> {
    return this.http.get(`${this.apiUrl}/questions/${lectureId}?page=${page}&limit=${limit}`, this.getAuthOptions());
  }

  getQuestionDetails(questionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/question/${questionId}`, this.getAuthOptions());
  }

  getTeacherCoursesWithQuestions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/teacher/courses`, this.getAuthOptions());
  }

  getTeacherQnaAnalytics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/teacher/analytics`, this.getAuthOptions());
  }
}
