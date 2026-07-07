import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { articles } from '../../data/article';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { AppObject } from '../../baseSettings/AppObject';
import { AuthService } from '../../Services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { courseData } from '../../data/course';
import { UserService } from '../../state/user.service';
import { UserList } from '../../models/UserList';
import { Store } from '@ngrx/store';
import { DraftedCourseService } from '../../Services/draftedCourse.service';
import { map } from 'rxjs';
import { BlogService } from '../../Services/blog.service';
import { Blog } from '../../models/Blog';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CardModule, FormsModule, ButtonModule, CommonModule, CarouselModule, BadgeModule,
    TooltipModule, RouterLink, FooterComponent, ToastModule, DialogModule
  ],
  providers: [ToastMessageService],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent implements OnInit {

  public data: any[] = [];
  public categories: any[] = [];
  public articles: any[] = [];
  public showPopUp: boolean = false;
  public userDetails: UserList;
  public userId: string;
  public userRole: string = 'student';
  public dbArticles: Blog[] = [];


  constructor(
    private authService: AuthService,
    private routerService: Router,
    private toastMsgService: ToastMessageService,
    private draftedCourseService: DraftedCourseService,
    private cookieService: CookieService,
    private store: Store<{ userInfo: UserList }>,
    private blogService: BlogService
  ) { }

  ngOnInit(): void {

    this.store.select('userInfo').subscribe((res) => {
      this.userDetails = res;
      this.userRole = res?.role;
    });

    this.fetchData();
    this.fetchBlogs();

    this.categories = [
      {
        name: 'Web Development',
        url: '/assets/images/development.png',
        query: 'Development'
      },
      {
        name: 'Business',
        url: '/assets/images/business.png',
        query: 'Business'
      },
      {
        name: 'IT & Software',
        url: '/assets/images/itsoftware.png',
        query: 'IT & Software'
      },
      {
        name: 'Programming',
        url: '/assets/images/programming.png',
        query: 'Programming Languages'
      },
      {
        name: 'Design',
        url: '/assets/images/designing.png',
        query: 'Design'
      },
    ];

    this.articles = articles;
  }

  togglePopup() {
    this.showPopUp = !this.showPopUp;
  }

  navigateWithCategory(query: string) {
    this.routerService.navigate(['/courses/' + query]);
  }

  fetchData() {
    const query = {
      page: "",
      sortOrder: "",
      language: "",
      category: "",
      searchText: "",
      level: "",
      priceType: "",
    };
    this.draftedCourseService.getAllCourses(query).pipe(
      map((res) => {
        if (res?.data) return { ...res, data: res.data.slice(0, 4) };
        return res;
      })
    ).subscribe((res) => {
      if (res.success) {
        this.data = res.data;
      } else {
        this.toastMsgService.showError("Error", "Unable to fetch data from server!");
      }
    }, (err) => {
      if (err) {
        this.toastMsgService.showError("Error", err.message);
      }
    });
  }

  fetchBlogs() {
    this.blogService.getLatestBlogs().subscribe({
      next: (res) => {
        if (res.success) {
          this.dbArticles = res.blogs;
        }
      },
      error: (err) => console.error("Failed to load blogs on homepage", err)
    });
  }

  updateUserRole() {
    this.authService.updateUser({ userId: this.userDetails._id, role: "teacher" }).subscribe((res) => {
      if (res.success) {
        if (res.token) {
          this.cookieService.set('skillUpToken', res.token, { expires: 1, path: '/' });
        }
        this.toastMsgService.showSuccess("Success", "User role updated successfully");
        this.routerService.navigate(['/educator']);
        this.showPopUp = false;
      } else {
        this.toastMsgService.showError("Error", "Something went wrong.");
      }
    },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
      })
  }

  navigateToCourseDetails(courseId: any) {
    let url = "/course/" + courseId;
    this.routerService.navigate([url]);
  }

}
