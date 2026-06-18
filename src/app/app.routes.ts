import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

import { HomepageComponent } from './Components/homepage/homepage.component';
import { LoginComponent } from './Components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { CourseDetailComponent } from './Components/course-detail/course-detail.component';
import { CoursesDisplayComponent } from './Components/courses-display/courses-display.component';
import { CartComponent } from './Components/cart/cart.component';
import { PlaylistComponent } from './Components/playlist/playlist.component';
import { VideoPlayerComponent } from './Components/video-player/video-player.component';
import { UserProfileComponent } from './Components/user-profile/user-profile.component';
import { VerifyEmailComponent } from './Components/verify-email/verify-email.component';

import { TeacherDashboardComponent } from './Components/Teacher/teacher-dashboard/teacher-dashboard.component';
import { TeacherSectionComponent } from './Components/Teacher/teacher-section/teacher-section.component';
import { TeacherCoursePageComponent } from './Components/Teacher/teacher-course-page/teacher-course-page.component';
import { CreateCourseComponent } from './Components/Teacher/create-course/create-course.component';
import { CourseAnalyticsComponent } from './Components/Teacher/course-analytics/course-analytics.component';
import { EarningsReportsComponent } from './Components/Teacher/earnings-reports/earnings-reports.component';

import { OrderSummaryComponent } from './Components/order-summary/order-summary.component';
import { authGuard } from './guards/auth.guard';
import { educatorGuard } from './guards/educator.guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomepageComponent,
        title: 'Skill Up.'
      },
      {
        path: 'course/:courseId',
        component: CourseDetailComponent,
        title: 'Course Details'
      },
      {
        path: 'courses',
        component: CoursesDisplayComponent,
        title: 'Courses for you'
      },
      {
        path: 'courses/:category',
        component: CoursesDisplayComponent,
        title: 'Courses for you'
      },
      {
        path: 'cart',
        component: CartComponent,
        title: 'Cart'
      },
      {
        path: 'playlist',
        component: PlaylistComponent,
        canActivate: [authGuard],
        title: 'My Learning'
      },
      {
        path: 'player/:courseId',
        component: VideoPlayerComponent,
        canActivate: [authGuard],
        title: 'Continue learning...'
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
        canActivate: [authGuard],
        title: 'User Profile'
      },
    ]
  },
  {
    path: 'educator',
    component: TeacherSectionComponent,
    canActivate: [educatorGuard],
    title: 'Educator Profile',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: TeacherDashboardComponent },
      { path: 'courses', component: TeacherCoursePageComponent },
      { path: 'analytics', component: CourseAnalyticsComponent },
      { path: 'earnings', component: EarningsReportsComponent },
      { path: 'create-course/:courseId', component: CreateCourseComponent }
    ]
  },

  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard],
    title: 'Login to Skill Up.'
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [noAuthGuard],
    title: 'Create account'
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent,
    title: 'Verify Email'
  },
  {

    path: 'order-summary',
    component: OrderSummaryComponent,
    canActivate: [authGuard],
    title: 'Order Summary'
  }
];
