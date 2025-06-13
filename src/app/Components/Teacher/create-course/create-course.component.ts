import { Component, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { CourseDetailDto } from '../../../models/Course/CourseDetailDto';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { UserList } from '../../../models/UserList';
import { ToastMessageService } from '../../../baseSettings/services/toastMessage.service';
import { DraftedCourseService } from '../../../Services/draftedCourse.service';
import { DraftCourse } from '../../../models/Course/DraftCourse';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AddVideoComponent } from '../add-video/add-video.component';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../Services/auth.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [
    StepperModule, ButtonModule, FormsModule, InputTextModule, InputTextareaModule,
    DropdownModule, InputNumberModule, FileUploadModule, CommonModule, ToastModule, AddVideoComponent
  ],
  providers: [ToastMessageService],
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.css'
})
export class CreateCourseComponent implements OnInit {

  public formData: CourseDetailDto = new CourseDetailDto();
  public userDetails: UserList;
  public draftedCourseId: string;
  public courseId: string;
  public userId: string;
  public draftedCourseDetails: DraftCourse;

  public imagePreview: string | ArrayBuffer | null = null;
  public uploading: boolean = false;
  public deleting: boolean = false;

  public errorFlag: boolean = false;
  public loading: boolean = false;
  public editMode: boolean = false;

  public selectedCategory: any;
  public categories: any[] = [
    { name: 'Development' },
    { name: 'Business' },
    { name: 'IT & Software' },
    { name: 'Design' },
    { name: 'Programming Languages' },
  ];
  public selectedLanguage: any;
  public languages = [
    { name: 'English', },
    { name: 'Hindi', },
    { name: 'Spanish', },
    { name: 'German', },
    { name: 'Portuguese', },
    { name: 'Japanese', },
  ]
  public selectedLevel: any;
  public levels = [
    { name: 'Beginner' },
    { name: 'Intermediate' },
    { name: 'Advanced' },
  ]

  constructor(
    private draftedCourseService: DraftedCourseService,
    private activatedRoute: ActivatedRoute,
    private toastmsgService: ToastMessageService,
    private store: Store<{ userInfo: UserList }>
  ) { }

  ngOnInit(): void {

    this.store.select('userInfo').subscribe((res) => {
      this.userDetails = res;
      this.courseId = this.activatedRoute.snapshot.params['courseId'];
      if (
        this.courseId !== 'null' &&
        this.userDetails &&
        this.userDetails._id
      ) {
        this.fetchCourseByEdAndCourseId();
        this.editMode = true;
      }
    },
      (error) => {
        this.toastmsgService.showError("Error", error.error.message);
      })

  }

  initializeCourseDetails() {
    this.formData = {
      title: this.draftedCourseDetails.title,
      subTitle: this.draftedCourseDetails.subTitle,
      description: this.draftedCourseDetails.description,
      category: this.draftedCourseDetails.category,
      subCategory: this.draftedCourseDetails.subCategory,
      price: this.draftedCourseDetails.price,
      language: this.draftedCourseDetails.language,
      level: this.draftedCourseDetails.level,
      educator: {
        edId: this.draftedCourseDetails.educator.edId,
        edname: this.draftedCourseDetails.educator.edname
      }
    };
    this.selectedCategory = { name: this.draftedCourseDetails.category };
    this.selectedLevel = { name: this.draftedCourseDetails.level };
    this.selectedLanguage = { name: this.draftedCourseDetails.language };
  }

  fetchCourseByEdAndCourseId() {
    this.draftedCourseService.getCourseByCourseAndEducatorId(this.courseId, this.userDetails._id).subscribe((res) => {
        if (res.success) {
          this.draftedCourseDetails = res.data;
          this.initializeCourseDetails();
        }
      }, (err) => {
        this.toastmsgService.showError("Error", err.error.message);
        this.errorFlag = true;
        this.loading = false;
      })
  }

  saveCourseDetails(nextCallback: any) {
    this.loading = true;
    this.formData.category = this.selectedCategory.name;
    this.formData.level = this.selectedLevel.name;
    this.formData.language = this.selectedLanguage.name;
    this.formData.educator = {
      edId: this.userDetails._id,
      edname: this.userDetails.username
    }
    if (this.editMode) {
      this.updateCourseDetails(); return;
    }
    this.draftedCourseService.createCourse(this.formData).subscribe((res) => {
      if (res.success) {
        nextCallback.emit();
        this.courseId = res.data._id;
        if (!this.editMode) {
          this.fetchCourseByEdAndCourseId();
          this.editMode = true;
        }
        this.draftedCourseDetails = res.data;
        this.toastmsgService.showSuccess("Success", "Course details uploaded successfully!");
        this.loading = false; this.errorFlag = false;
      }
      else {
        this.errorFlag = true;
        this.toastmsgService.showError("Error", "Some internal error occured!");
        this.loading = false;
      }
    }, (err) => {
      this.errorFlag = true;
      this.toastmsgService.showError("Error", err.error.message);
      this.loading = false;
    })
  }

  updateCourseDetails() {
    this.draftedCourseService.updateCourse(this.draftedCourseDetails._id, this.formData).subscribe((res) => {
      if (res.success) {
        this.draftedCourseDetails = res.data;
        this.fetchCourseByEdAndCourseId();
        this.toastmsgService.showSuccess("Success", "Course details updated successfully!");
        this.loading = false; this.errorFlag = false;
      }
      else {
        this.errorFlag = true;
        this.toastmsgService.showError("Error", "Some internal error occured!");
        this.loading = false;
      }
    }, (err) => {
      this.errorFlag = true;
      this.toastmsgService.showError("Error", err.error.message);
      this.loading = false;
    })
  }


  uploadFile(event: any, nextCallback: any) {
    if (!event?.files?.length) {
      this.uploading = false;
      this.toastmsgService.showError("Error", "No file selected for upload.");
      return;
    }

    // Guard against undefined draftedCourseDetails or _id
    if (!this.draftedCourseDetails?._id) {
      this.uploading = false;
      this.toastmsgService.showError("Error", "Course details not loaded. Please try again.");
      return;
    }
    this.uploading = true;
    const file = event.files[0];
    const uploadData = new FormData();
    uploadData.append('file', file);
    this.draftedCourseService.uploadThumbnail(uploadData, this.draftedCourseDetails._id).subscribe((res) => {
      this.uploading = false;
      this.imagePreview = null;
      this.draftedCourseDetails = { ...this.draftedCourseDetails, coursePoster: res.data.coursePoster };
      // Ensure fileUpload is defined before clearing
      if (this.fileUpload) {
        this.fileUpload.clear();
      }
      this.toastmsgService.showSuccess("Success", "Course thumbnail updated successfully.");
      if (!this.editMode) nextCallback.emit();
    },
      (error) => {
        this.loading = false;
        this.uploading = false;
        this.toastmsgService.showError("Error", error.error?.message);
      })
  }

  deleteFile() {
    this.deleting = true;
    this.draftedCourseService.deleteThumbnail(this.courseId).subscribe((res) => {
      this.deleting = false;
      this.draftedCourseDetails = { ...this.draftedCourseDetails, coursePoster: res.data.coursePoster };
      if (this.fileUpload) {
        this.fileUpload.clear();
      }
      this.toastmsgService.showSuccess("Success", "Thumbnail deleted successfully.");
    },
      (error) => {
        this.loading = false;
        this.toastmsgService.showError("Error", error.error.message);
      })
  }

  onImageSelect(event: any): void {
    const file = event.files[0]; // Get the first file selected
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Store the image as data URL
      };
      reader.readAsDataURL(file); // Read file as data URL to show the preview
    }
  }

  @ViewChild('fileUpload') fileUpload: FileUpload;
  clearFileSelection(): void {
    this.fileUpload.clear(); // Clear selected files
    this.imagePreview = null;
  }


}
