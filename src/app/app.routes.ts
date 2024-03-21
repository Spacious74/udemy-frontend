import { Routes } from '@angular/router';
import { HomepageComponent } from './Components/homepage/homepage.component';
import { LoginComponent } from './Components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { CourseDetailComponent } from './Components/course-detail/course-detail.component';
import { CoursesDisplayComponent } from './Components/courses-display/courses-display.component';
import { CartComponent } from './Components/cart/cart.component';
import { PlaylistComponent } from './Components/playlist/playlist.component';
import { VideoPlayerComponent } from './Components/video-player/video-player.component';

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
    path: 'course',
    component: CourseDetailComponent,
    title: 'Course Details',
  },
  {
    path: 'courses',
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
  }
];
