import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { educatorGuard } from './guards/educator.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./Components/homepage/homepage.component').then(m => m.HomepageComponent),
        title: 'Skill Up.'
      },
      {
        path: 'course/:courseId',
        loadComponent: () => import('./Components/course-detail/course-detail.component').then(m => m.CourseDetailComponent),
        title: 'Course Details'
      },
      {
        path: 'courses',
        loadComponent: () => import('./Components/courses-display/courses-display.component').then(m => m.CoursesDisplayComponent),
        title: 'Courses for you'
      },
      {
        path: 'courses/:category',
        loadComponent: () => import('./Components/courses-display/courses-display.component').then(m => m.CoursesDisplayComponent),
        title: 'Courses for you'
      },
      {
        path: 'cart',
        loadComponent: () => import('./Components/cart/cart.component').then(m => m.CartComponent),
        title: 'Cart'
      },
      {
        path: 'playlist',
        loadComponent: () => import('./Components/playlist/playlist.component').then(m => m.PlaylistComponent),
        canActivate: [authGuard],
        title: 'My Learning'
      },
      {
        path: 'player/:courseId',
        loadComponent: () => import('./Components/video-player/video-player.component').then(m => m.VideoPlayerComponent),
        canActivate: [authGuard],
        title: 'Continue learning...'
      },
      {
        path: 'user-profile',
        loadComponent: () => import('./Components/user-profile/user-profile.component').then(m => m.UserProfileComponent),
        canActivate: [authGuard],
        title: 'User Profile'
      },
    ]
  },
  {
    path: 'educator',
    loadComponent: () => import('./Components/Teacher/teacher-section/teacher-section.component').then(m => m.TeacherSectionComponent),
    canActivate: [educatorGuard],
    title: 'Educator Profile',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./Components/Teacher/teacher-dashboard/teacher-dashboard.component').then(m => m.TeacherDashboardComponent)
      },
      {
        path: 'courses',
        loadComponent: () => import('./Components/Teacher/teacher-course-page/teacher-course-page.component').then(m => m.TeacherCoursePageComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./Components/Teacher/course-analytics/course-analytics.component').then(m => m.CourseAnalyticsComponent)
      },
      {
        path: 'earnings',
        loadComponent: () => import('./Components/Teacher/earnings-reports/earnings-reports.component').then(m => m.EarningsReportsComponent)
      },
      {
        path: 'qna',
        loadComponent: () => import('./Components/Teacher/teacher-qna/teacher-qna.component').then(m => m.TeacherQnaComponent)
      },
      {
        path: 'create-course/:courseId',
        loadComponent: () => import('./Components/Teacher/create-course/create-course.component').then(m => m.CreateCourseComponent)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./Components/login/login.component').then(m => m.LoginComponent),
    canActivate: [noAuthGuard],
    title: 'Login to Skill Up.'
  },
  {
    path: 'signup',
    loadComponent: () => import('./Components/signup/signup.component').then(m => m.SignupComponent),
    canActivate: [noAuthGuard],
    title: 'Create account'
  },
  {
    path: 'verify-email',
    loadComponent: () => import('./Components/verify-email/verify-email.component').then(m => m.VerifyEmailComponent),
    title: 'Verify Email'
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./Components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    canActivate: [noAuthGuard],
    title: 'Forgot Password'
  },
  {
    path: 'reset-password/:token',
    loadComponent: () => import('./Components/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    canActivate: [noAuthGuard],
    title: 'Reset Password'
  },
  {
    path: 'order-summary',
    loadComponent: () => import('./Components/order-summary/order-summary.component').then(m => m.OrderSummaryComponent),
    canActivate: [authGuard],
    title: 'Order Summary'
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./Components/Admin/admin-login/admin-login.component').then(m => m.AdminLoginComponent),
    canActivate: [noAuthGuard],
    title: 'Admin Login'
  },
  {
    path: 'admin',
    loadComponent: () => import('./Components/Admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    title: 'Admin Panel',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./Components/Admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'Admin Dashboard'
      },
      {
        path: 'users',
        loadComponent: () => import('./Components/Admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent),
        title: 'Manage Users'
      },
      {
        path: 'courses',
        loadComponent: () => import('./Components/Admin/admin-courses/admin-courses.component').then(m => m.AdminCoursesComponent),
        title: 'Manage Courses'
      },
      {
        path: 'categories',
        loadComponent: () => import('./Components/Admin/admin-categories/admin-categories.component').then(m => m.AdminCategoriesComponent),
        title: 'Manage Categories'
      },
      {
        path: 'transactions',
        loadComponent: () => import('./Components/Admin/admin-transactions/admin-transactions.component').then(m => m.AdminTransactionsComponent),
        title: 'Transactions'
      },
      {
        path: 'settings',
        loadComponent: () => import('./Components/Admin/admin-settings/admin-settings.component').then(m => m.AdminSettingsComponent),
        title: 'Admin Settings'
      }
    ]
  }
];
