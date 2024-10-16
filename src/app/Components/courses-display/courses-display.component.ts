import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';
import { data } from '../../data/course';
import { DataViewModule } from 'primeng/dataview';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../Services/course.service';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-courses-display',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    SelectButtonModule,
    RadioButtonModule,
    DataViewModule,
    PaginatorModule,
    ButtonModule
  ],
  templateUrl: './courses-display.component.html',
  styleUrl: './courses-display.component.css',
})
export class CoursesDisplayComponent implements OnInit, OnDestroy {
  public courses: any[];
  price!: string;
  lang!: string;
  level!: string;
  sort: string = '';
  public category : string = "";
  public searchText : string = "";
  public error : string = "";

  first: number = 0;
  page: number = 0;
  rows: number = 10;
  totalRecords: number;
  priceOption: any[] = [
    { name: 'Paid', value: 'paid' },
    { name: 'Free', value: 'free' },
  ];
  language: any[] = [
    { name: 'Hindi', value: 'Hindi' },
    { name: 'English', value: 'English' },
  ];

  constructor(
    private courseService: CourseService,
    private router : Router,
    private activatedRoute : ActivatedRoute
  ) {}
  public paramsObs : any;
  ngOnInit() {
    // this.category = this.activatedRoute.snapshot.params['category'];
    this.paramsObs = this.activatedRoute.params.subscribe((data)=>{
      this.category = data['category']
      if(this.category){
        this.fetchData();
      }else{
        this.fetchData();
      }
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.searchText = params['q'];
      if (this.searchText) {
        if(this.searchText){
          this.fetchData();
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.paramsObs.unsubscribe();
  }
  fetchData() {
    this.courseService.fetchCourses(this.page, this.sort, this.lang, this.category, this.searchText).subscribe((res) => {
      this.courses = res.filteredResults;
      this.totalRecords = res.totalCourses;
      this.error= "";
    }, (err)=>{
      if(err){
        this.error = err.message;
      }
    });
  }
  backToResults(){
    this.lang = ""; this.category=""; this.searchText="";
    this.fetchData();
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first;
    this.page = event.page;
    this.rows = event.rows;
    this.fetchData();
  }

  clearFilter(type: string) {
    switch (type) {
      case 'sort':
        this.sort = '';
        this.fetchData();
        return;
      case 'price':
        this.price = '';
        this.fetchData();
        return;
      case 'lang':
        this.lang = '';
        this.fetchData();
        return;
      case 'level':
        this.level = '';
        this.fetchData();
        return;
      default:
        this.price = '';
        this.level = '';
        this.lang = '';
        this.sort = '';
        this.fetchData();
        return;
    }
  }

  navigateToCourseDetails(courseId : any){
    let url="/course/"+courseId;
    this.router.navigate([url]);
  }
}
