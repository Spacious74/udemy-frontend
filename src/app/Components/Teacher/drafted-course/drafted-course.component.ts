import { Component } from '@angular/core';
import { ToastMessageService } from '../../../baseSettings/services/toastMessage.service';
import { CourseService } from '../../../Services/course.service';
import { UserService } from '../../../state/user.service';
import { UserList } from '../../../models/UserList';

@Component({
  selector: 'app-drafted-course',
  standalone: true,
  imports: [],
  templateUrl: './drafted-course.component.html',
  styles: ``
})
export class DraftedCourseComponent {

  public userDetails : UserList;
  public draftedCourseList : any[];

  constructor(
    private courseService: CourseService, 
    private storage : UserService,
    private toastmsgService : ToastMessageService
  ) {}

  ngOnInit(): void {
    this.storage.user$.subscribe((res)=>{
      this.userDetails = res;
      console.log('user', this.userDetails);
    },
    (error) => {
      console.log(error);
    });
  }

  fetchCourseList(){
    
  }

}
