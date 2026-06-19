import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../Services/auth.service';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, RouterLink, ToastModule, FooterComponent],
  providers: [ToastMessageService],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  public loading: boolean = false;
  public successMessageSent: boolean = false;

  constructor(
    private authService: AuthService,
    private toastMsgService: ToastMessageService
  ) { }

  submitEmail(form: NgForm) {
    if (form.invalid) return;

    this.loading = true;
    this.authService.forgotPassword(form.value.email).subscribe(
      (res) => {
        this.loading = false;
        this.successMessageSent = true;
        this.toastMsgService.showSuccess("Success", res.message);
      },
      (error) => {
        this.loading = false;
        this.toastMsgService.showError("Error", error.error.message || "An error occurred");
      }
    );
  }
}
