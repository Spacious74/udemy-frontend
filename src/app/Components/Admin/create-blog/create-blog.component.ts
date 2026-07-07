import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService } from '../../../Services/blog.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, EditorModule],
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css']
})
export class CreateBlogComponent {
  blogForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      coverImage: [''],
      tags: [''] // Comma separated
    });
  }

  onSubmit() {
    if (this.blogForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formValue = this.blogForm.value;
    const blogData = {
      ...formValue,
      tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : []
    };

    this.blogService.createBlog(blogData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMessage = 'Blog created successfully!';
        this.blogForm.reset();
        setTimeout(() => {
          this.router.navigate(['/blogs']);
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to create blog.';
        console.error(err);
      }
    });
  }
}
