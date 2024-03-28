import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    RouterLink,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {

  public loading : boolean = false;

  constructor(private authService: AuthService, private msg: MessageService) {}
  formSubmission(signupForm: NgForm) {
    this.loading = true;
    if (signupForm.value.password != signupForm.value.cpassword) {
      this.msg.add({
        key: 'br',
        severity: 'error',
        summary: 'Unmatched Password',
        detail: 'Password not matching...',
      });
    }
    this.authService.register(signupForm.value).subscribe(
      (res) => {
        console.log('response', res);
        this.loading = false;
        this.msg.add({
          key: 'br',
          severity: 'success',
          summary: 'Success',
          detail: 'User registered successfully...',
        });
      },
      (error) => {
        console.error('Signup failed:', error);
        this.loading = false;
        this.msg.add({
          key: 'br',
          severity: 'error',
          summary: 'Error',
          detail: error.error.message
        });
      }
    );
  }
}
