import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../Services/admin.service';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  stats: any = {
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    totalEnrollments: 0,
    recentUsers: [],
    recentPayments: []
  };

  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchStats();
  }

  fetchStats() {
    this.adminService.getDashboardStats().subscribe(
      (res: any) => {
        if (res.success) {
          this.stats = res.data;
        }
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching dashboard stats", error);
        this.loading = false;
      }
    );
  }
}
