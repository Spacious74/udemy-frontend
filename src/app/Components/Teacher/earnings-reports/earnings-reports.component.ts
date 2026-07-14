import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraftedCourseService } from '../../../Services/draftedCourse.service';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DraftCourse } from '../../../models/Course/DraftCourse';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-earnings-reports',
  standalone: true,
  imports: [CommonModule, ChartModule, TableModule, ButtonModule, SkeletonModule],
  templateUrl: './earnings-reports.component.html',
  styleUrls: ['./earnings-reports.component.css']
})
export class EarningsReportsComponent implements OnInit {

  public totalEarnings: number = 0;
  public thisMonthEarnings: number = 0;
  public totalStudentsPurchases: number = 0;
  public todaysPurchasesCount: number = 0;
  public todaysEarnings: number = 0;

  public recentTransactions: any[] = [];
  public chartData: any;
  public chartOptions: any;

  public courses: DraftCourse[] = [];
  public analyticsMap: { [courseId: string]: { earnings: number, studentsEnrolled: number } } = {};
  public showCourseDetails: boolean = false;
  public selectedCourse: DraftCourse | null = null;
  public loadingData: boolean = false;
  public loadingStats: boolean = true;
  public loadingCourses: boolean = true;

  public globalStats: any = null;

  constructor(private draftedCourseService: DraftedCourseService) { }

  ngOnInit(): void {
    this.initChartOptions();
    this.fetchCourses();
    this.fetchData(); // Fetch global stats for the main view
  }

  fetchCourses() {
    this.loadingCourses = true;
    this.draftedCourseService.getTeacherAnalytics().subscribe({
      next: (res) => {
        if (res.success) {
          this.courses = res.courses;
          res.data.forEach((item: any) => {
            const cId = item.courseId?._id || item.courseId;
            this.analyticsMap[cId] = {
              earnings: item.earnings || 0,
              studentsEnrolled: item.studentsEnrolled?.length || 0
            };
          });
        }
        this.loadingCourses = false;
      },
      error: (err) => {
        console.error("Error fetching courses", err);
        this.loadingCourses = false;
      }
    });
  }

  viewCourseAnalytics(course: DraftCourse) {
    this.selectedCourse = course;
    this.showCourseDetails = true;
    this.loadingData = true;
    this.fetchData(course._id);
  }

  goBack() {
    this.showCourseDetails = false;
    this.selectedCourse = null;
    if (this.globalStats) {
      this.totalEarnings = this.globalStats.totalEarnings;
      this.thisMonthEarnings = this.globalStats.thisMonthEarnings;
      this.totalStudentsPurchases = this.globalStats.totalStudentsPurchases;
      this.todaysPurchasesCount = this.globalStats.todaysPurchasesCount;
      this.todaysEarnings = this.globalStats.todaysEarnings;
      this.updateChart(this.globalStats.monthlyEarningsChart || []);
    }
  }

  fetchData(courseId?: string) {
    this.loadingStats = true;
    this.draftedCourseService.getEarningsAndReports(courseId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const d = res.data;
          this.totalEarnings = d.totalEarnings || 0;
          this.thisMonthEarnings = d.thisMonthEarnings || 0;
          this.totalStudentsPurchases = d.totalStudentsPurchases || 0;
          this.todaysPurchasesCount = d.todaysPurchasesCount || 0;
          this.todaysEarnings = d.todaysEarnings || 0;
          this.recentTransactions = d.recentTransactions || [];

          if (!courseId) {
            // Save global stats so we can restore them when going back
            this.globalStats = {
              totalEarnings: this.totalEarnings,
              thisMonthEarnings: this.thisMonthEarnings,
              totalStudentsPurchases: this.totalStudentsPurchases,
              todaysPurchasesCount: this.todaysPurchasesCount,
              todaysEarnings: this.todaysEarnings,
              monthlyEarningsChart: d.monthlyEarningsChart || []
            };
          }
          this.updateChart(d.monthlyEarningsChart || []);
          this.loadingData = false;
          this.loadingStats = false;
        }
      },
      error: (err) => {
        console.error("Error fetching earnings data", err);
        this.loadingData = false;
        this.loadingStats = false;
      }
    });
  }

  updateChart(monthlyData: any[]) {
    const labels = monthlyData.map((d: any) => d.month);
    const data = monthlyData.map((d: any) => d.earnings);

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Monthly Earnings (₹)',
          data: data,
          backgroundColor: 'rgba(34, 197, 94, 0.2)', // green-500 with opacity
          borderColor: '#22c55e', // green-500
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    };
  }

  initChartOptions() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }
}
