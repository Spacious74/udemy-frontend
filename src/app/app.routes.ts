import { Routes } from '@angular/router';
import { HomepageComponent } from './Components/homepage/homepage.component';
import { LoginComponent } from './Components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { CourseDetailComponent } from './Components/course-detail/course-detail.component';
import { CoursesDisplayComponent } from './Components/courses-display/courses-display.component';
import { CartComponent } from './Components/cart/cart.component';
import { PlaylistComponent } from './Components/playlist/playlist.component';
import { VideoPlayerComponent } from './Components/video-player/video-player.component';
import { UserProfileComponent } from './Components/user-profile/user-profile.component';
import { TeacherDashboardComponent } from './Components/Teacher/teacher-dashboard/teacher-dashboard.component';
import { TeacherSectionComponent } from './Components/Teacher/teacher-section/teacher-section.component';
import { TeacherCoursePageComponent } from './Components/Teacher/teacher-course-page/teacher-course-page.component';
import { CreateCourseComponent } from './Components/Teacher/create-course/create-course.component';
import { DraftedCourseComponent } from './Components/Teacher/drafted-course/drafted-course.component';
export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    title: 'Skill Up.',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login to Skill Up.',
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Create account',
  },
  {
    path: 'course/:courseId',
    component: CourseDetailComponent,
    title: 'Course Details',
  },
  {
    path : 'courses',
    component : CoursesDisplayComponent,
    title : "Courses for you"
  },
  {
    path: 'courses/:category',
    component: CoursesDisplayComponent,
    title: 'Courses for you',
  },
  {
    path: 'cart',
    component: CartComponent,
    title: 'Cart',
  },
  {
    path : 'playlist',
    component : PlaylistComponent,
    title : "My Learning"
  },
  {
    path : 'player',
    component : VideoPlayerComponent,
    title : 'Continue learning...'
  },
  {
    path : 'user-profile',
    component : UserProfileComponent,
    title : 'User Profile'
  },
  {
    path : 'educator',
    component : TeacherSectionComponent,
    title : 'Educator Profile',
    children : [
      { path : '', redirectTo : 'dashboard', pathMatch : 'full'},
      { path : 'dashboard', component : TeacherDashboardComponent},
      {path : 'my-courses', component : TeacherCoursePageComponent},
      {path : 'create-course', component : CreateCourseComponent},
      {path : 'drafted-courses', component : DraftedCourseComponent},
    ]
  },
];
