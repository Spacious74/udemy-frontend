import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../Services/admin.service';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, TableModule, InputTextModule, DropdownModule, ButtonModule, FormsModule, TabViewModule, TooltipModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  totalRecords: number = 0;
  loading: boolean = true;

  page: number = 1;
  limit: number = 10;
  search: string = '';
  role: string = '';

  roles = [
    { label: 'All Roles', value: '' },
    { label: 'Admin', value: 'admin' },
    { label: 'Teacher', value: 'teacher' },
    { label: 'Student', value: 'student' }
  ];

  assignableRoles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Teacher', value: 'teacher' },
    { label: 'Student', value: 'student' }
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(event?: any) {
    this.loading = true;
    
    if (event) {
      this.page = (event.first / event.rows) + 1;
      this.limit = event.rows;
    }

    this.adminService.getUsers(this.page, this.limit, this.search, this.role).subscribe(
      (res: any) => {
        if (res.success) {
          this.users = res.data;
          this.totalRecords = res.total;
        }
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching users", error);
        this.loading = false;
      }
    );
  }

  onSearch() {
    this.page = 1;
    this.loadUsers();
  }

  onRoleChange() {
    this.page = 1;
    this.loadUsers();
  }

  changeUserRole(userId: string, newRole: string) {
    this.loading = true;
    this.adminService.updateUserRole(userId, newRole).subscribe({
      next: (res: any) => {
        if (res.success) {
          const userIndex = this.users.findIndex(u => u._id === userId);
          if (userIndex !== -1) {
            this.users[userIndex].role = res.data.role;
          }
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error updating user role', err);
        this.loading = false;
      }
    });
  }

  // User Detail View Methods
  isDetailView: boolean = false;
  selectedUser: any = null;
  userDetails: any = null;
  detailsLoading: boolean = false;

  viewUser(user: any) {
    this.isDetailView = true;
    this.selectedUser = user;
    this.detailsLoading = true;
    this.userDetails = null;

    this.adminService.getUserDetails(user._id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.userDetails = res.data;
        }
        this.detailsLoading = false;
      },
      error: (err) => {
        console.error('Error fetching user details', err);
        this.detailsLoading = false;
      }
    });
  }

  backToTable() {
    this.isDetailView = false;
    this.selectedUser = null;
    this.userDetails = null;
  }
}
