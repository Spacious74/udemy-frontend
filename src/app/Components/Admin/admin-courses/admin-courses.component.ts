import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../Services/admin.service';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastMessageService } from '../../../baseSettings/services/toastMessage.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, TableModule, InputTextModule, ButtonModule, FormsModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, ToastMessageService],
  templateUrl: './admin-courses.component.html',
  styleUrl: './admin-courses.component.css'
})
export class AdminCoursesComponent implements OnInit {
  courses: any[] = [];
  totalRecords: number = 0;
  loading: boolean = true;

  page: number = 1;
  limit: number = 10;
  search: string = '';

  constructor(
    private adminService: AdminService,
    private confirmationService: ConfirmationService,
    private toastMsgService: ToastMessageService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(event?: any) {
    this.loading = true;
    
    if (event) {
      this.page = (event.first / event.rows) + 1;
      this.limit = event.rows;
    }

    this.adminService.getCourses(this.page, this.limit, this.search).subscribe(
      (res: any) => {
        if (res.success) {
          this.courses = res.data;
          this.totalRecords = res.total;
        }
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching courses", error);
        this.loading = false;
      }
    );
  }

  onSearch() {
    this.page = 1;
    this.loadCourses();
  }

  deleteCourse(course: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the course "${course.title}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.adminService.deleteCourse(course._id).subscribe(
          (res: any) => {
            if (res.success) {
              this.toastMsgService.showSuccess("Success", "Course deleted successfully");
              this.loadCourses();
            }
          },
          (error) => {
            this.toastMsgService.showError("Error", error.error?.message || "Failed to delete course");
          }
        );
      }
    });
  }
}
