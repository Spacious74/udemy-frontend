import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';



export class AppObject {

    public static userData : any = null;
    public static AuthToken: string;

    private static getToken(): string {
        if (this.AuthToken) return this.AuthToken;
        if (typeof document !== 'undefined') {
            const match = document.cookie.match(new RegExp('(^| )skillUpToken=([^;]+)'));
            if (match) return match[2];
        }
        return '';
    }

    public static preparePostJsonHeader(includeAuthToken: boolean = true): HttpHeaders {
        var headers = new HttpHeaders({'credentials': 'include'});
        headers = headers.append('content-type', 'application/json');
        if (includeAuthToken) {
            const token = this.getToken();
            if (token) headers = headers.append('AUTH_TOKEN', token);
        }
        return headers;
    }

    public static preparePostFormHeader(includeAuthToken: boolean = true): HttpHeaders {
        var headers = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        if (includeAuthToken) {
            const token = this.getToken();
            if (token) headers = headers.append('AUTH_TOKEN', token);
        }
        return headers;
    }

  
    public static prepareGetJsonHeader(
        includeAuthToken: boolean = true
    ): HttpHeaders {
        var headers = new HttpHeaders({
            'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
            'Pragma': 'no-cache',
        });
        headers = headers.append('content-type', 'application/json');
        if (includeAuthToken) {
            const token = this.getToken();
            if (token) headers = headers.append('AUTH_TOKEN', token);
        }
        return headers;
    }

}
