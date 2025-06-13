import { Component } from '@angular/core';
import { courseData } from '../../../data/course';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { CourseService } from '../../../Services/course.service';
import { DraftedCourseService } from '../../../Services/draftedCourse.service';
import { Store } from '@ngrx/store';
import { UserList } from '../../../models/UserList';
import { ToastMessageService } from '../../../baseSettings/services/toastMessage.service';
@Component({
  selector: 'app-teacher-course-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectButtonModule, RadioButtonModule, DataViewModule,
    PaginatorModule, ButtonModule],
  templateUrl: './teacher-course-page.component.html',
  styles: `
  .courseCard{
    background: #f9f9f9;
  }
  `
  
})
export class TeacherCoursePageComponent {

  public courses: any[];
  public totalRecords: number = 0;
  public error: string;
  public userDetails: UserList;
  public page: number = 0;
  public rows: number = 10;

  constructor(
    private draftedCourseService: DraftedCourseService,
    private toastmsgService: ToastMessageService,
    private router: Router,
    private store: Store<{ userInfo: UserList }>
  ) { }

  ngOnInit() {
    this.store.select('userInfo').subscribe((res) => {
      this.userDetails = res;
      this.fetchData();
    },
      (error) => {
        this.toastmsgService.showError("Error", error.error.message);
      })
  }

  fetchData() {
    this.draftedCourseService.getAllDraftedCourseById(this.userDetails._id).subscribe((res) => {
      this.courses = res.data;
      this.error = "";
    }, (err) => {
      if (err) {
        this.error = err.message;
      }
    });
  }

  navigateToCourseDetails(courseId: any) {
    let url = "/course/" + courseId;
    this.router.navigate([url]);
  }

  navigateToEditCourse(courseId: any) {
    let url = "/create-course/" + courseId;
    this.router.navigate([url]);
  }

}
