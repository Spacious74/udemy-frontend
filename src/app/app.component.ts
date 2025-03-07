import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AppObject } from './baseSettings/AppObject';
import { AuthService } from './Services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastMessageService } from './baseSettings/services/toastMessage.service';
import { UserService } from './state/user.service';
import { UserList } from './models/UserList';
import { Store } from '@ngrx/store';
import { userInfoActions } from './store/actions/userInfo.action';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastModule],
  providers: [MessageService, ToastMessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  public userDetails: any = null;

  constructor(
    private cookieService: CookieService,
    private store : Store<{userInfo : UserList}>
  ) { }

  ngOnInit(): void {
    let token = this.cookieService.get("skillUpToken");
    if(token){
      this.store.dispatch(userInfoActions.loadUser());
    }
  }

}
