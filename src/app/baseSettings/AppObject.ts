import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';



export class AppObject {

    public static userData : any = null;
    public static AuthToken: string;
    public static preparePostJsonHeader(includeAuthToken: boolean = true): HttpHeaders {
        var headers = new HttpHeaders({'credentials': 'include'});
        headers = headers.append('content-type', 'application/json');
        if (includeAuthToken) {
            headers = headers.append('AUTH_TOKEN', this.AuthToken);
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
            headers = headers.append('AUTH_TOKEN', this.AuthToken);
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
            headers = headers.append('AUTH_TOKEN', this.AuthToken);
        }
        return headers;
    }

}
