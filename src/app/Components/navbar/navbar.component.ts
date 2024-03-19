import { Component, OnInit } from '@angular/core';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, CascadeSelectModule, InputTextModule, ButtonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  public categories : any[] = [];
  public selectedCity: string = '';
  public searchText : string = '';
  ngOnInit(): void {
    this.categories = [
      {
        cname: 'Development',
        subCateogry: [
          {
            name: 'Web development',
          },
          {
            name: 'Android development',
          },
          {
            name: 'Game development',
          },
          {
            name: 'iOs development',
          },
        ],
      },
      {
        cname: 'Business',
        subCateogry: [
          {
            name: 'Sales',
          },
          {
            name: 'Operations',
          },
          {
            name: 'Project Management',
          },
        ],
      },
      {
        cname: 'Programming Language',
        subCateogry: [
          {
            name: 'Python',
          },
          {
            name: 'Java',
          },
          {
            name: 'Javascript',
          },
          {
            name: 'C++',
          },
        ],
      },
      {
        cname: 'IT & Software',
        subCateogry: [
          {
            name: 'Network & Security',
          },
          {
            name: 'Operating systems',
          },
          {
            name: 'Hardware',
          },
        ],
      },
      {
        cname: 'Design',
        subCateogry: [
          {
            name: 'Web design',
          },
          {
            name: 'Graphics design',
          },
          {
            name: '3d & Animations',
          },
          {
            name: 'Design tools',
          },
        ],
      },
    ];
  }
}
