import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserList } from '../../models/UserList';
import { Store } from '@ngrx/store';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { CourseList } from '../../models/Course/CourseList';
import { DraftCourse } from '../../models/Course/DraftCourse';
import { AuthService } from '../../Services/auth.service';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule, RouterLink, ToastModule],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css',
})
export class PlaylistComponent {

  public userDetails: UserList;
  public courseEnrolled : DraftCourse[];

  constructor(
    private store: Store<{ userInfo: UserList }>,
    private router : Router,
    private authService : AuthService,
    private toastMsgService : ToastMessageService
  ) { }

  ngOnInit(): void {

    this.authService.getUserCoursesEnrolled().subscribe((res)=>{
      if(res.success){
        this.courseEnrolled = res.data;
      }else{
        this.toastMsgService.showError("Error", "Something went wrong.");
      }
    }, (err) => {
      // console.log(err);
      this.toastMsgService.showError("Error", "Failed to fetch user details.");
    })

  }

  navigateToCoursePlayer(courseId: any) {
    let url = "/player/" + courseId;
    this.router.navigate([url]);
  }
 
}
