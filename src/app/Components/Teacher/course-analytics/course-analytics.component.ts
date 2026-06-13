import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraftedCourseService } from '../../../Services/draftedCourse.service';
import { UserList } from '../../../models/UserList';
import { Store } from '@ngrx/store';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DraftCourse } from '../../../models/Course/DraftCourse';

@Component({
  selector: 'app-course-analytics',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CardModule],
  templateUrl: './course-analytics.component.html',
  styleUrls: ['./course-analytics.component.css']
})
export class CourseAnalyticsComponent implements OnInit {
  public userDetails: UserList;
  public courses: DraftCourse[] = [];
  public selectedCourse: DraftCourse | null = null;
  public enrolledStudents: any[] = [];
  public showStudentsTable: boolean = false;
  public loadingStudents: boolean = false;

  constructor(
    private draftedCourseService: DraftedCourseService,
    private store: Store<{userInfo: UserList}>
  ) {}

  ngOnInit(): void {
    this.store.select("userInfo").subscribe((res)=>{
      if(res){
        this.userDetails = res;
        this.fetchCourses();
      }
    });
  }

  fetchCourses() {
    this.draftedCourseService.getAllDraftedCourseById(this.userDetails._id).subscribe((res) => {
      this.courses = res.data;
    }, (err) => {
      console.log(err);
    });
  }

  viewEnrolledStudents(course: DraftCourse) {
    this.selectedCourse = course;
    this.showStudentsTable = true;
    this.loadingStudents = true;
    this.draftedCourseService.getEnrolledStudents(course._id, this.userDetails._id).subscribe((res) => {
      this.enrolledStudents = res.data;
      this.loadingStudents = false;
    }, err => {
      this.loadingStudents = false;
      console.error(err);
    });
  }

  goBack() {
    this.showStudentsTable = false;
    this.selectedCourse = null;
    this.enrolledStudents = [];
  }
}
