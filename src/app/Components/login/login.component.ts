import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private authSerive: AuthService,
    private router: Router,
    private msg: MessageService
  ) {}
  public loading: boolean = false;
  formSubmission(form: NgForm) {
    this.loading = true;
    this.authSerive.login(form.value).subscribe(
      (res) => {
        this.loading = false;
        this.msg.add({
          key: 'br',
          severity: 'success',
          summary: 'Success',
          detail: 'User logged in successfully...',
        });
        // this.router.navigate(['/courses']);
      },
      (error) => {
        this.loading = false;
        this.msg.add({
          key: 'br',
          severity: 'error',
          summary: 'Error',
          detail: error.error.message
            ? error.error.message
            : 'Something went wrong',
        });
      }
    );
  }
}
