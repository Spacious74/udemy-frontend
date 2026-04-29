import { Component } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { UserList } from '../../../models/UserList';
import { AppObject } from '../../../baseSettings/AppObject';
import { CookieService } from 'ngx-cookie-service';
import { ToastMessageService } from '../../../baseSettings/services/toastMessage.service';
import { Router, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ChartModule } from 'primeng/chart';
import { Store } from '@ngrx/store';
import { Cart } from '../../../models/Cart';
import { DraftedCourseService } from '../../../Services/draftedCourse.service';
import { DraftCourse } from '../../../models/Course/DraftCourse';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [ToastModule, ButtonModule, AvatarModule, ChartModule],
  templateUrl: './teacher-dashboard.component.html',
  styles: ``
})
export class TeacherDashboardComponent {

  public courses: DraftCourse[];
  public data: any;
  public options: any;
  public userDetails : UserList;
  public totalStudents : number = 0;
  public totalCourses : number  = 0;

  constructor(
    private draftedCourseService: DraftedCourseService,
    private store : Store<{cart : Cart[], userInfo : UserList}>,
    private router: Router
  ) {}


  ngOnInit() {

    this.store.select("userInfo").subscribe((res)=>{
      if(res){
        this.userDetails = res;
        this.fetchData();
      }
    },
    (error) => {
     console.log(error);
    })
   
  }

  fetchData() {
    this.draftedCourseService.getReleasedCourses(this.userDetails._id).subscribe((res) => {
      this.totalStudents = res.data.reduce((sum,data)=>data.totalStudentsPurchased+sum,0);
      this.totalCourses = res.data.length;
    }, (err) => {
      console.log(err);
    });
  }

  navigateToPage() {
    let url="/create-course/"+null;
    this.router.navigate([url]);
  }
}
