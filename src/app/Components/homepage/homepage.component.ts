import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { data } from '../../data/course';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { BadgeModule } from 'primeng/badge';
import { articles } from '../../data/article';
import { TooltipModule } from 'primeng/tooltip';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CardModule,
    FormsModule,
    ButtonModule,
    CommonModule,
    CurrencyPipe,
    CarouselModule,
    BadgeModule,
    TooltipModule,
    RouterLink,
    FooterComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent implements OnInit {
  data: any[] = [];
  categories: any[] = [];
  articles : any[] = [];
  ngOnInit(): void {
    this.data = data;
    this.categories = [
      {
        name: 'Development',
        url: '../../../assets/images/development.png',
      },
      {
        name: 'Business',
        url: '../../../assets/images/business.png',
      },
      {
        name: 'IT & Software',
        url: '../../../assets/images/itsoftware.png',
      },
      {
        name: 'Programming',
        url: '../../../assets/images/programming.png',
      },
      {
        name: 'Design',
        url: '../../../assets/images/design-thinking.png',
      },
    ];
    this.articles = articles
  }
}
