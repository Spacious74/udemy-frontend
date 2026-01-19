declare var Razorpay: any;
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { courseContent } from '../../data/courseContent';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DraftedCourseService } from '../../Services/draftedCourse.service';
import { DraftCourse } from '../../models/Course/DraftCourse';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { SectionList } from '../../models/Course/SectionList';
import { Cart } from '../../models/Cart';
import { Store } from '@ngrx/store';
import { ToastModule } from 'primeng/toast';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../../Services/cart.service';
import { UserList } from '../../models/UserList';
import { PaymentService } from '../../Services/payment.service';
import { appEnv } from '../../../config/environment';
import { AuthService } from '../../Services/auth.service';
import { filter, Subscription } from 'rxjs';


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
  public userDetails: UserList;
  public existInCart: boolean = false;
  public token: string = null;
  public loading: boolean = false;

  constructor(
    private draftedCourseService: DraftedCourseService,
    private paymentService: PaymentService,
    private activatedRoute: ActivatedRoute,
    private toastMsgService: ToastMessageService,
    private store: Store<{ userInfo: UserList }>,
    private cookieService: CookieService,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  public courseId: any;
  public isEnrolled: boolean = false;
  private subscriptions: Subscription = new Subscription();

  ngOnInit(): void {

    this.token = this.cookieService.get("skillUpToken");

    this.courseId = this.activatedRoute.snapshot.paramMap.get('courseId');
    if (this.courseId) this.fetchCourseAndPlaylist();

    const routeSub = this.activatedRoute.paramMap.subscribe(params => {
      const newId = params.get('courseId');
      if (newId && newId !== this.courseId) {
        this.courseId = newId;
        this.fetchCourseAndPlaylist();
      }
    });

    this.subscriptions.add(routeSub);

    if (this.token) {

      this.authService.getUserCoursesEnrolled().subscribe((res) => {
        if (res.success) {
          this.isEnrolled = res.data.some((dt: any) => dt._id == this.courseId);
        }
      }, (err) => {
        this.toastMsgService.showError("Error", "Failed to fetch user details.");
      })

      let userSub = this.store.select("userInfo").pipe(
        filter(user => !!user && !!user._id)
      ).subscribe((res) => {
        this.userDetails = res;
        this.fetchUserCartData();
      });

      this.subscriptions.add(userSub);

    } else {
      this.loadCartDataFromStorage();
    }

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // these both methods rendering stars according to the rating
  getStars(num: number) {
    return new Array(num).fill(1);
  }
  getRemainingStars(num: number) {
    return new Array(5 - num).fill(1);
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
    this.cartService.getCart(this.userDetails?._id).subscribe((res) => {
      if (res.success) {
        const cart: Cart = res.cart;
        this.existInCart = cart.cartItems.some((course) => course.courseId == this.courseId);
      } else {
        this.toastMsgService.showInfo("Info", res.message);
      }
    }, (err) => {
      this.toastMsgService.showError("Error", err.error.message);
    })
  }

  fetchCourseAndPlaylist() {
    this.draftedCourseService.getCourseAndPlaylist(this.courseId).subscribe((res) => {
      this.selectedCourse = res.course;
      this.sectionList = res.sectionArr;
    },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
      })
  }

  // this method add course to card according to the login state of user
  addToCart() {

    this.loading = true;
    // if not logged in i.e. no token is present then add to local storage
    if (!this.token) {
      this.addProductToLocalStorage();
      return;
    }

    // if logged in then add to the db
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

  // payment initializer method on click of a button
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

  // opens razorpay checkout popup
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

  // After payment successfull
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

  goToOrderSummaryPage() {
    this.router.navigate(
      ['/order-summary'],
      {
        queryParams: {
          courseId: this.courseId,
          isCart: false,
        }
      }
    )
  }

  navigateToPlayer(){
    let url = "/player/" + this.courseId;
    this.router.navigate([url]);
  }

}
