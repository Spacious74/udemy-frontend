import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraftedCourseService } from '../../../Services/draftedCourse.service';
import { UserList } from '../../../models/UserList';
import { Store } from '@ngrx/store';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { RatingModule } from 'primeng/rating';
import { ProgressBarModule } from 'primeng/progressbar';
import { FormsModule } from '@angular/forms';
import { DraftCourse } from '../../../models/Course/DraftCourse';
import { RateAndReviewService, Reviews } from '../../../Services/rateAndReview.service';
import { UserProgressService } from '../../../Services/userProgress.service';

@Component({
  selector: 'app-course-analytics',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CardModule, TabViewModule, RatingModule, ProgressBarModule, FormsModule],
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
  public loadingReviews: boolean = false;
  public loadingProgress: boolean = false;
  public courseReviews: Reviews[] = [];
  public courseProgressData: any[] = [];
  public analyticsMap: { [courseId: string]: { earnings: number, studentsEnrolled: number, studentsData?: any[] } } = {};


  constructor(
    private draftedCourseService: DraftedCourseService,
    private rateAndReviewService: RateAndReviewService,
    private userProgressService: UserProgressService,
    private store: Store<{userInfo: UserList}>
  ) {}

  ngOnInit(): void {
    this.store.select("userInfo").subscribe((res)=>{
      if(res){
        this.userDetails = res;
        this.fetchAnalytics();
      }
    });
  }

  fetchAnalytics() {
    this.draftedCourseService.getTeacherAnalytics().subscribe((res) => {
      if(res.success) {
        this.courses = res.courses;
        res.data.forEach((item: any) => {
          const cId = item.courseId?._id || item.courseId;
          this.analyticsMap[cId] = {
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
    this.loadingReviews = true;
    this.loadingProgress = true;
    
    // Fetch reviews
    this.rateAndReviewService.getReviews(this.userDetails._id, course._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.courseReviews = res.reviews || [];
        }
        this.loadingReviews = false;
      },
      error: (err) => {
        console.error("Error fetching reviews", err);
        this.loadingReviews = false;
      }
    });

    // Fetch User Progress
    this.userProgressService.getAllCourseProgress(course._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.courseProgressData = res.progressData || [];
        }
        this.loadingProgress = false;
      },
      error: (err) => {
        console.error("Error fetching progress", err);
        this.loadingProgress = false;
      }
    });
    
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
    this.courseReviews = [];
    this.courseProgressData = [];
  }

  getWatchPercentage(completedCount: number, totalLectures: number): number {
    if (!totalLectures || totalLectures === 0) return 0;
    return Math.round((completedCount / totalLectures) * 100);
  }
}
