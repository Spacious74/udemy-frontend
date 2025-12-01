import { Component, ElementRef, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';

import { OverviewComponent } from '../vpComponents/overview/overview.component';
import { QueAnsComponent } from '../vpComponents/que-ans/que-ans.component';
import { RateReviewComponent } from '../vpComponents/rate-review/rate-review.component';
import { CertificateComponent } from '../vpComponents/certificate/certificate.component';

import { CommonModule } from '@angular/common';
import { playlist } from '../../data/playlist';
import { DraftedCourseService } from '../../Services/draftedCourse.service';
import { ActivatedRoute } from '@angular/router';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../Services/auth.service';
import { DraftCourse } from '../../models/Course/DraftCourse';
import { SectionList } from '../../models/Course/SectionList';
import { UserProgress } from '../../models/UserProgress';
import { UserProgressService } from '../../Services/userProgress.service';
import { Store } from '@ngrx/store';
import { UserList } from '../../models/UserList';
import { FormsModule } from '@angular/forms';
import { VideoList } from '../../models/Course/VideoList';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    CommonModule, AccordionModule, CheckboxModule, TabViewModule, OverviewComponent, QueAnsComponent, RateReviewComponent,
    CertificateComponent, FormsModule
  ],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css',
})
export class VideoPlayerComponent implements OnInit {

  public selectedCourse: DraftCourse;
  public sectionList: SectionList[];
  public playlist: any[] = [];
  public courseId: any;
  public userId: string;
  public videoObj: VideoList;
  public currentUrl : string  = ""; 

  constructor(
    private userProgressService: UserProgressService,
    private activatedRoute: ActivatedRoute,
    private toastMsgService: ToastMessageService,
    private store: Store<{ userInfo: UserList }>
  ) { }

  ngOnInit(): void {
    this.courseId = this.activatedRoute.snapshot.params['courseId'];
    this.store.select("userInfo").subscribe((res) => {
      this.userId = res._id;
      this.fetchCourseAndPlaylist();
    })
  }

  setCurrentUrl(url:string){
    this.currentUrl = url;
  }

  fetchCourseAndPlaylist() {
    this.userProgressService.getUserProgress(this.userId, this.courseId).subscribe((res) => {
      this.selectedCourse = res.course;
      this.sectionList = res.playlist.sectionArr;
      this.currentUrl = res.playlist.lastWatchedVideo;
    },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
      })
  }


}
