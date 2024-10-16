import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { ToastModule } from 'primeng/toast';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { AppObject } from '../../baseSettings/AppObject';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, FormsModule, InputTextModule, ButtonModule, PasswordModule, RouterLink, ToastModule,
  ],
  providers: [ToastMessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {

  public loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService : CookieService,
    private toastMsgService : ToastMessageService
  ) {}

  formSubmission(form: NgForm) {
    this.loading = true;
    this.authService.login(form.value).subscribe(
      (res) => {
        if(this.cookieService.get('skillUpToken')){
          this.cookieService.delete('skillUpToken');
        }
        this.cookieService.set('skillUpToken', res.token, 65);
        AppObject.userData = res.data; AppObject.AuthToken = res.token;
        this.loading = false;
        this.toastMsgService.showSuccess("Success", "User Loginned Successfully")
        if (this.authService.getPreviousUrl()) {
          this.router.navigateByUrl(this.authService.getPreviousUrl()).then(()=>{
            window.location.reload();
          });
        } else {
          this.router.navigate(['/']).then(()=>{
            window.location.reload();
          })
        }
      },
      (error) => {
        this.loading = false;
        this.toastMsgService.showError("Error", error.error.message);
      }
    );
  }

}
