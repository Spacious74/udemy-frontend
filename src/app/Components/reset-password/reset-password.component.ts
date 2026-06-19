import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../Services/auth.service';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, PasswordModule, RouterLink, ToastModule, FooterComponent],
  providers: [ToastMessageService],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  public loading: boolean = false;
  public status: 'idle' | 'success' | 'error' = 'idle';
  public token: string = '';
  public errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private toastMsgService: ToastMessageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    if (!this.token) {
      this.status = 'error';
      this.errorMessage = 'Invalid or missing token.';
    }
  }

  submitNewPassword(form: NgForm) {
    if (form.invalid) return;

    const { newPassword, confirmPassword } = form.value;

    if (newPassword !== confirmPassword) {
      this.toastMsgService.showError("Error", "Passwords do not match.");
      return;
    }

    this.loading = true;
    this.authService.resetPassword(this.token, newPassword).subscribe(
      (res) => {
        this.loading = false;
        this.status = 'success';
        this.toastMsgService.showSuccess("Success", res.message);
      },
      (error) => {
        this.loading = false;
        this.status = 'error';
        this.errorMessage = error.error.message || "Failed to reset password.";
        this.toastMsgService.showError("Error", this.errorMessage);
      }
    );
  }
}
