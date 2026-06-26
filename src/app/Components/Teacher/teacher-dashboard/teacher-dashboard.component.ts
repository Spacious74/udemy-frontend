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
import { QnaService } from '../../../Services/qna.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [ToastModule, ButtonModule, AvatarModule, ChartModule, CommonModule],
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
  public totalEarnings: number = 0;
  public pendingQuestions: number = 0;
  public topPerformingCourses: any[] = [];
  public latestQuestions: any[] = [];

  constructor(
    private draftedCourseService: DraftedCourseService,
    private qnaService: QnaService,
    private store : Store<{cart : Cart[], userInfo : UserList}>,
    private router: Router
  ) {}


  ngOnInit() {

    this.store.select("userInfo").subscribe((res)=>{
      if(res){
        this.userDetails = res;
        this.fetchData();
        this.fetchAnalyticsData();
        this.fetchLatestQuestions();
        this.fetchQnaAnalytics();
      }
    },
    (error) => {
     console.log(error);
    })
    
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    
    this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
  }

  fetchData() {
    this.draftedCourseService.getReleasedCourses(this.userDetails._id).subscribe((res) => {
      this.totalStudents = res.data.reduce((sum,data)=>data.totalStudentsPurchased+sum,0);
      this.totalCourses = res.data.length;
    }, (err) => {
      console.log(err);
    });
  }

  fetchAnalyticsData() {
    // Top 5 courses by students and earnings
    this.draftedCourseService.getTeacherAnalytics().subscribe({
      next: (res) => {
        if(res.data) {
           let coursesStats = res.data.map((item: any) => {
              const studentsCount = item.studentsEnrolled?.length || 0;
              const earnings = item.studentsEnrolled?.reduce((acc: number, curr: any) => acc + (curr.pricePaid || item.courseId?.price || 0), 0) || 0;
              return {
                 title: item.courseId?.title,
                 poster: item.courseId?.coursePoster?.url,
                 students: studentsCount,
                 earnings: earnings
              };
           });
           this.topPerformingCourses = coursesStats.sort((a: any, b: any) => b.earnings - a.earnings).slice(0, 5);
        }
      }
    });

    // Chart data for monthly earnings
    this.draftedCourseService.getEarningsAndReports().subscribe({
      next: (res) => {
        if(res.data) {
          this.totalEarnings = res.data.totalEarnings || 0;
          if(res.data.monthlyEarningsChart) {
            const chartData = res.data.monthlyEarningsChart;
            this.data = {
              labels: chartData.map((d: any) => d.month).reverse(),
              datasets: [
                  {
                      label: 'Earnings',
                      data: chartData.map((d: any) => d.earnings).reverse(),
                      fill: false,
                      borderColor: getComputedStyle(document.documentElement).getPropertyValue('--blue-500'),
                      tension: 0.4
                  }
              ]
            };
          }
        }
      }
    });
  }

  fetchLatestQuestions() {
    this.qnaService.getTeacherCoursesWithQuestions().subscribe({
      next: (res) => {
        if(res.data?.questions) {
          this.latestQuestions = res.data.questions.slice(0, 5);
        }
      }
    });
  }

  fetchQnaAnalytics() {
    this.qnaService.getTeacherQnaAnalytics().subscribe({
      next: (res) => {
        if (res.data) {
          this.pendingQuestions = res.data.pendingQuestions || 0;
        }
      }
    });
  }

  navigateToPage() {
    let url="/educator/create-course/"+null;
    this.router.navigate([url]);
  }

  navigateToQna() {
    this.router.navigate(['/educator/qna']);
  }
}
