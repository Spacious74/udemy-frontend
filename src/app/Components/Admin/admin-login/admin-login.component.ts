import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../Services/auth.service';
import { ToastMessageService } from '../../../baseSettings/services/toastMessage.service';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule, InputTextModule, PasswordModule, ButtonModule, RouterLink],
  providers: [ToastMessageService],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    private toastMsgService: ToastMessageService
  ) {}

  formSubmission(form: NgForm) {
    if (form.invalid) return;
    
    this.loading = true;
    this.authService.login(form.value).subscribe(
      (res: any) => {
        if (res.data.role !== 'admin') {
          this.loading = false;
          this.toastMsgService.showError("Error", "Unauthorized. Admin access only.");
          return;
        }

        if (this.cookieService.get('skillUpToken')) {
          this.cookieService.delete('skillUpToken', '/');
        }
        this.cookieService.set('skillUpToken', res.token, 1, '/');

        this.toastMsgService.showSuccess("Success", res.message || "Admin logged in successfully");
        setTimeout(() => {
          this.router.navigate(['/admin/dashboard']).then(() => {
            window.location.reload();
          });
        }, 1000);
      },
      (error) => {
        this.loading = false;
        this.toastMsgService.showError("Error", error.error?.message || 'Login Failed');
      }
    );
  }
}
