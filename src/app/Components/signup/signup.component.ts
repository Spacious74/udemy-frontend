import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { ToastModule } from 'primeng/toast';
import { User } from '../../models/User';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { CookieService } from 'ngx-cookie-service';
import { AppObject } from '../../baseSettings/AppObject';
import { Store } from '@ngrx/store';
import { UserList } from '../../models/UserList';
import { userInfoActions } from '../../store/actions/userInfo.action';
import { FooterComponent } from '../footer/footer.component';
import { SocialAuthService, SocialLoginModule, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule, FormsModule, InputTextModule, ButtonModule, PasswordModule, RouterLink, ToastModule, FooterComponent, DividerModule,
    SocialLoginModule, GoogleSigninButtonModule
  ],
  providers: [ToastMessageService],
  templateUrl: './signup.component.html',
  styleUrl: '../login/login.component.css',
})
export class SignupComponent implements OnInit, OnDestroy {

  public loading: boolean = false;
  public errorFlag: boolean = false;
  public formData: User = new User();
  private googleAuthSub: Subscription;

  constructor(
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private cookieService: CookieService,
    private router: Router,
    private toastmsgService: ToastMessageService,
    private store: Store<{ userInfo: UserList }>
  ) {}

  ngOnInit(): void {
    // Subscribe to Google auth state — fires when user clicks <asl-google-signin-button>
    this.googleAuthSub = this.socialAuthService.authState.subscribe((googleUser) => {
      if (!googleUser) return;
      this.loading = true;
      this.authService.googleSignup(googleUser.idToken).subscribe((res) => {
        if (this.cookieService.get('skillUpToken')) {
          this.cookieService.delete('skillUpToken');
          this.cookieService.delete('skillUpToken', '/');
        }
        this.cookieService.set('skillUpToken', res.token, 65, '/');

        const payloadData = (res as any).data || res.user;
        this.store.dispatch(userInfoActions.loadUserSuccess({ payload: payloadData }));

        this.loading = false; this.errorFlag = false;
        this.toastmsgService.showSuccess('Success', 'User registered successfully.');
        this.formData = new User();
        this.router.navigate(['/']);
      }, (error) => {
        this.loading = false;
        this.errorFlag = true;
        this.toastmsgService.showError('Error', error?.error?.message || 'Google signup failed.');
      });
    });
  }

  ngOnDestroy(): void {
    this.googleAuthSub?.unsubscribe();
  }

  formSubmission(form: NgForm) {

    this.loading = true;

    if (this.formData.password != this.formData.confirmPassword) {
      this.toastmsgService.showWarn("Warning", "Password not matching with confirm password...");
      this.errorFlag = true;
      this.loading = false; return;
    } else {
      this.errorFlag = false;
    }

    this.formData.role = "student";
    this.authService.register(this.formData).subscribe(
      (res) => {
        if (this.cookieService.get('skillUpToken')) {
          this.cookieService.delete('skillUpToken');
          this.cookieService.delete('skillUpToken', '/');
        }
        this.cookieService.set('skillUpToken', res.token, 65, '/');

        this.store.dispatch(userInfoActions.loadUserSuccess({ payload: res.data }));

        this.loading = false; this.errorFlag = false;
        this.toastmsgService.showSuccess("Success", "User registered successfully.");
        this.formData = new User();
        this.router.navigate(['/']);
      },
      (error) => {
        console.log(error)
        this.loading = false;
        this.errorFlag = true;
        this.toastmsgService.showError("Error", error.error.message);
      }
    );

  }

}