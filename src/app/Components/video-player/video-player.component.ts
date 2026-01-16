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
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';

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
import { filter, switchMap, take, tap } from 'rxjs';
import { CertificateService } from '../../Services/certificate.service';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    CommonModule, AccordionModule, CheckboxModule, TabViewModule, OverviewComponent, QueAnsComponent, RateReviewComponent,
    CertificateComponent, FormsModule, TooltipModule, ToastModule, ProgressBarModule, TagModule
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
  public currentVideoId: string = '';
  public currentUrl: string = '';
  public videoSet = new Set();
  public currentWatchingPercentage: number = 0;
  public flatVideoList: VideoList[];
  public activeIndex: number[] = [];
  public totalCompletedLectures: number = 0;
  public totalCompletedLecturesPercentage: number = 0;
  public totalLectures: number = 0;
  public completionStatus : boolean = false;
  public currentSectionIndex : string = null;
  public certificateLoadingState : boolean = false;

  constructor(
    private userProgressService: UserProgressService,
    private draftedCourseService: DraftedCourseService,
    private certificateService : CertificateService,
    private activatedRoute: ActivatedRoute,
    private toastMsgService: ToastMessageService,
    private store: Store<{ userInfo: UserList }>
  ) { }

  ngOnInit(): void {

    this.courseId = this.activatedRoute.snapshot.params['courseId'];
    this.store.select('userInfo').pipe(
      filter(user => !!user && !!user._id),
      take(1),
      switchMap((user) => {
        this.userId = user._id;

        // 1️⃣ First API call
        return this.fetchCourseAndPlaylist();
      }),
      switchMap(() => {
        // 2️⃣ Second API call AFTER first success
        return this.fetchUserProgress();
      })
    ).subscribe({
      next: () => {
        console.log('Both APIs completed successfully');
      },
      error: (error) => {
        this.toastMsgService.showError('Error', error.error?.message);
      }
    });

  }

  fetchCourseAndPlaylist() {
    return this.draftedCourseService.getCourseAndPlaylist(this.courseId).pipe(
      tap((res) => {
        this.selectedCourse = res.course;
        this.totalLectures = res.course.totalLectures;
        this.sectionList = res.sectionArr;
        this.flatVideoList = this.sectionList.flatMap(section => section.videos);
      })
    );
  }

  fetchUserProgress() {
    return this.userProgressService.getUserProgress(this.userId, this.courseId).pipe(
      tap((res) => {
        this.videosCompleted = res.videosProgress.videosCompleted;
        this.totalCompletedLectures = this.videosCompleted.length;
        this.totalCompletedLecturesPercentage = Math.floor((this.totalCompletedLectures * 100) / this.totalLectures);

        this.videoSet = new Set(this.videosCompleted);
        this.currentWatchingVideo = res.videosProgress.currentWatchingVideo;
        this.currentVideoId = res.videosProgress.currentWatchingVideo.videoId;
        this.currentUrl = res.videosProgress.currentWatchingVideo.videoUrl;

        this.completionStatus = res.videosProgress.courseCompletionStatus;

        let value = this.findSectionAndVideoIndex(this.sectionList, this.currentVideoId);
        this.currentSectionIndex = String(value+1);
        if (!this.activeIndex.includes(value)) this.activeIndex = [...this.activeIndex, value];
      })
    );
  }
  onAccordionOpen(event: any) {
    if (!this.activeIndex.includes(event.index)) this.activeIndex = [...this.activeIndex, event.index];
  }
  
  onAccordionClose(event: any) {
    this.activeIndex = this.activeIndex.filter(i => i !== event.index);
  }

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  onVideoEnded() {
    const video = this.videoPlayer.nativeElement;
    const watchedPercent = (video.currentTime / video.duration) * 100;
    this.currentWatchingPercentage = watchedPercent;
    if (this.currentWatchingPercentage >= 90) {
      this.videoSet.add(this.currentWatchingVideo.videoId);
      this.userProgressService.markVideoCompleted(this.userId, this.courseId, this.currentWatchingVideo.videoId).subscribe((res) => {
        this.videosCompleted = res.videosProgress.videosCompleted;
        this.completionStatus = res.videosProgress.courseCompletionStatus;
        this.videoSet = new Set(this.videosCompleted);
      },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
      });
    }
  }

  fetchNextVideo() {
    let nextIndex = this.currentWatchingVideo.globalVideoIdx + 1;
    let videoId = this.flatVideoList[nextIndex]._id;
    this.getReqVideo(videoId);
  }

  fetchPreviousVideo() {
    let previousIndex = this.currentWatchingVideo.globalVideoIdx - 1;
    let videoId = this.flatVideoList[previousIndex]._id;
    this.getReqVideo(videoId);
  }

  getReqVideo(reqVideoId: string) {
    this.userProgressService.getVideoDirectly(this.userId, this.courseId,
      this.currentWatchingVideo.videoId, reqVideoId, this.currentWatchingPercentage
    ).subscribe((res) => {
      this.currentWatchingVideo = res.videosProgress.currentWatchingVideo;
      this.videosCompleted = res.videosProgress.videosCompleted;
      this.currentVideoId = res.videosProgress.currentWatchingVideo.videoId;
      this.currentUrl = res.videosProgress.currentWatchingVideo.videoUrl;
      this.videoSet = new Set(this.videosCompleted);
      this.completionStatus = res.videosProgress.courseCompletionStatus;
      let value = this.findSectionAndVideoIndex(this.sectionList, this.currentVideoId);
      this.currentSectionIndex = String(value+1);
      if (!this.activeIndex.includes(value)) this.activeIndex = [...this.activeIndex, value];
    },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
      })
  }

  findSectionAndVideoIndex(sectionArr: SectionList[], videoId: string) {
    for (let sIndex = 0; sIndex < sectionArr.length; sIndex++) {
      const vIndex = sectionArr[sIndex].videos.findIndex(video => video._id === videoId);
      if (vIndex !== -1) return sIndex;
    }
    return null;
  }

  getSequence(sectionIdx:number, videoIdx:number){
    if(sectionIdx == 0) return null;
    let a = this.sectionList[sectionIdx-1].videos.length + 1;
    for(let i=0;i<videoIdx; i++){
      a++;
    }
    return a;
  }
  
  generateCertificate(value: string) {
    this.certificateLoadingState = true;
    this.certificateService.generateCertificate(this.userId, this.courseId).subscribe((res)=>{
      window.open(res.pdfUrl, "_blank");
      this.certificateLoadingState = false;
    },
    (error) => {
      this.toastMsgService.showError("Error", error.error.message);
      this.certificateLoadingState = false;
    })
  }
}
