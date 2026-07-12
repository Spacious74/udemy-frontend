import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../Services/blog.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastMessageService } from '../../../baseSettings/services/toastMessage.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, EditorModule, FileUploadModule, ToastModule, RadioButtonModule],
  providers: [ToastMessageService, MessageService],
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css']
})
export class CreateBlogComponent implements OnInit {
  blogForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  
  isEditMode = false;
  editBlogId = '';
  loadingBlog = false;

  uploading: boolean = false;
  deleting: boolean = false;
  imagePreview: string | ArrayBuffer | null = null;
  uploadedCoverData: { url: string, public_id: string } | null = null;

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router,
    private toastMsgService: ToastMessageService,
    private route: ActivatedRoute
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      coverImageMode: ['upload'], // 'upload' or 'url'
      coverImageUrl: [''],
      tags: [''] // Comma separated
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.editBlogId = id;
        this.fetchBlogForEdit(id);
      }
    });
  }

  fetchBlogForEdit(id: string) {
    this.loadingBlog = true;
    this.blogService.getBlogById(id).subscribe({
      next: (res) => {
        if (res.success && res.blog) {
          const blog = res.blog;
          this.blogForm.patchValue({
            title: blog.title,
            content: blog.content,
            tags: blog.tags ? blog.tags.join(', ') : ''
          });

          if (blog.coverImage?.url) {
            if (blog.coverImage.public_id) {
               this.blogForm.patchValue({ coverImageMode: 'upload' });
               this.uploadedCoverData = { url: blog.coverImage.url, public_id: blog.coverImage.public_id };
               this.imagePreview = blog.coverImage.url;
            } else {
               this.blogForm.patchValue({ coverImageMode: 'url', coverImageUrl: blog.coverImage.url });
            }
          }
        }
        this.loadingBlog = false;
      },
      error: (err) => {
        this.loadingBlog = false;
        this.toastMsgService.showError('Error', 'Failed to load blog for editing');
      }
    });
  }

  onImageSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadFile(event: any, nextCallback?: any) {
    if (!event?.files?.length) {
      this.toastMsgService.showError("Error", "No file selected for upload.");
      return;
    }

    this.uploading = true;
    const file = event.files[0];
    const uploadData = new FormData();
    uploadData.append('file', file);
    
    if (this.uploadedCoverData?.public_id) {
       uploadData.append('old_public_id', this.uploadedCoverData.public_id);
       this.blogService.updateCoverImage(uploadData).subscribe({
           next: (res) => {
              this.uploading = false;
              this.uploadedCoverData = res.coverImage;
              this.imagePreview = res.coverImage.url;
              if (this.fileUpload) this.fileUpload.clear();
              this.toastMsgService.showSuccess("Success", "Blog cover updated successfully.");
              if (nextCallback) nextCallback.emit();
           },
           error: (err) => {
              this.uploading = false;
              this.toastMsgService.showError("Error", err.error?.message || "Failed to update image.");
           }
       });
    } else {
       this.blogService.uploadCoverImage(uploadData).subscribe({
           next: (res) => {
              this.uploading = false;
              this.uploadedCoverData = res.coverImage;
              this.imagePreview = res.coverImage.url;
              if (this.fileUpload) this.fileUpload.clear();
              this.toastMsgService.showSuccess("Success", "Blog cover uploaded successfully.");
              if (nextCallback) nextCallback.emit();
           },
           error: (err) => {
              this.uploading = false;
              this.toastMsgService.showError("Error", err.error?.message || "Failed to upload image.");
           }
       });
    }
  }

  deleteFile() {
    if (!this.uploadedCoverData?.public_id) return;
    this.deleting = true;
    this.blogService.deleteCoverImage(this.uploadedCoverData.public_id).subscribe({
      next: (res) => {
         this.deleting = false;
         this.uploadedCoverData = null;
         this.imagePreview = null;
         if (this.fileUpload) this.fileUpload.clear();
         this.toastMsgService.showSuccess("Success", "Cover image deleted successfully.");
      },
      error: (err) => {
         this.deleting = false;
         this.toastMsgService.showError("Error", err.error?.message || "Failed to delete image.");
      }
    });
  }

  clearFileSelection(): void {
    if (this.fileUpload) this.fileUpload.clear();
    if (!this.uploadedCoverData) {
      this.imagePreview = null;
    } else {
      this.imagePreview = this.uploadedCoverData.url;
    }
  }

  onSubmit() {
    if (this.blogForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formValue = this.blogForm.value;
    
    let finalCoverImage = null;
    if (formValue.coverImageMode === 'upload') {
        if (this.uploadedCoverData) {
            finalCoverImage = this.uploadedCoverData;
        }
    } else {
        if (formValue.coverImageUrl) {
            finalCoverImage = { url: formValue.coverImageUrl, public_id: '' };
        }
    }

    const blogData = {
      title: formValue.title,
      content: formValue.content,
      coverImage: finalCoverImage,
      tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : []
    };

    if (this.isEditMode) {
      this.blogService.updateBlog(this.editBlogId, blogData).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.toastMsgService.showSuccess('Success', 'Blog updated successfully!');
          setTimeout(() => {
            this.router.navigate(['/admin/blogs']);
          }, 2000);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || 'Failed to update blog.';
          this.toastMsgService.showError('Error', this.errorMessage);
        }
      });
    } else {
      this.blogService.createBlog(blogData).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.toastMsgService.showSuccess('Success', 'Blog created successfully!');
          this.blogForm.reset();
          setTimeout(() => {
            this.router.navigate(['/admin/blogs']);
          }, 2000);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || 'Failed to create blog.';
          this.toastMsgService.showError('Error', this.errorMessage);
          console.error(err);
        }
      });
    }
  }
}
