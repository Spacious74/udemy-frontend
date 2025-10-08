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

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    CommonModule, AccordionModule, CheckboxModule, TabViewModule, OverviewComponent, QueAnsComponent, RateReviewComponent, 
    CertificateComponent, CheckboxModule
  ],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css',
})
export class VideoPlayerComponent implements OnInit {

  public selectedCourse: DraftCourse;
  public sectionList: SectionList[];
  public playlist: any[] = [];
  public courseId: any;

  constructor(
    private elRef: ElementRef,
    private draftedCourseService: DraftedCourseService,
    private activatedRoute: ActivatedRoute,
    private toastMsgService: ToastMessageService,
    private cookieService: CookieService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.courseId = this.activatedRoute.snapshot.params['courseId'];
    this.fetchCourseAndPlaylist();
  }

  fetchCourseAndPlaylist(){
    this.draftedCourseService.getCourseAndPlaylist(this.courseId).subscribe((res)=>{
      this.selectedCourse = res.course;
      this.sectionList = res.modules;
    },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
      })
  }

}
