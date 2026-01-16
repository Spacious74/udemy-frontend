import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface response{
    success : string, 
    pdfUrl : string,
}

@Injectable({
    providedIn: 'root',
})
export class CertificateService {
    private base_url: string = 'http://localhost:4000/skillup/api/v1/certificate/';
    constructor(private http: HttpClient) { }

    generateCertificate(userId : string, courseId:string){
        const url = `${this.base_url}generate`;
        return this.http.post<response>(url, { userId, courseId });
    }
}