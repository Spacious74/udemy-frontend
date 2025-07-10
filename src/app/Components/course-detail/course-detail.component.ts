import { Component, HostListener, ElementRef, OnInit } from '@angular/core';
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
  public userDetails: UserList;
  public existInCart: boolean = false;
  public token: string = null;
  public loading : boolean = false;

  constructor(
    private elRef: ElementRef,
    private draftedCourseService: DraftedCourseService,
    private activatedRoute: ActivatedRoute,
    private toastMsgService: ToastMessageService,
    private addVideoService: AddVideoService,
    private store: Store<{ userInfo: UserList }>,
    private cookieService: CookieService,
    private cartService: CartService
  ) { }

  public courseId: any;
  ngOnInit(): void {

    this.courseId = this.activatedRoute.snapshot.params['courseId'];
    this.token = this.cookieService.get("skillUpToken");
    this.fetchCourseDetails();
    this.fetchSectionList();
    this.store.select("userInfo").subscribe((res) => {
      this.userDetails = res;
      if (this.token) this.fetchUserCartData();
      else this.loadCartDataFromStorage();
    }, (err) => {
      this.toastMsgService.showError("Error", "Failed to fetch user details.");
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

  loadCartDataFromStorage() {
    const courses = JSON.parse(localStorage.getItem("cartCourses")) || [];
    let courseExist = courses.find(course => course.courseId === this.courseId);
    if (courseExist) {
      this.existInCart = true;
    } else {
      this.toastMsgService.showInfo("Info", "Course not found in local storage.");
    }
  }

  addProductToLocalStorage() {
    let cartCourses = JSON.parse(localStorage.getItem("cartCourses")) || [];

    // Check if course already exists using _id
    const existingCourseIndex = cartCourses.findIndex(c => c.courseId === this.selectedCourse._id);

    if (existingCourseIndex !== -1) {
      this.toastMsgService.showInfo("Info", "Course already exists in cart.");
      return;
    }

    let obj = {
      _id: this.selectedCourse._id,
      coursePoster: this.selectedCourse.coursePoster,
      courseId: this.selectedCourse._id,
      courseName: this.selectedCourse.title,
      coursePrice: this.selectedCourse.price,
      educatorName: this.selectedCourse.educator.edname,
      lectures: this.selectedCourse.totalLectures,
      language: this.selectedCourse.language,
      level: this.selectedCourse.level
    }
    // If not exists, add course
    cartCourses.push(obj);

    // Save back to localStorage
    localStorage.setItem("cartCourses", JSON.stringify(cartCourses));

    this.toastMsgService.showSuccess("Success", "Course added to cart successfully.");
    this.existInCart = true;
    this.loading = false;
  }

  fetchUserCartData() {
    this.cartService.getCart(this.userDetails._id).subscribe((res) => {
      if (res.success) {
        const cart: Cart = res.cart;
        this.existInCart = cart.cartItems.some((course) => course.courseId === this.selectedCourse._id);
      } else {
        this.toastMsgService.showInfo("Info", res.message);
      }
    }, (err) => {
      this.toastMsgService.showError("Error", err.error.message);
    })
  }

  fetchCourseDetails() {
    this.draftedCourseService.getCourseDetailsById(this.courseId).subscribe((res) => {
      this.selectedCourse = res.course;
      if (this.token) this.fetchUserCartData()
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

    this.loading = true;
    if (!this.token) {
      this.addProductToLocalStorage();
      return;
    }

    this.cartService.addToCart(this.userDetails._id, this.selectedCourse._id).subscribe((res) => {
      if (res.success) {
        this.fetchCourseDetails();
        this.toastMsgService.showSuccess("Success", res.message);
        this.existInCart = true;
        this.loading = false;
      } else {
        this.toastMsgService.showInfo("Info", res.message);
        this.loading = false;
      }
    }, (err) => {
      this.toastMsgService.showError("Error", err.error.message);
      this.loading = false;
    });
  }


}
