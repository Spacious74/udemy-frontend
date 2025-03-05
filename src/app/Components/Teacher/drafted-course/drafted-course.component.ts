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
    private storage: UserService,
    private router: Router,
    private toastMsgService: ToastMessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.storage.user$.subscribe((res) => {
      this.userDetails = res;
      this.fetchCourseList(res?._id);
    },
      (error) => {
        console.log(error);
      });
  }

  fetchCourseList(userId: string) {
    this.darftedCourseService.getAllDraftedCourseById(userId).subscribe((res) => {
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
        this.fetchCourseList(this.userDetails._id);
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
      message: 'Once the course is released, you will still be able to edit it. Do you want to proceed with the release?',
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel : "Release",
      rejectLabel : "Discard",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.releaseCourse(courseId);
      },
      reject: () => {
        this.toastMsgService.showInfo("Info", "You have cancelled the action");
      }
    });
  }

}
