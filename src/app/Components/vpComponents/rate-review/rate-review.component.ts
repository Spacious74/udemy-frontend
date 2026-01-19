import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { RateAndReviewService, Reviews } from '../../../Services/rateAndReview.service';
import { ToastMessageService } from '../../../baseSettings/services/toastMessage.service';
import { Store } from '@ngrx/store';
import { UserList } from '../../../models/UserList';
@Component({
  selector: 'app-rate-review',
  standalone: true,
  imports: [CommonModule, ProgressBarModule, ButtonModule, FormsModule, InputTextModule, RatingModule, InputTextareaModule],
  templateUrl: './rate-review.component.html',
  styleUrl: './rate-review.component.css',
})
export class RateReviewComponent {

  @Input() courseId: string = null;
  @Input() userId: string = null;
  @Input() username : string = null;
  public overallRating: number = 4.3;
  public overEmpty: number;
  public myReview : Reviews | null;
  public updateMode : boolean = false;
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

  public reviewsArr: Reviews[] = [];
  public reviewData: Reviews = new Reviews();

  constructor(
    private rateReviewService: RateAndReviewService,
    private toastMsgService: ToastMessageService,
    private store: Store<{ userInfo: UserList }>
  ) { }

  // ngOnInit(): void {
  //   this.getReviews();
  // }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['courseId']) {
      this.getReviews();
    }
  }

  getReviews() {
    this.rateReviewService.getReviews(this.userId, this.courseId).subscribe((res) => {
      this.reviewsArr = res.reviews;
      this.myReview = res.userReview;
      if(res.userReview != null) this.updateMode = true;
      this.overallRating = res.overallRating;
    },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
      })
  }

  submitReview(){
    this.reviewData.userId = this.userId;
    this.reviewData.username = this.username;
    // this.reviewData = new Reviews();
    // console.log(this.reviewData); 
    if(this.updateMode) this.updateReview()
    else this.addReview();
  }

  addReview() {
    this.rateReviewService.postReview(this.reviewData, this.courseId).subscribe((res) => {
      this.reviewsArr = res.reviews;
      this.overallRating = res.overallRating;
    },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
      })
  }

  updateReview() {
    this.rateReviewService.updateReview(this.courseId, this.userId, this.reviewData).subscribe((res) => {
      this.reviewsArr = res.reviews;
      this.overallRating = res.overallRating;
    },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
      })
  }

  deleteReview() {
    this.rateReviewService.deleteReview(this.courseId, this.userId).subscribe((res) => {
      this.reviewsArr = res.reviews;
      this.overallRating = res.overallRating;
    },
      (error) => {
        this.toastMsgService.showError("Error", error.error.message);
      })
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

}
