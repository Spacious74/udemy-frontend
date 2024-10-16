import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AppObject } from './baseSettings/AppObject';
import { AuthService } from './Services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastMessageService } from './baseSettings/services/toastMessage.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastModule],
  providers: [MessageService, ToastMessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public userDetails: any = null;
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private toastMsgService: ToastMessageService,
  ) { }
  ngOnInit(): void {
    let token = this.cookieService.get('skillUpToken')
    if (!this.userDetails && token) {
      AppObject.AuthToken = token;
      this.authService.getUserData(token).subscribe((res) => {
        AppObject.userData = res.data;
        this.userDetails = res.data;
      },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
        
      })
    }
  }

}
