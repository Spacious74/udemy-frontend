import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../Services/admin.service';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, TableModule, InputTextModule, DropdownModule, ButtonModule, FormsModule],
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
}
