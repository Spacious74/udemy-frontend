import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';

import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';

import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { OverviewComponent } from '../vpComponents/overview/overview.component';
import { QueAnsComponent } from '../vpComponents/que-ans/que-ans.component';
import { RateReviewComponent } from '../vpComponents/rate-review/rate-review.component';
import { CertificateComponent } from '../vpComponents/certificate/certificate.component';

import { DraftedCourseService } from '../../Services/draftedCourse.service';
import { UserProgressService } from '../../Services/userProgress.service';
import { DraftCourse } from '../../models/Course/DraftCourse';
import { UserList } from '../../models/UserList';
import { SectionList } from '../../models/Course/SectionList';
import { CurrentWatchingVideo } from '../../models/UserProgress';
import { VideoList } from '../../models/Course/VideoList';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    CommonModule, AccordionModule, CheckboxModule, TabViewModule, OverviewComponent, QueAnsComponent, RateReviewComponent,
    CertificateComponent, FormsModule, TooltipModule, ToastModule
  ],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css',
})
export class VideoPlayerComponent implements OnInit {

  public selectedCourse: DraftCourse;
  public sectionList: SectionList[];
  public videosCompleted: String[];
  public courseId: any;
  public userId: string;
  public currentWatchingVideo: CurrentWatchingVideo;
  public currentUrl: string = '';
  public videoSet = new Set();
  public currentWatchingPercentage: number = 0;
  public flatVideoList: VideoList[];


  constructor(
    private userProgressService: UserProgressService,
    private draftedCourseService: DraftedCourseService,
    private activatedRoute: ActivatedRoute,
    private toastMsgService: ToastMessageService,
    private store: Store<{ userInfo: UserList }>
  ) { }

  ngOnInit(): void {
    this.courseId = this.activatedRoute.snapshot.params['courseId'];
    this.store.select("userInfo").subscribe((res) => {
      this.userId = res?._id;
      this.fetchCourseAndPlaylist();
      this.fetchUserProgress();
    },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
      })
  }

  setCurrentUrl(url: string) {
    this.currentUrl = url;
  }

  fetchCourseAndPlaylist() {
    this.draftedCourseService.getCourseAndPlaylist(this.courseId).subscribe((res) => {
      this.selectedCourse = res.course;
      this.sectionList = res.sectionArr;
      this.flatVideoList = this.sectionList.flatMap(section => section.videos);
      console.log(this.flatVideoList);
    },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
      })
  }

  fetchUserProgress() {
    this.userProgressService.getUserProgress(this.userId, this.courseId).subscribe((res) => {
      this.videosCompleted = res.videosProgress.videosCompleted;
      this.videoSet = new Set(this.videosCompleted);
      console.log(this.videoSet);
      this.currentWatchingVideo = res.videosProgress.currentWatchingVideo;
      this.currentUrl = res.videosProgress.currentWatchingVideo.videoUrl;
    },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
      })
  }

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  onVideoEnded() {
    const video = this.videoPlayer.nativeElement;
    const watchedPercent = (video.currentTime / video.duration) * 100;
    this.currentWatchingPercentage = watchedPercent;
    if (this.currentWatchingPercentage >= 90) {
      console.log("Watching Percentage", this.currentWatchingPercentage);
      this.videoSet.add(this.currentWatchingVideo.videoId);
      this.userProgressService.markVideoCompleted(this.userId, this.courseId, this.currentWatchingVideo.videoId).subscribe((res) => {
        this.videosCompleted = res.videosProgress.videosCompleted;
        this.videoSet = new Set(this.videosCompleted);
      },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
      });
    }
  }

  getReqVideo(reqVideoId: string) {
    this.userProgressService.getVideoDirectly(this.userId, this.courseId,
      this.currentWatchingVideo.videoId, reqVideoId, this.currentWatchingPercentage
    ).subscribe((res) => {
      this.currentWatchingVideo = res.videosProgress.currentWatchingVideo;
      this.videosCompleted = res.videosProgress.videosCompleted;
      this.currentUrl = res.videosProgress.currentWatchingVideo.videoUrl;
      this.videoSet = new Set(this.videosCompleted);
      // console.log(this.videoSet);
    },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
      })
  }

}
