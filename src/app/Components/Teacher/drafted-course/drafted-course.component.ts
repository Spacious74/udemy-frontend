import { Component } from '@angular/core';
import { ToastMessageService } from '../../../baseSettings/services/toastMessage.service';
import { CourseService } from '../../../Services/course.service';
import { UserService } from '../../../state/user.service';
import { UserList } from '../../../models/UserList';
import { DraftedCourseService } from '../../../Services/draftedCourse.service';
import { DraftCourse } from '../../../models/Course/DraftCourse';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drafted-course',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  providers : [ToastMessageService],
  templateUrl: './drafted-course.component.html',
  styles: `
  .courseImage {
    object-fit: cover;
  }
  `
})
export class DraftedCourseComponent {

  public userDetails : UserList;
  public draftedCourseList : DraftCourse[];
  public totalCourses : number = 0;

  constructor(
    private darftedCourseService : DraftedCourseService,
    private storage : UserService,
    private router : Router,
    private toastMsgService : ToastMessageService
  ) {}

  ngOnInit(): void {
    this.storage.user$.subscribe((res)=>{
      this.userDetails = res;
      this.fetchCourseList(res._id);
    },
    (error) => {
      console.log(error);
    });
  }

  fetchCourseList(userId : string){
    this.darftedCourseService.getAllDraftedCourseById(userId).subscribe((res)=>{
      this.draftedCourseList = res.data;
      this.totalCourses = res.data.length;
    },
    (error) => {
      this.toastMsgService.showError("Error", error.error.message);
    })
  }

  navigateToEditCourse(courseId : any){
    let url="/create-course/"+courseId;
    this.router.navigate([url]);
  }

}
