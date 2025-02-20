import { Component } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { UserList } from '../../../models/UserList';
import { AppObject } from '../../../baseSettings/AppObject';
import { CookieService } from 'ngx-cookie-service';
import { ToastMessageService } from '../../../baseSettings/services/toastMessage.service';
import { Router, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-teacher-section',
  standalone: true,
  imports: [ToastModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './teacher-section.component.html',
  styleUrl: './teacher-section.component.css'
})
export class TeacherSectionComponent {
  
  public userDetails: UserList;
  public loading : boolean = false;

  constructor(
    private authService : AuthService,
    private cookieService : CookieService,
    private routerService : Router,
    private toastMsgService : ToastMessageService,
  ){}

  ngOnInit(): void {
    this.userDetails = AppObject.userData;
    let token = this.cookieService.get('skillUpToken')
    if(token){
      AppObject.AuthToken = token;
      this.authService.getUserData(token).subscribe((res)=>{
        AppObject.userData = res.data;
        this.userDetails = res.data;
      }, 
      (error)=>{
        this.toastMsgService.showError("Error", error.error.message);
        this.cookieService.delete('skillUpToken');
        this.routerService.navigate(['/']);
      })
    }
    if(!token){
      console.log('token not found');
      this.routerService.navigate(['/']);
    }
  }

}
