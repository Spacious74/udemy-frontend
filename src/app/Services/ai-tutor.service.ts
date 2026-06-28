import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { basePath } from '../baseSettings/basePath';
import { CookieService } from 'ngx-cookie-service';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiTutorService {
  private baseUrl = basePath;
  
  public isCourseMode = new BehaviorSubject<boolean>(false);
  public courseId = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.cookieService.get('skillUpToken');
    if (token) {
      headers = headers.append('AUTH_TOKEN', token);
    }
    return headers;
  }

  setCourseMode(isCourseMode: boolean, courseId: string | null = null) {
    this.isCourseMode.next(isCourseMode);
    this.courseId.next(courseId);
  }

  sendMessage(message: string): Observable<any> {
    return this.http.post(`${this.baseUrl}ai/chat`, {
      message,
      isCourseMode: this.isCourseMode.value,
      courseId: this.courseId.value
    }, { headers: this.getHeaders() });
  }

  getCourseChat(courseId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}ai/course-chat/${courseId}`, { headers: this.getHeaders() });
  }

  getDailyLimit(): Observable<any> {
    return this.http.get(`${this.baseUrl}ai/limit`, { headers: this.getHeaders() });
  }
}
