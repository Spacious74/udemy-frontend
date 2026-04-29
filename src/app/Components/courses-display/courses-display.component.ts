import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { ToastMessageService } from '../../baseSettings/services/toastMessage.service';
import { DraftedCourseService } from '../../Services/draftedCourse.service';

@Component({
  selector: 'app-courses-display',
  standalone: true,
  imports: [
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

  public courses: any[] = [];
  public price!: string;   // free | paid
  public lang!: string;
  public level!: string;
  public sort: string = '';
  public category: string = "";
  public searchText: string = "";
  public error: string = "";

  public first: number = 0;
  public page: number = 1; // backend expects 1-based
  public rows: number = 10;
  public totalRecords: number = 0;

  public sortOptions = [
    { label: 'Most Relevant', value: '' }, // FIXED
    { label: 'Price Low to High', value: 'lth' },
    { label: 'Price High to Low', value: 'htl' }
  ];

  public priceOptions = [
    { label: 'Paid', value: 'paid' },
    { label: 'Free', value: 'free' }
  ];

  public languageOptions = [
    { label: 'English', value: 'English' },
    { label: 'Hindi', value: 'Hindi' }
  ];

  public levelOptions = [
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' }
  ];

  private paramsObs: any;

  constructor(
    private draftedCourseService: DraftedCourseService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastMsgService: ToastMessageService
  ) {}

  ngOnInit() {
    this.paramsObs = this.activatedRoute.params.subscribe((data) => {
      this.category = data['category'] || "";
      this.fetchData();
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.searchText = params['q'] || "";
      this.fetchData();
    });
  }

  ngOnDestroy(): void {
    this.paramsObs.unsubscribe();
  }

  fetchData() {
    const query = {
      page: this.page,
      sortOrder: this.sort,
      language: this.lang,
      category: this.category,
      searchText: this.searchText,
      level: this.level,
      priceType: this.price
    };

    this.draftedCourseService.getAllCourses(query).subscribe({
      next: (res) => {
        if (res.success) {
          this.courses = res.data;
          this.totalRecords = res.totalCourses;
          this.error = "";
        } else {
          this.error = "Unable to fetch data from server!";
          this.toastMsgService.showError("Error", this.error);
        }
      },
      error: (err) => {
        this.totalRecords = 0;
        this.error = err.message;
        this.toastMsgService.showError("Error", err.message);
      }
    });

  }

  onPageChange(event: PaginatorState) {
    this.first = event.first || 0;
    this.page = (event.page ?? 0) + 1; // FIX: convert 0-based → 1-based
    this.rows = event.rows || 10;
    this.fetchData();
  }

  clearFilter(type: string) {
    switch (type) {
      case 'sort':
        this.sort = '';
        break;
      case 'price':
        this.price = '';
        break;
      case 'lang':
        this.lang = '';
        break;
      case 'level':
        this.level = '';
        break;
      default:
        this.price = '';
        this.level = '';
        this.lang = '';
        this.sort = '';
    }
    this.page = 1; // reset pagination
    this.fetchData();
  }

  navigateToCourseDetails(courseId: any) {
    this.router.navigate([`/course/${courseId}`]);
  }
}