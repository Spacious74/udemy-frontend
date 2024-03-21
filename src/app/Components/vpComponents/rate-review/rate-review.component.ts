import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-rate-review',
  standalone: true,
  imports: [CommonModule, ProgressBarModule, ButtonModule, FormsModule, InputTextModule],
  templateUrl: './rate-review.component.html',
  styleUrl: './rate-review.component.css',
})
export class RateReviewComponent implements OnInit {
  public reviewText: string;
  public overallRating: number;
  public overEmpty: number;
  public reviews: any[] = [
    {
      username: 'Steve rogers',
      rating: 5,
      desc: 'This is a good course for all level candidates',
    },
    {
      username: 'Bucky Barnes',
      rating: 5,
      desc: 'This is a good course for all level candidates',
    },
    {
      username: 'Hail Hydra',
      rating: 5,
      desc: 'This is a good course for all level candidates',
    },
    {
      username: 'Stephen Strange',
      rating: 4,
      desc: 'This is a good course for all level candidates',
    },
    {
      username: 'Harry steven',
      rating: 4,
      desc: 'This is a good course for all level candidates',
    },
    {
      username: 'Anthony stark',
      rating: 3,
      desc: 'This is a good course for all level candidates',
    },
    {
      username: 'Tom cruise',
      rating: 2,
      desc: 'This is a good course for all level candidates',
    },
    {
      username: 'Bruce Banner',
      rating: 2,
      desc: 'This is a good course for all level candidates',
    },
    {
      username: 'Kevin powell',
      rating: 1,
      desc: 'This is a good course for all level candidates',
    },
  ];
  calculateOverallRating() {
    let rating = this.reviews.reduce((s, c) => s + c.rating, 0);
    let ans = rating / this.reviews.length;
    return Number(ans.toFixed(1));
  }
  renderStar(st: number) {
    let num = parseInt(st.toString());
    let arr = [];
    for (let i = 1; i <= num; i++) {
      arr.push(1);
    }
    if (!Number.isInteger(st)) {
      arr.push(0);
    }
    return arr;
  }
  renderEmpty(st: number) {
    let arr = [];
    let emp = 5 - Math.ceil(st);
    for (let i = 1; i <= emp; i++) {
      arr.push(1);
    }
    return arr;
  }
  getRatePercentage(rt: number) {
    let arr = this.reviews.filter((r) => r.rating == rt);
    let percent: number = Number((arr.length * 100) / this.reviews.length);
    return parseInt(percent.toString());
  }
  ngOnInit(): void {
    this.overallRating = this.calculateOverallRating();
  }
}
