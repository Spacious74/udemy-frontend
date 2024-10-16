import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { data } from '../../data/course';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { BadgeModule } from 'primeng/badge';
import { articles } from '../../data/article';
import { TooltipModule } from 'primeng/tooltip';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { AppObject } from '../../baseSettings/AppObject';
import { AuthService } from '../../Services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CardModule, FormsModule, ButtonModule, CommonModule, CurrencyPipe, CarouselModule, BadgeModule, 
    TooltipModule, RouterLink, FooterComponent, ToastModule
  ],
  providers : [ToastMessageService],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent implements OnInit {
  data: any[] = [];
  categories: any[] = [];
  articles : any[] = [];
  public userDetails : any = AppObject.AuthToken;

  constructor(
    private authService : AuthService,
    private cookieService : CookieService,
    private toastMsgService : ToastMessageService,
  ){}

  ngOnInit(): void {
    let token = this.cookieService.get('skillUpToken')
    if(token){
      AppObject.AuthToken = token;
      this.authService.getUserData(token).subscribe((res)=>{
        AppObject.userData = res.data;
        this.userDetails = res.data;
      }, 
      (error)=>{
        this.toastMsgService.showError("Error", error.error.message);
      })
    }
    this.data = data;
    this.categories = [
      {
        name: 'Development',
        url: '../../../assets/images/development.png',
      },
      {
        name: 'Business',
        url: '../../../assets/images/business.png',
      },
      {
        name: 'IT & Software',
        url: '../../../assets/images/itsoftware.png',
      },
      {
        name: 'Programming',
        url: '../../../assets/images/programming.png',
      },
      {
        name: 'Design',
        url: '../../../assets/images/design-thinking.png',
      },
    ];
    this.articles = articles;
  }
  
}
