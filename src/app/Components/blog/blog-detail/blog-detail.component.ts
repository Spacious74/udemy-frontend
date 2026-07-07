import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogService } from '../../../Services/blog.service';
import { Blog } from '../../../models/Blog';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    const idOrSlug = this.route.snapshot.paramMap.get('id');
    if (idOrSlug) {
      this.fetchBlog(idOrSlug);
    } else {
      this.error = 'Invalid blog identifier.';
      this.loading = false;
    }
  }

  fetchBlog(idOrSlug: string) {
    this.blogService.getBlogById(idOrSlug).subscribe({
      next: (res) => {
        if (res.success) {
          this.blog = res.blog;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load the blog details.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
