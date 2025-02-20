import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { CourseDetailDto } from '../../../models/Course/CourseDetailDto';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { UserService } from '../../../state/user.service';
import { UserList } from '../../../models/UserList';
import { ToastMessageService } from '../../../baseSettings/services/toastMessage.service';
import { DraftedCourseService } from '../../../Services/draftedCourse.service';
import { DraftCourse } from '../../../models/Course/DraftCourse';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [
    StepperModule, ButtonModule, FormsModule, InputTextModule, InputTextareaModule, 
    DropdownModule, InputNumberModule
  ],
  providers : [ToastMessageService],
  templateUrl: './create-course.component.html',
  styles: ``
})
export class CreateCourseComponent implements OnInit{

  public formData: CourseDetailDto = new CourseDetailDto();
  public userDetails : UserList;
  public draftedCourseId : string;
  public draftedCourseDetails : DraftCourse;

  public errorFlag : boolean = false;
  public loading: boolean = false;

  public selectedCategory: any;
  public categories: any[] = [
    { name: 'Development' },
    { name: 'Business' },
    { name: 'IT & Software' },
    { name: 'Design' },
    { name: 'Programming Languages' },
  ];;
  public selectedLanguage: any;
  public languages = [
    { name: 'English', },
    { name: 'Hindi', },
    { name: 'Spanish', },
    { name: 'German', },
    { name: 'Portuguese', },
    { name: 'Japanese', },
  ]
  public selectedLevel: any;
  public levels = [
    { name: 'Beginner' },
    { name: 'Intermediate' },
    { name: 'Advanced' },
  ]

  constructor(private draftedCourseService: DraftedCourseService, private storage : UserService,
    private toastmsgService : ToastMessageService
  ) { }

  ngOnInit(): void {
    this.storage.user$.subscribe((res)=>{
      this.userDetails = res;
    },
    (error) => {
      console.log(error);
    });
  }

  saveCourseDetails(nextCallback: any) {
    this.loading = true;
    this.formData.category = this.selectedCategory.name;
    this.formData.level = this.selectedLevel.name;
    this.formData.language = this.selectedLanguage.name;
    this.formData.educator = {
      edId : this.userDetails._id,
      edname : this.userDetails.username
    }
    this.draftedCourseService.createCourse(this.formData).subscribe((res) => {
      if (res.success) {
        nextCallback.emit();
        this.draftedCourseId = res.data._id;
        this.draftedCourseDetails = res.data;
        this.loading = false;
        this.errorFlag = false;
        this.toastmsgService.showSuccess("Success", "Course details uploaded successfully!");
      }
      else {
        this.errorFlag = true ;
        this.toastmsgService.showError("Error", "Some internal error occured!");
        this.loading = false;
      }
    }, (err) => {
      this.errorFlag = true;
      this.toastmsgService.showError("Error", err.error.message);
      this.loading = false;
    })
  }


  

}
