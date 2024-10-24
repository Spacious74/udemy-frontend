import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FileUpload, FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AppObject } from '../../baseSettings/AppObject';
import { UserList } from '../../models/UserList';
import { AuthService } from '../../Services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { UserDto } from '../../models/UserDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [InputTextModule, ButtonModule, TabViewModule, CommonModule, FormsModule, InputTextareaModule,
    ToastModule, TagModule, FileUploadModule, InputGroupModule, InputGroupAddonModule
  ],
  providers : [ToastMessageService],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  
  public userDetails: UserList;
  public loading : boolean = false;
  public formData : UserDto = new UserDto();  
  public isChanged : boolean = false;
  public originalData : string = '';
  public imagePreview: string | ArrayBuffer | null = null;
  public uploading : boolean = false;
  public deleting : boolean = false;

  constructor(
    private authService : AuthService,
    private cookieService : CookieService,
    private routerService : Router,
    private toastMsgService : ToastMessageService,
  ){}
  ngOnInit(): void {
    this.userDetails = AppObject.userData;
    let token = this.cookieService.get('skillUpToken')
    if(token){
      AppObject.AuthToken = token;
      this.authService.getUserData(token).subscribe((res)=>{
        AppObject.userData = res.data;
        this.userDetails = res.data;
        this.formData.username = res.data.username;
        this.formData.bio = res.data.bio;
        this.formData.profileImage = res.data.profileImage;
        this.formData.email = res.data.email;
        this.formData.socialLinks = res.data.socialLinks;
        this.formData.userId = res.data._id;
        this.originalData = JSON.parse(JSON.stringify(this.formData));
      }, 
      (error)=>{
        this.toastMsgService.showError("Error", error.error.message);
        this.cookieService.delete('skillUpToken');
        this.routerService.navigate(['/']);
      })
    }
    if(!token){
      console.log('token not found');
      this.routerService.navigate(['/']);
    }
  }

  uploadFile(event: any) {
    this.uploading = true;
    const file = event.files[0];
    const uploadData = new FormData();
    uploadData.append('file', file);
    this.authService.uploadUserProfile(uploadData).subscribe((res)=>{
      this.uploading = false;
      this.formData = { ...this.formData, profileImage: res.data.profileImage };
      this.imagePreview = null;
      // Ensure fileUpload is defined before clearing
      if (this.fileUpload) {
        this.fileUpload.clear();
      }
      this.toastMsgService.showSuccess("Success", "Profile picture updated successfully.");
    }, 
    (error)=>{
      this.loading = false;
      this.uploading = false;
      this.toastMsgService.showError("Error", error.error.message);
    })
  }

  deleteFile(){
    this.deleting = true;
    this.authService.deleteUserImage().subscribe((res)=>{
    this.deleting = false;
      this.formData = { ...this.formData, profileImage: res.data.profileImage };
      if (this.fileUpload) {
        this.fileUpload.clear();
      }
      this.toastMsgService.showSuccess("Success", "Profile picture deleted successfully.");
    }, 
    (error)=>{
      this.loading = false;
      this.toastMsgService.showError("Error", error.error.message);
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

  updateData(){
    this.loading = true;
    this.authService.updateUser(this.formData).subscribe((res)=>{
      if(res.success){
        this.toastMsgService.showSuccess("Success", "User information updated successfully.");
        this.loading = false;
        this.isChanged = false;
        this.formData.username = res.data.username;
        this.formData.bio = res.data.bio;
        this.formData.profileImage = res.data.profileImage;
        this.formData.email = res.data.email;
        this.formData.socialLinks.portfolio = res.data.socialLinks.portfolio;
        this.formData.userId = res.data._id;
      }else{
        this.toastMsgService.showError("Error", "Something went wrong.");
        this.loading = false;
        this.isChanged = false;
      }
    }, 
    (error)=>{
      this.loading = false;
      this.isChanged = false;
      this.toastMsgService.showError("Error", error.error.message);
    })
  }

    // Method triggered on any input change
    onInputChange() {
      this.isChanged = this.checkForChanges();
    }
  
    // Check if any field has been modified compared to the original data
    checkForChanges(): boolean {
      return JSON.stringify(this.formData) !== JSON.stringify(this.originalData);
    }
  

}
