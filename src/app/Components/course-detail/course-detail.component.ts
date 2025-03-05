import { Component, HostListener, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { courseContent } from '../../data/courseContent';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../Services/course.service';
import { courseData } from '../../data/course';
import { DatePipe } from '@angular/common';
import { CartService } from '../../Services/cart.service';
import { AuthService } from '../../Services/auth.service';
import { DraftedCourseService } from '../../Services/draftedCourse.service';
import { DraftCourse } from '../../models/Course/DraftCourse';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { SectionList } from '../../models/Course/SectionList';
import { AddVideoService } from '../../Services/addVideo.service';
@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [AccordionModule, CommonModule, ButtonModule, FooterComponent, DatePipe],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css',
})
export class CourseDetailComponent implements OnInit {

  public selectedCourse: DraftCourse;
  public reviewsArr : any[];
  public sectionList : SectionList[];
  public courseContent: any[] = courseContent;
  public showCard: boolean = false;

  constructor(
    private elRef: ElementRef,
    private draftedCourseService : DraftedCourseService,
    private activatedRoute: ActivatedRoute,
    private toastMsgService : ToastMessageService,
    private addVideoService : AddVideoService,
    private cartService : CartService,
    private authService : AuthService
  ) {}

  public courseId : any;
  ngOnInit() : void {
    this.courseId = this.activatedRoute.snapshot.params['courseId'];
    this.fetchCourseDetails();
    this.fetchSectionList();
  }

  getStars(num :number){
    return new Array(num).fill(1);
  }
  getRemainingStars(num : number){
    return new Array(5-num).fill(1);
  }
  
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    if (
      window.scrollY > 200 &&
      window.scrollY < this.getScrollYHeight() - 900
    ) {
      this.showCard = true;
    } else {
      this.showCard = false;
    }
  }

  fetchCourseDetails(){
    this.draftedCourseService.getCourseDetailsById(this.courseId).subscribe((res)=>{
      this.selectedCourse = res.course;
      this.reviewsArr = res.reviews.reviewArr;
    },
    (error) => {
      this.toastMsgService.showError("Error", error.error.message);
    });
  }

  fetchSectionList() {
    this.addVideoService.getAllVideoSections(this.courseId).subscribe((res) => {
      this.sectionList = res.data;
    }, (err) => {
      this.toastMsgService.showError("Error", err.error.message);
    })
  }


  getScrollYHeight(): number {
    return this.elRef.nativeElement.ownerDocument.documentElement.scrollHeight;
  }

  addToCart(){
    // console.log(localStorage.getItem('userId'));
  }
}
