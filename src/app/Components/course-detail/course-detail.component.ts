declare var Razorpay: any;
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
import { PaymentService } from '../../Services/payment.service';
import { appEnv } from '../../../config/environment';
import { AuthService } from '../../Services/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [AccordionModule, CommonModule, ButtonModule, FooterComponent, DatePipe, ToastModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css',
})
export class CourseDetailComponent implements OnInit, OnDestroy {

  public selectedCourse: DraftCourse;
  public sectionList: SectionList[];
  public reviewsArr: any[];
  public courseContent: any[] = courseContent;
  public showCard: boolean = false;
  public userDetails: UserList;
  public existInCart: boolean = false;
  public token: string = null;
  public loading: boolean = false;

  constructor(
    private elRef: ElementRef,
    private draftedCourseService: DraftedCourseService,
    private paymentService: PaymentService,
    private activatedRoute: ActivatedRoute,
    private toastMsgService: ToastMessageService,
    private store: Store<{ userInfo: UserList }>,
    private cookieService: CookieService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  public courseId: any;
  public isEnrolled: boolean = false;
  private subscriptions : Subscription = new Subscription();
  ngOnInit(): void {

    this.token = this.cookieService.get("skillUpToken");

    this.activatedRoute.paramMap.subscribe((res)=>{
      this.courseId = res.get('courseId');
      this.fetchCourseAndPlaylist();
    })

    if(this.token){
      this.authService.getUserCoursesEnrolled().subscribe((res) => {
        if (res.success) {
          this.isEnrolled = res.data.some((dt: any) => dt._id == this.courseId);
        } else {
          this.toastMsgService.showError("Error", "Something went wrong.");
        }
      }, (err) => {
        this.toastMsgService.showError("Error", "Failed to fetch user details.");
      })
      let userSub = this.store.select("userInfo").subscribe((res) => {
        this.userDetails = res;
        this.fetchUserCartData()
      }, (err) => {
        this.toastMsgService.showError("Error", "Failed to fetch user details.");
      });
      this.subscriptions.add(userSub);
    }else{
      this.loadCartDataFromStorage();
    }

  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
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
    if (typeof window !== 'undefined' && localStorage) {
      const courses = JSON.parse(localStorage.getItem("cartCourses") || '[]');
      let courseExist = courses.find(course => course.courseId === this.courseId);
      if (courseExist) {
        this.existInCart = true;
      } else {
        this.toastMsgService.showInfo("Info", "Course not found in local storage.");
      }
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

  fetchCourseAndPlaylist(){
    this.draftedCourseService.getCourseAndPlaylist(this.courseId).subscribe((res)=>{
      this.selectedCourse = res.course;
      if (this.token) this.fetchUserCartData();
      this.sectionList = res.sectionArr;
    },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
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

  checkOutHandler() {
    
    let orderData = {
      courseId: this.selectedCourse._id,
      amount: this.selectedCourse.price
    }

    this.paymentService.singleCheckout(orderData).subscribe((res) => {
      if (res.success) {
        this.openRazorpayCheckout(res.orderId, res.amount);
        this.toastMsgService.showSuccess("Success", "Order created successfully.");
      } else {
        this.toastMsgService.showInfo("Info", "Something went wrong, please try again later.");
      }
      this.loading = false;
    }, (err) => {
      this.toastMsgService.showError("Error", err.error.message);
      this.loading = false;
    });

  }

  openRazorpayCheckout(orderId: String, amount: number) {
    const options = {
      key: appEnv.razorpayKey,
      amount: amount * 100,
      currency: 'INR',
      name: 'Skill Up.',
      description: 'Course Purchase',
      order_id: orderId,
      handler: this.paymentDone.bind(this),
      prefill: {
        name: this.userDetails.username,
        email: this.userDetails.email,
      },
      theme: { color: '#1A241B' }
    };
    const rzp = new Razorpay(options);
    rzp.open();
  }

  paymentDone(response: any) {

    let data = {
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
      userId: this.userDetails._id,
      courseId: this.selectedCourse._id
    }

    this.paymentService.singlePaymentVerify(data).subscribe((res) => {
      if (res.success) {
        this.toastMsgService.showSuccess("Success", "Payment successful. Course added to your Learning.");
        this.isEnrolled = true;
        this.loading = false;
      }
    }, (err) => {
      this.toastMsgService.showError("Error", err.error.message);
      this.loading = false;
    })
  }

}
