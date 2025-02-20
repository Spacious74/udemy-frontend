import { Component, Input, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AppObject } from '../../baseSettings/AppObject';
import { CookieService } from 'ngx-cookie-service';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { UserList } from '../../models/UserList';
import { DialogModule } from 'primeng/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserService } from '../../state/user.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    FormsModule, DropdownModule, InputTextModule, ButtonModule, RouterLink, RouterLinkActive, CommonModule,
    OverlayPanelModule, TooltipModule, ToastModule, DialogModule
  ],
  providers: [MessageService, ToastMessageService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {

  public categories: any[] = [];
  public searchText: string = '';
  public selectedCategory: string;
  public userLoggedIn: boolean = false;
  public userDetails : UserList;
  public showPopUp : boolean = false;
  public userId : string;
  public userRole : string;

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private toastMsgService: ToastMessageService,
    private router: Router,
    private msg: MessageService,
    private storage : UserService
  ) { }

  ngOnInit(): void {

    this.initializeUser();
    this.categories = [
      { name: 'Development' },
      { name: 'Business' },
      { name: 'IT & Software' },
      { name: 'Design' },
      { name: 'Programming Languages' },
    ];

  }

  initializeUser(){
    let token = this.cookieService.get('skillUpToken')
    if (token) {
      AppObject.AuthToken = token;
      this.authService.getUserData(token).subscribe((res) => {
        AppObject.userData = res.data;
        this.userDetails = res.data;
        this.userId = res.data._id;
        this.userRole = res.data.role;
        this.userLoggedIn = true;
      },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
        this.userLoggedIn = false;
      })
    }else{
      this.userLoggedIn = false;
    }
  }


  display(event: any) {
    if (!event.value?.name) {
      this.router.navigate(['/courses'])
    } else {
      this.router.navigate(['/courses/' + event.value?.name]);
    }
  }

  searchIt() {
    if (this.searchText) {
      const encodedQuery = encodeURIComponent(this.searchText);
      this.router.navigate(['/courses'], { queryParams: { q: encodedQuery } });
    }
  }

  navigateToCart() {
    this.router.navigate(['/cart']); return;
    if (AppObject.userData) {
      this.router.navigate(['/cart']);
    } else {
      this.msg.add({
        key: 'br',
        severity: 'error',
        summary: 'Please Login to get cart.',
        detail: 'Login helps to you to keep store your products',
      })
      this.router.navigateByUrl(this.router.url);
    }
    
  }

  logout() {
    this.cookieService.delete('skillUpToken');
    window.location.reload();
    this.router.navigate(['/']);
  }

  togglePopup(){
    this.showPopUp = !this.showPopUp;
  }
  
  updateUserRole(){
    this.authService.updateUser({userId: this.userId, role : "teacher"}).subscribe((res)=>{
      if(res.success){
        this.toastMsgService.showSuccess("Success", "User role updated successfully");
        this.router.navigate(['/educator']);
        this.showPopUp = false;
      }else{
        this.toastMsgService.showError("Error", "Something went wrong.");
      }
    }, 
    (error)=>{
      this.toastMsgService.showError("Error", error.error.message);
    })
  }
}
