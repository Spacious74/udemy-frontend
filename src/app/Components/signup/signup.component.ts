import { Component } from '@angular/core';
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

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule, FormsModule, InputTextModule, ButtonModule, PasswordModule, RouterLink, ToastModule, 
  ],
  providers: [ToastMessageService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {

  public loading : boolean = false;
  public errorFlag : boolean = false;
  public formData : User = new User();

  constructor(
    private authService: AuthService, 
    private cookieService : CookieService,
    private router : Router,
    private toastmsgService : ToastMessageService,
  ) {}
  
  formSubmission() {

    this.loading = true;

    if (this.formData.password != this.formData.confirmPassword) {
      this.toastmsgService.showWarn("Warning", "Password not matching with confirm password...");
      this.errorFlag = true;
      this.loading = false; return;
    }else{
      this.errorFlag = false;
    }

    this.formData.role = "student";
    this.authService.register(this.formData).subscribe(
      (res) => {
        if(this.cookieService.get('skillUpToken')){
          this.cookieService.delete('skillUpToken');
        }
        this.cookieService.set('skillUpToken', res.token, 65);
        AppObject.userData = res.data; AppObject.AuthToken = res.token;
        this.loading = false; this.errorFlag = false;
        this.toastmsgService.showSuccess("Success", "User registered successfully.");
        this.formData = new User();
        this.router.navigate(['/']);
      },
      (error) => {
        console.log(error)
        this.errorFlag = true;
        this.loading = false;
        this.toastmsgService.showError("Error", error.error.message);
      }
    );
    
  }

}

// email: "chris@gmail.com"
// message :  "User registered successfully!"
// success :  true
// token :  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NzBlMWM2NTkxNGI2MWMzODJjNWJhODMiLCJlbWFpbCI6ImNocmlzQGdtYWlsLmNvbSIsImlhdCI6MTcyODk3ODAyMSwiZXhwIjoxNzI4OTgxNjIxfQ.KxL_Ml5P5EeeQ-dx9CTzvqQfutTXyWUhZ4I46D3dBWo"
// username :  "Chris"