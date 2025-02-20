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
@Component({
  selector: 'app-teacher-course-page',
  standalone: true,
  imports: [ RouterLink, CommonModule, FormsModule, SelectButtonModule, RadioButtonModule, DataViewModule, 
    PaginatorModule, ButtonModule ],
  templateUrl: './teacher-course-page.component.html',
  styles: ``
})
export class TeacherCoursePageComponent {

  public courses : any[];
  public totalRecords :number;
  public error : string;

  constructor(
    private courseService: CourseService,
    private router : Router,
    private activatedRoute : ActivatedRoute
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    // this.courses = data;
    // this.totalRecords = data.length;
    this.courseService.fetchCourses().subscribe((res) => {
      this.courses = res.filteredResults;
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
  
  
}
