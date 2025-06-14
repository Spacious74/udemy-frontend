import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule} from '@angular/common';
import { articles } from '../../data/article';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { AppObject } from '../../baseSettings/AppObject';
import { AuthService } from '../../Services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { courseData } from '../../data/course';
import { UserService } from '../../state/user.service';
import { UserList } from '../../models/UserList';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CardModule, FormsModule, ButtonModule, CommonModule, CarouselModule, BadgeModule, 
    TooltipModule, RouterLink, FooterComponent, ToastModule, DialogModule
  ],
  providers : [ToastMessageService],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent implements OnInit {

  public data: any[] = [];
  public categories: any[] = [];
  public articles : any[] = [];
  public showPopUp : boolean = false;
  public userDetails : UserList;
  public userId : string;
  public userRole : string = 'student';

  constructor(
    private authService : AuthService,
    private routerService : Router,
    private toastMsgService : ToastMessageService,
    private store : Store<{userInfo : UserList}>
  ){}

  ngOnInit(): void {

    this.store.select('userInfo').subscribe((res)=>{
      this.userDetails = res;
      this.userRole = res?.role;
    })

    this.data = courseData.slice(0,13);
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

  togglePopup(){
    this.showPopUp = !this.showPopUp;
  }
  
  updateUserRole(){
    this.authService.updateUser({userId: this.userDetails._id, role : "teacher"}).subscribe((res)=>{
      if(res.success){
        this.toastMsgService.showSuccess("Success", "User role updated successfully");
        this.routerService.navigate(['/educator']);
        this.showPopUp = false;
      }else{
        this.toastMsgService.showError("Error", "Something went wrong.");
      }
    }, 
    (error)=>{
      this.toastMsgService.showError("Error", error.error.message);
    })
  }

  navigateToCourseDetails(courseId : any){
    let url="/course/"+courseId;
    this.routerService.navigate([url]);
  }

}
