import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ToastMessageService } from '../../../baseSettings/services/toastMessage.service';
import { AddVideoService } from '../../../Services/addVideo.service';
import { SectionList } from '../../../models/Course/SectionList';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'app-add-video',
  standalone: true,
  imports: [ ToastModule, CommonModule, ButtonModule, DialogModule, 
  InputTextModule, FormsModule, FieldsetModule ],
  templateUrl: './add-video.component.html',
  styleUrl: './add-video.css'
})
export class AddVideoComponent implements OnInit {

  @Input() userId: string;
  @Input() courseId: string;
  @Input() editMode: boolean;

  public sectionList: SectionList[];
  public sectionName: string;
  public videoTitle: string;
  public sectionId: string;
  public videoId: string;
  public loading: boolean = false;
  public updateVideoMode: boolean = false;

  public showSection: boolean = false;
  public showVideo: boolean = false;
  public playVideo : boolean = false;

  public cloudName = "drrczbcx7";
  public uploadPreset = "emnakpuq";
  public videoUrl = "";
  public videoHeader = "";
  public myWidget: any;

  public totalSection: number;

  constructor(
    private addVideoService: AddVideoService,
    private toastmsgService: ToastMessageService,
  ) { }

  ngOnInit(): void {

    if (!(window as any).cloudinary) {
      console.error('Cloudinary is not loaded. Please check the script inclusion.');
      return;
    }

    this.myWidget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: this.cloudName,
        uploadPreset: this.uploadPreset,
        resourceType: 'video', // Set the resource type to 'video'
        multiple: false,  //restrict upload to a single file
        folder: "SkillUp_Videos", //upload files to the specified folders
        clientAllowedFormats: ['mp4', 'mov', 'avi'], //restrict uploading to image files only
        maxDuration: 3900
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          let pId = result.info.public_id.split('/')[1];
          let data = {
            public_id: pId,
            url: result.info.url,
          }
          if (this.updateVideoMode) {
            this.updateVideoFile(data)
          }else { 
            this.uploadVideoFile(data); 
          }
        } else {
          this.toastmsgService.showError("Error", error.message);
        }
      }
    );

    this.fetchSectionList();

  }

  toggleSection(sectionName?: string, sectionId?: string, event?: Event) {
    if (event) event.stopPropagation();
    if (sectionId) {
      this.sectionName = sectionName;
      this.sectionId = sectionId;
    } else {
      this.sectionName = undefined;
      this.sectionId = undefined;
    }
    this.showSection = !this.showSection;
  }

  toggleVideo(event : Event, sectionId?: string, videoTitle?: string, videoId?: string) {
    event.stopPropagation();
    if (sectionId) this.sectionId = sectionId;
    if (videoId) {
      this.videoTitle = videoTitle;
      this.videoId = videoId;
    }else{
      this.videoTitle = undefined;
      this.videoId = undefined;
    }
    this.showVideo = !this.showVideo;
  }

  togglePlayVideo(videoUrl: string, videoHeader:string,) {
    this.videoUrl = null;
    setTimeout(() => {
      this.videoUrl = videoUrl;
    });
    this.videoHeader = videoHeader
    this.playVideo = !this.playVideo;
  }

  openWidget(sectionId: string, videoId: string) {
    this.sectionId = sectionId;
    this.videoId = videoId;
    this.myWidget.open();
  }

  openWidgetForUpdate(sectionId: string, videoId: string) {
    this.updateVideoMode = true;
    this.sectionId = sectionId;
    this.videoId = videoId;
    this.myWidget.open();
  }


  fetchSectionList() {
    this.loading = true;
    this.addVideoService.getAllVideoSections(this.courseId).subscribe((res) => {
      this.sectionList = res.data;
      this.totalSection = res.data.length;
      this.loading = false;
    }, (err) => {
      this.toastmsgService.showError("Error", err.error.message);
      this.loading = false;
    })
  }

  addSectionTitle() {
    if (!this.sectionName) {
      this.toastmsgService.showError("Error", "Enter section title to save it."); return;
    }
    this.sectionName = this.sectionName.trim();
    if (this.sectionId) {
      this.updateSection(); return;
    }
    this.addVideoService.addSection(this.courseId, this.sectionName).subscribe((res) => {
      if (res.success) {
        this.sectionList = res.data;
        this.totalSection = res.data.length;
        this.sectionName = undefined;
        this.toastmsgService.showSuccess("Success", "Section title saved successfully!");
        this.showSection = !this.showSection;
      }
      this.loading = false;
    }, (err) => {
      this.toastmsgService.showError("Error", err.error.message);
      this.loading = false;
    })
  }

  updateSection() {
    this.addVideoService.updateSection(this.courseId, this.sectionId, this.sectionName).subscribe((res) => {
      if (res.success) {
        this.sectionList = res.data;
        this.totalSection = res.data.length;
        this.sectionName = undefined;
        this.sectionId = undefined;
        this.toastmsgService.showSuccess("Success", "Section title updated successfully!");
        this.showSection = !this.showSection;
      }
      this.loading = false;
    }, (err) => {
      this.toastmsgService.showError("Error", err.error.message);
      this.loading = false;
    })
  }

  deleteSection(event: Event, sectionId: string, videoArrLength: number) {
    event.stopPropagation();
    if (videoArrLength > 0) {
      this.toastmsgService.showError("Error", "Can not delete if section contains videos"); return;
    }

    if (!confirm("Are you sure you want to delete this section")) return;

    this.addVideoService.deleteSection(this.courseId, sectionId).subscribe((res) => {
      if (res.success) {
        this.sectionList = res.data;
        this.totalSection = res.data.length;
        this.sectionId = undefined;
        this.loading = false;
        this.toastmsgService.showSuccess("Success", "Section deleted successfully!");
      }
      this.loading = false;
    }, (err) => {
      this.toastmsgService.showError("Error", err.error.message);
      this.loading = false;
    })

  }

  addVideo(event: Event,) {
    event.stopPropagation();
    this.videoTitle = this.videoTitle.trim();
    if (this.videoId) {
      this.updateVideoTitle(); return;
    }
    this.addVideoService.addVideoToSection(this.courseId, this.sectionId, this.videoTitle).subscribe((res) => {
      if (res.success) {
        this.sectionList = res.data;
        this.totalSection = res.data.length;
        this.videoTitle = undefined;
        this.videoId = undefined;
        this.sectionId = undefined;
        this.toastmsgService.showSuccess("Success", "Video title saved successfully!");
        this.showVideo = !this.showVideo;
      }
      this.loading = false;
    }, (err) => {
      this.toastmsgService.showError("Error", err.error.message);
      this.loading = false;
    })
  }

  updateVideoTitle() {
    this.addVideoService.updateVideoTitle(this.courseId, this.sectionId, this.videoId, this.videoTitle).subscribe((res) => {
      if (res.success) {
        this.sectionList = res.data;
        this.totalSection = res.data.length;
        this.videoTitle = undefined;
        this.videoId = undefined;
        this.sectionId = undefined;
        this.toastmsgService.showSuccess("Success", "Video title updated successfully!");
        this.showVideo = !this.showVideo;
      }
      this.loading = false;
    }, (err) => {
      this.toastmsgService.showError("Error", err.error.message);
      this.loading = false;
    })
  }

  uploadVideoFile(data: any) {
    this.addVideoService.addVideoFile(this.courseId, this.sectionId, this.videoId, data).subscribe((res) => {
      if (res.success) {
        this.sectionList = res.data;
        this.totalSection = res.data.length;
        this.toastmsgService.showSuccess("Success", "Video uploaded successfully!");
      } else {
        this.toastmsgService.showError("Error", res.message);
      }
    }, (err) => {
      this.toastmsgService.showError("Error", err.error.message);
      this.loading = false;
    })
  }

  updateVideoFile(data: any) {
    this.addVideoService.updateVideoFile(this.courseId, this.sectionId, this.videoId, data).subscribe((res) => {
      if (res.success) {
        this.sectionList = res.data;
        this.totalSection = res.data.length;
        this.videoId = undefined;
        this.toastmsgService.showSuccess("Success", "Video file updated successfully!");
      } else {
        this.toastmsgService.showError("Error", res.message);
      }
    }, (err) => {
      this.toastmsgService.showError("Error", err.error.message);
      this.loading = false;
    })
  }

  deleteVideo(sectionId: string, videoId: string) {
    if (!confirm("Are you sure you want to delete this video lecture ?")) return;
    this.addVideoService.deleteVideo(this.courseId, sectionId, videoId).subscribe((res) => {
      if (res.success) {
        this.sectionList = res.data;
        this.totalSection = res.data.length;
        this.videoId = undefined;
        this.sectionId = undefined;
        this.toastmsgService.showSuccess("Success", "Video deleted successfully!");
      }
      this.loading = false;
    }, (err) => {
      this.toastmsgService.showError("Error", err.error.message);
      this.loading = false;
    })
  }

}
