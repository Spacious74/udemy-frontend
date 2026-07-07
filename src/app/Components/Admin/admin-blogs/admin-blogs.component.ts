import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { BlogService } from '../../../Services/blog.service';
import { Blog } from '../../../models/Blog';
import { ToastMessageService } from '../../../baseSettings/services/toastMessage.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin-blogs',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TableModule, TagModule, ToastModule],
  providers: [ToastMessageService, MessageService],
  templateUrl: './admin-blogs.component.html',
  styleUrls: ['./admin-blogs.component.css']
})
export class AdminBlogsComponent implements OnInit {
  blogs: Blog[] = [];
  loading: boolean = true;

  constructor(
    private blogService: BlogService,
    private toastMsgService: ToastMessageService
  ) {}

  ngOnInit(): void {
    this.fetchAdminBlogs();
  }

  fetchAdminBlogs() {
    this.loading = true;
    this.blogService.getAdminBlogs().subscribe({
      next: (res) => {
        if (res.success) {
          this.blogs = res.blogs;
        }
        this.loading = false;
      },
      error: (err) => {
        this.toastMsgService.showError('Error', 'Failed to fetch blogs');
        this.loading = false;
        console.error(err);
      }
    });
  }

  toggleVisibility(blog: Blog) {
    if (!blog._id) return;
    this.blogService.toggleVisibility(blog._id).subscribe({
      next: (res) => {
        if (res.success) {
          blog.isPublished = !blog.isPublished;
          this.toastMsgService.showSuccess('Success', res.message);
        }
      },
      error: (err) => {
        this.toastMsgService.showError('Error', 'Failed to toggle visibility');
        console.error(err);
      }
    });
  }
}
