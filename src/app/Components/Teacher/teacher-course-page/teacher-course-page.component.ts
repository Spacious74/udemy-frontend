import { Component } from '@angular/core';
import { courseData } from '../../../data/course';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { CourseService } from '../../../Services/course.service';
import { DraftedCourseService } from '../../../Services/draftedCourse.service';
@Component({
  selector: 'app-teacher-course-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectButtonModule, RadioButtonModule, DataViewModule, 
    PaginatorModule, ButtonModule ],
  templateUrl: './teacher-course-page.component.html',
  styles: ``
})
export class TeacherCoursePageComponent {

  public courses : any[];
  public totalRecords :number = 0;
  public error : string;

  public page: number = 0;
  public rows: number = 10;

  constructor(
    private courseService: CourseService,
    private draftedCourseService : DraftedCourseService,
    private router : Router,
    private activatedRoute : ActivatedRoute
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    // this.courses = data;
    // this.totalRecords = data.length;
    this.draftedCourseService.getAllCourses(this.page).subscribe((res) => {
      this.courses = res.data;
      this.totalRecords = res.totalCourses;
      this.error= "";
    }, (err)=>{
      if(err){
        this.error = err.message;
      }
    });
  }

  navigateToCourseDetails(courseId : any){
    let url="/course/"+courseId;
    this.router.navigate([url]);
  }

  navigateToEditCourse(courseId: any) {
    let url = "/create-course/" + courseId;
    this.router.navigate([url]);
  }
  
}
