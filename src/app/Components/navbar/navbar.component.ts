import { Component, HostListener, Input, OnInit } from '@angular/core';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CookieService } from 'ngx-cookie-service';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { UserList } from '../../models/UserList';
import { DialogModule } from 'primeng/dialog';
import { Store } from '@ngrx/store';
import { BadgeModule } from 'primeng/badge';
import { Cart } from '../../models/Cart';
import { userInfoActions } from '../../store/actions/userInfo.action';
import { SidebarModule } from 'primeng/sidebar';
import { CartStateService } from '../../Services/cartState.service';
import { Observable } from 'rxjs';
import { CategoryService } from '../../Services/category.service';
import { DraftedCourseService } from '../../Services/draftedCourse.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    FormsModule, TieredMenuModule, InputTextModule, ButtonModule, RouterLink, RouterLinkActive, CommonModule,
    OverlayPanelModule, TooltipModule, ToastModule, DialogModule, BadgeModule, SidebarModule 
  ],
  providers: [MessageService, ToastMessageService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {

  public menuItems: MenuItem[] | undefined;
  public searchText: string = '';
  public userLoggedIn: boolean = false;
  public userDetails : UserList;
  public showPopUp : boolean = false;
  public userId : string;
  public userRole : string;
  public cartLength : number=0;
  public sidebarVisible : boolean = false;
  public totalItems : number  = 0;
  public cartCount$: Observable<number>;
  
  public searchSuggestions: any[] = [];
  public showSuggestions: boolean = false;
  private searchTimeout: any;

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private toastMsgService: ToastMessageService,
    private cartStateService : CartStateService,
    private draftedCourseService: DraftedCourseService,
    private router: Router,
    private store : Store<{cart : Cart[], userInfo : UserList}>,
    private categoryService: CategoryService
  ) {
    this.cartCount$ = this.cartStateService.cartCount$;
  }

  ngOnInit(): void {
    this.initializeUser();
    this.fetchCategories();
  }
  
  fetchCategories() {
    this.categoryService.getAllCategories().subscribe(res => {
      if (res.success) {
        this.menuItems = this.buildMenuTree(res.data);
      }
    }, err => {
      console.error("Failed to fetch categories");
    });
  }

  buildMenuTree(categories: any[]): MenuItem[] {
    const parentCats = categories.filter(c => !c.parentId);
    return parentCats.map(parent => {
      const subCats = categories.filter(c => c.parentId === parent._id);
      return {
        label: parent.name,
        items: subCats.length ? subCats.map(sub => ({
          label: sub.name,
          command: () => this.display(sub.name)
        })) : undefined,
        command: subCats.length ? undefined : () => this.display(parent.name)
      };
    });
  }
  
  initializeUser(){
    this.store.select("userInfo").subscribe((res)=>{
      if(res){
        this.userDetails = res;
        this.userId = res?._id;
        this.userRole = res?.role;
        this.userLoggedIn = true;
      }
    },
    (error) => {
      this.toastMsgService.showError("Error", error.error.message);
      this.userLoggedIn = false;
    })
  }

  display(categoryName: string) {
    if (!categoryName) {
      this.router.navigate(['/courses'])
    } else {
      this.router.navigate(['/courses'], { queryParams: { category: categoryName } });
    }
  }

  onSearchInput() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    if (!this.searchText || this.searchText.trim() === '') {
      this.searchSuggestions = [];
      this.showSuggestions = false;
      return;
    }

    this.searchTimeout = setTimeout(() => {
      this.draftedCourseService.getSearchSuggestions(this.searchText.trim()).subscribe(res => {
        if (res.success) {
          this.searchSuggestions = res.data;
          this.showSuggestions = true;
        }
      });
    }, 300);
  }

  selectSuggestion(course: any) {
    this.showSuggestions = false;
    this.router.navigate(['/course', course._id]);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.search-container')) {
      this.showSuggestions = false;
    }
  }

  searchIt() {
    this.showSuggestions = false;
    if (this.searchText) {
      const encodedQuery = encodeURIComponent(this.searchText);
      this.router.navigate(['/courses'], { queryParams: { q: encodedQuery } });
    }
  }

  navigateToCart() {
    this.router.navigate(['/cart']); return;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.cookieService.delete('skillUpToken');
    this.cookieService.delete('skillUpToken', '/');
    this.router.navigate(['/']);
    this.userLoggedIn = false;
    this.store.dispatch(userInfoActions.loadUserSuccess({payload : null}));
    window.location.reload();
  }

  togglePopup(){
    this.showPopUp = !this.showPopUp;
  }
  
  updateUserRole(){
    this.authService.updateUser({userId: this.userId, role : "teacher"}).subscribe((res)=>{
      if(res.success){
        this.toastMsgService.showSuccess("Success", "User role updated successfully");
        this.router.navigate(['/educator']);
        this.showPopUp = false;
      }else{
        this.toastMsgService.showError("Error", "Something went wrong.");
      }
    }, 
    (error)=>{
      this.toastMsgService.showError("Error", error.error.message);
    })
  }
}
