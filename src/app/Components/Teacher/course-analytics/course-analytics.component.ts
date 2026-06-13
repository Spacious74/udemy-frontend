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
  public analyticsMap: { [courseId: string]: { earnings: number, studentsEnrolled: number, studentsData?: any[] } } = {};


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
      this.fetchAnalytics();
    }, (err) => {
      console.log(err);
    });
  }

  fetchAnalytics() {
    this.draftedCourseService.getTeacherAnalytics().subscribe((res) => {
      if(res.success) {
        res.data.forEach((item: any) => {
          this.analyticsMap[item.courseId] = {
            earnings: item.earnings,
            studentsEnrolled: item.studentsEnrolled?.length || 0,
            studentsData: item.studentsEnrolled || []
          };
        });
      }
    }, err => {
      console.error(err);
    });
  }


  viewEnrolledStudents(course: DraftCourse) {
    this.selectedCourse = course;
    this.showStudentsTable = true;
    
    const studentsData = this.analyticsMap[course._id]?.studentsData || [];
    this.enrolledStudents = studentsData.map((s: any) => {
      const user = s.studentId || {};
      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        enrolledAt: s.enrolledAt || user.createdAt
      };
    });
  }

  goBack() {
    this.showStudentsTable = false;
    this.selectedCourse = null;
    this.enrolledStudents = [];
  }
}
