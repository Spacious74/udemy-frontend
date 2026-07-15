import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DraftedCourseService } from '../../../Services/draftedCourse.service';
import { Store } from '@ngrx/store';
import { UserList } from '../../../models/UserList';
import { ToastMessageService } from '../../../baseSettings/services/toastMessage.service';
import { DraftCourse } from '../../../models/Course/DraftCourse';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-teacher-course-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TabViewModule, ConfirmDialogModule, SkeletonModule],
  providers: [ToastMessageService, ConfirmationService],
  templateUrl: './teacher-course-page.component.html',
  styleUrl: './teacher-course.css'
})
export class TeacherCoursePageComponent implements OnInit {

  public userDetails: UserList;
  public releasedCourses: any[] = [];
  public draftedCourseList: DraftCourse[] = [];
  public error: string;
  public totalDraftedCourses: number = 0;
  public isLoadingReleased: boolean = true;
  public isLoadingDrafted: boolean = true;
  public releasingCourseId: string | null = null;

  constructor(
    private draftedCourseService: DraftedCourseService,
    private toastMsgService: ToastMessageService,
    private router: Router,
    private store: Store<{ userInfo: UserList }>,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.store.select('userInfo').subscribe((res) => {
      this.userDetails = res;
      if (this.userDetails) {
        this.fetchReleasedCourses();
        this.fetchDraftedCourses();
      }
    },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
      })
  }

  fetchReleasedCourses() {
    this.isLoadingReleased = true;
    this.draftedCourseService.getReleasedCourses(this.userDetails._id).subscribe((res) => {
      this.releasedCourses = res.data;
      this.error = "";
      this.isLoadingReleased = false;
    }, (err) => {
      this.isLoadingReleased = false;
      if (err) {
        this.error = err.message;
      }
    });
  }

  fetchDraftedCourses() {
    this.isLoadingDrafted = true;
    this.draftedCourseService.getAllDraftedCourseById(this.userDetails._id).subscribe((res) => {
      this.draftedCourseList = res.data.filter((course: any) => course.isReleased === false);
      this.totalDraftedCourses = this.draftedCourseList.length;
      this.isLoadingDrafted = false;
    },
      (error) => {
        this.isLoadingDrafted = false;
        this.toastMsgService.showError("Error", error.error.message);
      })
  }

  navigateToCourseDetails(courseId: any) {
    let url = "/course/" + courseId;
    this.router.navigate([url]);
  }

  navigateToEditCourse(courseId: any) {
    let url = "/educator/create-course/" + courseId;
    this.router.navigate([url]);
  }

  navigateToCreateCourse() {
    let url = "/educator/create-course/" + null;
    this.router.navigate([url]);
  }

  releaseCourse(courseId: string) {
    this.releasingCourseId = courseId;
    this.draftedCourseService.releaseCourse(courseId).subscribe((res) => {
      this.releasingCourseId = null;
      if (res.success) {
        this.fetchDraftedCourses();
        this.fetchReleasedCourses(); // Refresh both lists
        this.toastMsgService.showSuccess("Success", res.data);
      } else {
        this.toastMsgService.showError("Error", "Something went wrong. Please try again later");
      }
    },
      (error) => {
        this.releasingCourseId = null;
        this.toastMsgService.showError("Error", error.error.message);
      });
  }

  deleteCourse(courseId: string) {
    this.draftedCourseService.deleteCourse(courseId).subscribe((res) => {
      if (res.success) {
        this.fetchDraftedCourses();
        this.toastMsgService.showSuccess("Success", res.message);
      } else {
        this.toastMsgService.showError("Error", "Something went wrong. Please try again later");
      }
    },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
      });
  }

  confirmRelease(event: Event, courseId: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Once you release this course, it will become publicly visible to all students on the platform.<p>You can still edit the course content and track its performance and analytics from your "Courses" dashboard.</p>',
      header: 'Confirmation',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: "Release",
      rejectLabel: "Discard",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.releaseCourse(courseId);
      }
    });
  }

  deleteConfirmation(event: Event, courseId: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this course? <p>Once deleted, students will no longer have access to it.</p> <p>This course and all its content will be permanently removed.</p>',
      header: 'Confirmation',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: "Delete",
      rejectLabel: "Discard",
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: "p-button-text p-button-secondary",
      accept: () => {
        this.deleteCourse(courseId);
      }
    });
  }

}
