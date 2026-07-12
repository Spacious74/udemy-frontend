import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { BlogService } from '../../../Services/blog.service';
import { Blog } from '../../../models/Blog';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonModule],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  loading = true;
  error = '';

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.fetchBlogs();
  }

  fetchBlogs() {
    this.blogService.getAllBlogs().subscribe({
      next: (res) => {
        if (res.success) {
          this.blogs = res.blogs;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load blogs.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
