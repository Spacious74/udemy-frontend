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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-drafted-course',
  standalone: true,
  imports: [CommonModule, ButtonModule, ConfirmDialogModule],
  providers: [ToastMessageService, ConfirmationService],
  templateUrl: './drafted-course.component.html',
  styles: `
  .courseImage {
    object-fit: cover;
  }
  `
})
export class DraftedCourseComponent {

  public userDetails: UserList;
  public draftedCourseList: DraftCourse[];
  public totalCourses: number = 0;

  constructor(
    private darftedCourseService: DraftedCourseService,
    private store : Store<{userInfo : UserList}>,
    private router: Router,
    private toastMsgService: ToastMessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {

    this.store.select('userInfo').subscribe((res)=>{
      this.userDetails = res;
      this.fetchCourseList();
    },
    (error) => {
      this.toastMsgService.showError("Error", error.error.message);
    })

  }

  fetchCourseList() {
    this.darftedCourseService.getAllDraftedCourseById(this.userDetails._id).subscribe((res) => {
      this.draftedCourseList = res.data;
      this.totalCourses = res.data.length;
    },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
      })
  }

  navigateToEditCourse(courseId: any) {
    let url = "/create-course/" + courseId;
    this.router.navigate([url]);
  }

  releaseCourse(courseId:string) {
    this.darftedCourseService.releaseCourse(courseId).subscribe((res)=>{
      if(res.success){
        this.fetchCourseList();
        this.toastMsgService.showSuccess("Success", res.data);
      }else{
        this.toastMsgService.showError("Error", "Something went wrong. Please try again later");
      }
    },
    (error) => {
      this.toastMsgService.showError("Error", error.error.message);
    });
  }

  confirm1(event: Event, courseId:string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Once you release this course, it will become publicly visible to all students on the platform.<p>You can still edit the course content and track its performance and analytics from your "My Courses" dashboard.</p>',
      header: 'Confirmation',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel : "Release",
      rejectLabel : "Discard",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.releaseCourse(courseId);
      }
    });
  }

}
