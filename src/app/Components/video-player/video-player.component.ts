import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';

import { OverviewComponent } from '../vpComponents/overview/overview.component';
import { QueAnsComponent } from '../vpComponents/que-ans/que-ans.component';
import { RateReviewComponent } from '../vpComponents/rate-review/rate-review.component';
import { CertificateComponent } from '../vpComponents/certificate/certificate.component';

import { CommonModule } from '@angular/common';
import { playlist } from '../../data/playlist';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    CheckboxModule,
    TabViewModule,
    OverviewComponent,
    QueAnsComponent,
    RateReviewComponent,
    CertificateComponent,
  ],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css',
})
export class VideoPlayerComponent implements OnInit {
  playlist: any[] = [];
  ngOnInit(): void {
    this.playlist = playlist;
  }
  getVideoNumber(sectionIndex: number, videoIndex: number): number {
    let count = 1;
    for (let i = 0; i < sectionIndex; i++) {
      count += this.playlist[i].videos.length;
    }
    return count + videoIndex;
  }
}
