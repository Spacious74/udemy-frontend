import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['../login/login.component.css']
})
export class VerifyEmailComponent implements OnInit {
  isLoading = true;
  isSuccess = false;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.verifyToken(token);
      } else {
        this.isLoading = false;
        this.isSuccess = false;
        this.message = 'No verification token provided.';
      }
    });
  }

  verifyToken(token: string): void {
    this.authService.verifyEmail(token).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.message = response.message || 'Email verified successfully! You can now log in.';
      },
      error: (err) => {
        this.isLoading = false;
        this.isSuccess = false;
        this.message = err.error?.message || 'Verification failed. The token may be invalid or expired.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
