import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject, of, tap } from "rxjs";
import { CartService } from "./cart.service";
import { CookieService } from "ngx-cookie-service";
import { isPlatformBrowser } from "@angular/common";
import { CourseList } from "../models/Course/CourseList";
import { DraftCourse } from "../models/Course/DraftCourse";
import { CartItem } from "../models/CartItems";

@Injectable({
  providedIn: 'root'
})
export class CartStateService {

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }


  // =========================
  // Internal helper
  // =========================
  private setCartCount(count: number) {
    this.cartCountSubject.next(count);
  }

  private isLoggedIn(): boolean {
    return !!this.cookieService.get("skillUpToken");
  }

  // Call on app load
  initializeCart(userId?: string) {
    
    if (this.isLoggedIn()) {
      this.cartService.getCart(userId).subscribe((res) => {
        this.cartCountSubject.next(res.cartItemsLength);
      })
    } else {
      if (isPlatformBrowser(this.platformId)) {
        const cart = JSON.parse(localStorage.getItem('cartCourses') || '[]');
        this.cartCountSubject.next(cart.length);
      }
    }
  }

  // ADD TO CART METHOD
  addToCart(userId: string, courseId: string, course?:DraftCourse) {

    if (this.isLoggedIn()) {
      this.cartService.addToCart(userId, courseId).subscribe((res)=>{
        this.cartCountSubject.next(res.cartItemsLength);
      });

    } else {
      if (isPlatformBrowser(this.platformId)) {
        let cart: CartItem[] = JSON.parse(localStorage.getItem("cartCourses") || '[]');

        // check duplicate properly
        const exists = cart.some(item => item.courseId === courseId);

        if (!exists) {
          const newItem: CartItem = {
            _id: course._id,
            coursePoster: course.coursePoster,
            courseId: course._id,
            courseName: course.title,
            coursePrice: course.price,
            educatorName: course.educator?.edname,
            lectures: course.totalLectures,
            language: course.language,
            level: course.level
          };

          cart.push(newItem);
          localStorage.setItem("cartCourses", JSON.stringify(cart));
        }

        this.setCartCount(cart.length);
      }
    }
  }

  // REMOVE FROM CART
  removeFromCart(userId?: string, courseId?: string) {

    if (this.isLoggedIn()) {
      return this.cartService.removeFromCart(userId, courseId).pipe(
        tap((res) => {
          this.setCartCount(res.cartItemsLength);
        })
      );
    } else {
      if (isPlatformBrowser(this.platformId)) {
        let cart: CartItem[] = JSON.parse(localStorage.getItem("cartCourses") || '[]');
        cart = cart.filter(item => item.courseId !== courseId);
        localStorage.setItem("cartCourses", JSON.stringify(cart));
        this.setCartCount(cart.length);
      }
      return of({ success: true });
    }

  }



}