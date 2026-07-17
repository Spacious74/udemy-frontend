import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { CarouselModule } from 'primeng/carousel';
import { SkeletonModule } from 'primeng/skeleton';
import { DropdownModule } from 'primeng/dropdown';
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
import { CategoryService } from '../../Services/category.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CardModule, FormsModule, ButtonModule, CommonModule, CarouselModule, BadgeModule,
    TooltipModule, RouterLink, FooterComponent, ToastModule, DialogModule, SkeletonModule, DropdownModule
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
  public loadingCourses: boolean = true;
  public loadingBlogs: boolean = true;
  
  public selectedMobileCategory: any = null;
  public mobileSubCategories: any[] = [];


  constructor(
    private authService: AuthService,
    private routerService: Router,
    private toastMsgService: ToastMessageService,
    private draftedCourseService: DraftedCourseService,
    private cookieService: CookieService,
    private store: Store<{ userInfo: UserList }>,
    private blogService: BlogService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {

    this.store.select('userInfo').subscribe((res) => {
      this.userDetails = res;
      this.userRole = res?.role;
    });

    this.fetchData();
    this.fetchBlogs();

    this.fetchCategories();

    this.articles = articles;
  }

  fetchCategories() {
    this.categoryService.getAllCategories().subscribe(res => {
      if (res.success) {
        const allCats = res.data;
        const parentCats = allCats.filter((c: any) => !c.parentId);
        
        this.categories = parentCats.map((parent: any) => {
          const subCats = allCats.filter((c: any) => c.parentId === parent._id);
          let url = '/assets/images/development.png';
          if (parent.name.includes('Business')) url = '/assets/images/business.png';
          else if (parent.name.includes('IT')) url = '/assets/images/itsoftware.png';
          else if (parent.name.includes('Programming')) url = '/assets/images/programming.png';
          else if (parent.name.includes('Design')) url = '/assets/images/designing.png';
          else if (parent.name.includes('AI & Data Science')) url = '/assets/images/ai.png';
          else if (parent.name.includes('Marketing')) url = '/assets/images/marketing.png';

          return {
            _id: parent._id,
            name: parent.name,
            url: url,
            query: parent.name,
            subCategories: subCats
          };
        });

        if (this.categories.length > 0) {
          this.selectedMobileCategory = this.categories[0];
          this.mobileSubCategories = this.categories[0].subCategories || [];
        }
      }
    });
  }

  togglePopup() {
    if (!this.userDetails || !this.userDetails._id) {
      this.toastMsgService.showError("Login Required", "Please login to become an educator.");
      this.routerService.navigate(['/login']);
      return;
    }
    this.showPopUp = !this.showPopUp;
  }

  navigateWithCategory(category: any) {
    this.routerService.navigate(['/courses'], { queryParams: { category: category.name, parentCategoryId: category._id } });
  }

  onMobileCategoryChange(event: any) {
    this.selectedMobileCategory = event;
    this.mobileSubCategories = event.subCategories || [];
  }

  navigateWithSubCategory(subCategory: any) {
    // Navigating to CoursesDisplayComponent with query params
    this.routerService.navigate(['/courses'], { queryParams: { category: subCategory.name, subCategoryId: subCategory._id } });
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
      this.loadingCourses = false;
      if (res.success) {
        this.data = res.data;
      } else {
        this.toastMsgService.showError("Error", "Unable to fetch data from server!");
      }
    }, (err) => {
      this.loadingCourses = false;
      if (err) {
        this.toastMsgService.showError("Error", err.message);
      }
    });
  }

  fetchBlogs() {
    this.blogService.getLatestBlogs().subscribe({
      next: (res) => {
        this.loadingBlogs = false;
        if (res.success) {
          this.dbArticles = res.blogs;
        }
      },
      error: (err) => {
        this.loadingBlogs = false;
        console.error("Failed to load blogs on homepage", err)
      }
    });
  }

  updateUserRole() {
    if (!this.userDetails || !this.userDetails._id) {
      this.toastMsgService.showError("Login Required", "Please login to become an educator.");
      this.routerService.navigate(['/login']);
      this.showPopUp = false;
      return;
    }

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
