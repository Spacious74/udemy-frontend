import { Component, HostListener, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { courseContent } from '../../data/courseContent';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { ButtonModule } from 'primeng/button';
import { CourseService } from '../../Services/course.service';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CartService } from '../../Services/cart.service';
import { AuthService } from '../../Services/auth.service';
import { courseData } from '../../data/course';
@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [AccordionModule, CommonModule, ButtonModule, FooterComponent, CurrencyPipe, DatePipe],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css',
})
export class CourseDetailComponent implements OnInit{
  public selectedCourse: any;
  public reviewsArr : any[];
  courseContent: any[] = courseContent;
  public showCard: boolean = false;

  constructor(
    private elRef: ElementRef,
    private courseService: CourseService,
    private activatedRoute: ActivatedRoute,
    private cartService : CartService,
    private authService : AuthService
  ) {}

  public courseId : any;
  ngOnInit() : void {
    this.courseId = this.activatedRoute.snapshot.params['courseId'];
    this.courseService.getCourseById(this.courseId).subscribe((res)=>{
      this.selectedCourse = res.course;
      // this.reviewsArr = res.reviews.reviewArr;
    });
    this.selectedCourse = courseData.find((course) => course._id == this.courseId);
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

  getScrollYHeight(): number {
    return this.elRef.nativeElement.ownerDocument.documentElement.scrollHeight;
  }
  addToCart(){
    // console.log(localStorage.getItem('userId'));
  }
}
