import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CookieService } from 'ngx-cookie-service';
import { ToastMessageService } from './baseSettings/services/toastMessage.service';
import { UserList } from './models/UserList';
import { Store } from '@ngrx/store';
import { userInfoActions } from './store/actions/userInfo.action';
import { CartStateService } from './Services/cartState.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  providers: [MessageService, ToastMessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  public userDetails: any = null;

  constructor(
    private cookieService: CookieService,
    private cartStateService : CartStateService,
    private store : Store<{userInfo : UserList}>
  ) { }

  ngOnInit(): void {
    let token = this.cookieService.get("skillUpToken");
    if(token){
      this.store.dispatch(userInfoActions.loadUser());
    }
    this.store.select("userInfo").subscribe((res) => {
      if(res){
        this.cartStateService.initializeCart(res?._id)
      } else {
        this.cartStateService.initializeCart()
      }
    });
  }

}
