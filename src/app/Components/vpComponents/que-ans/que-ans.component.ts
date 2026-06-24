import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { ToastMessageService } from '../../../baseSettings/services/toastMessage.service';
import { QnaService } from '../../../Services/qna.service';

@Component({
  selector: 'app-que-ans',
  standalone: true,
  imports: [FormsModule, ButtonModule, CommonModule, InputTextModule, PaginatorModule],
  templateUrl: './que-ans.component.html',
  styleUrl: './que-ans.component.css',
})
export class QueAnsComponent implements OnChanges, OnInit {
  @Input() courseId!: string;
  @Input() lectureId!: string;

  public questions: any[] = [];
  public selectedQuestion: any = null;
  public answers: any[] = [];
  
  public newQuestionTitle: string = '';
  public newQuestionDesc: string = '';
  public newAnswerText: string = '';

  public currentPage: number = 1;
  public totalQuestions: number = 0;
  public itemsPerPage: number = 5;

  constructor(
    private qnaService: QnaService,
    private toastMsgService: ToastMessageService
  ) {}

  ngOnInit() {
    if (this.lectureId) {
      this.fetchQuestions();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['lectureId'] && !changes['lectureId'].firstChange) {
      this.selectedQuestion = null;
      this.currentPage = 1;
      this.fetchQuestions();
    }
  }

  fetchQuestions() {
    this.qnaService.getQuestionsForLecture(this.lectureId, this.currentPage, this.itemsPerPage).subscribe({
      next: (res) => {
        this.questions = res.data;
        if (res.pagination) {
          this.totalQuestions = res.pagination.totalQuestions;
        }
      },
      error: (err) => {
        this.toastMsgService.showError('Error', err.error?.message || 'Failed to fetch questions');
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.itemsPerPage = event.rows;
    this.fetchQuestions();
  }

  askQuestion() {
    if (!this.newQuestionTitle.trim() || !this.newQuestionDesc.trim()) {
      this.toastMsgService.showError('Error', 'Question title and description are required');
      return;
    }
    this.qnaService.askQuestion(this.courseId, this.lectureId, this.newQuestionTitle, this.newQuestionDesc).subscribe({
      next: (res) => {
        this.toastMsgService.showSuccess('Success', 'Question posted successfully');
        this.newQuestionTitle = '';
        this.newQuestionDesc = '';
        this.fetchQuestions();
      },
      error: (err) => {
        this.toastMsgService.showError('Error', err.error?.message || 'Failed to post question');
      }
    });
  }

  openDiscussion(questionId: string) {
    this.qnaService.getQuestionDetails(questionId).subscribe({
      next: (res) => {
        this.selectedQuestion = res.data.question;
        this.answers = res.data.answers;
      },
      error: (err) => {
        this.toastMsgService.showError('Error', err.error?.message || 'Failed to load discussion');
      }
    });
  }

  closeDiscussion() {
    this.selectedQuestion = null;
    this.answers = [];
    this.fetchQuestions(); // Refresh to get updated answer counts
  }

  postAnswer() {
    if (!this.newAnswerText.trim()) {
      this.toastMsgService.showError('Error', 'Answer cannot be empty');
      return;
    }
    this.qnaService.addAnswer(this.selectedQuestion._id, this.newAnswerText).subscribe({
      next: (res) => {
        this.toastMsgService.showSuccess('Success', 'Answer posted successfully');
        this.newAnswerText = '';
        this.openDiscussion(this.selectedQuestion._id); // Refresh answers
      },
      error: (err) => {
        this.toastMsgService.showError('Error', err.error?.message || 'Failed to post answer');
      }
    });
  }
}
