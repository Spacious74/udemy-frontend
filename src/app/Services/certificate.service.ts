import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { basePath } from '../baseSettings/basePath';

interface response{
    success : string, 
    pdfUrl : string,
}
interface response2{
    success : boolean,
    certificates : [{
        certificateId: string;
        userId: string;
        userName: string;
        courseId: string;
        courseName: string;
        instructorName: string;
        pdfUrl: string;
        pngUrl : string;
        verificationUrl: string;
        issuedAt: Date;
    }]
}

@Injectable({
    providedIn: 'root',
})
export class CertificateService {
    private base_url: string = `${basePath}certificate/`;
    constructor(private http: HttpClient) { }

    generateCertificate(userId : string, courseId:string){
        const url = `${this.base_url}generate`;
        return this.http.post<response>(url, { userId, courseId });
    }

    getAllCertificates(userId : string):Observable<response2>{
        const url = `${this.base_url}getAllCertificates?userId=${userId}`;
        return this.http.get<response2>(url);
    }

}