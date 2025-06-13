import { Component, HostListener, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { courseContent } from '../../data/courseContent';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DraftedCourseService } from '../../Services/draftedCourse.service';
import { DraftCourse } from '../../models/Course/DraftCourse';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { SectionList } from '../../models/Course/SectionList';
import { AddVideoService } from '../../Services/addVideo.service';
import { Cart } from '../../models/Cart';
import { Store } from '@ngrx/store';
import { ToastModule } from 'primeng/toast';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../../Services/cart.service';
import { UserList } from '../../models/UserList';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [AccordionModule, CommonModule, ButtonModule, FooterComponent, DatePipe, ToastModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css',
})
export class CourseDetailComponent implements OnInit {

  public selectedCourse: DraftCourse;
  public reviewsArr: any[];
  public sectionList: SectionList[];
  public courseContent: any[] = courseContent;
  public showCard: boolean = false;
  public userDetails : UserList;
  public existInCart : boolean = false;
  public token : string = null;

  constructor(
    private elRef: ElementRef,
    private draftedCourseService: DraftedCourseService,
    private activatedRoute: ActivatedRoute,
    private toastMsgService: ToastMessageService,
    private addVideoService: AddVideoService,
    private store: Store<{userInfo : UserList}>,
    private cookieService: CookieService,
    private cartService : CartService
  ) { }

  public courseId: any;
  ngOnInit(): void {
    
    this.token = this.cookieService.get("skillUpToken");
    this.courseId = this.activatedRoute.snapshot.params['courseId'];
    this.fetchCourseDetails();
    this.fetchSectionList();
    this.store.select("userInfo").subscribe((res)=>{
      this.userDetails = res;
    });


  }

  getStars(num: number) {
    return new Array(num).fill(1);
  }
  getRemainingStars(num: number) {
    return new Array(5 - num).fill(1);
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

  loadCartDataFromStorage(){
    
  }

  fetchCourseDetails() {
    this.draftedCourseService.getCourseDetailsById(this.courseId).subscribe((res) => {
      this.selectedCourse = res.course;
      this.reviewsArr = res.reviews?.reviewArr;
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

  addToCart() {
    if(!this.token){
      this.toastMsgService.showError("Error", "Please login to add course to cart.");
      return;
    }
    this.cartService.addToCart(this.userDetails._id, this.selectedCourse._id).subscribe((res) => {
      if (res.success) {
        this.toastMsgService.showSuccess("Success", res.message);
        this.existInCart = true;
      }
    }, (err) => {
      this.toastMsgService.showError("Error", err.error.message);
    });

  }
}
