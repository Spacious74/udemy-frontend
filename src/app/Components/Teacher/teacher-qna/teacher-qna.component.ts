import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ToastMessageService } from '../../../baseSettings/services/toastMessage.service';
import { QnaService } from '../../../Services/qna.service';

@Component({
  selector: 'app-teacher-qna',
  standalone: true,
  imports: [CommonModule, ButtonModule, FormsModule, DialogModule],
  templateUrl: './teacher-qna.component.html',
  styleUrl: './teacher-qna.component.css'
})
export class TeacherQnaComponent implements OnInit {
  public courses: any[] = [];
  public allQuestions: any[] = [];
  public selectedCourse: any = null;
  public courseQuestions: any[] = [];
  
  public analytics = {
    totalQuestions: 0,
    repliedByInstructor: 0,
    pendingQuestions: 0
  };

  public displayReplyModal: boolean = false;
  public displayAnswersModal: boolean = false;
  
  public currentQuestionForReply: any = null;
  public replyText: string = '';
  
  public currentQuestionAnswers: any[] = [];

  constructor(
    private qnaService: QnaService,
    private toastMsgService: ToastMessageService
  ) {}

  ngOnInit() {
    this.fetchAnalytics();
    this.fetchCoursesWithQuestions();
  }

  fetchAnalytics() {
    this.qnaService.getTeacherQnaAnalytics().subscribe({
      next: (res) => {
        this.analytics = res.data;
      },
      error: (err) => {
        this.toastMsgService.showError('Error', err.error?.message || 'Failed to fetch analytics');
      }
    });
  }

  fetchCoursesWithQuestions() {
    this.qnaService.getTeacherCoursesWithQuestions().subscribe({
      next: (res) => {
        this.courses = res.data.courses;
        this.allQuestions = res.data.questions;
      },
      error: (err) => {
        this.toastMsgService.showError('Error', err.error?.message || 'Failed to fetch courses data');
      }
    });
  }

  showCourseQuestions(course: any) {
    this.selectedCourse = course;
    this.courseQuestions = this.allQuestions.filter(q => q.courseId && q.courseId._id === course._id);
  }

  goBackToCourses() {
    this.selectedCourse = null;
    this.courseQuestions = [];
  }

  openReplyModal(question: any) {
    this.currentQuestionForReply = question;
    this.replyText = '';
    this.displayReplyModal = true;
  }

  closeReplyModal() {
    this.displayReplyModal = false;
    this.currentQuestionForReply = null;
    this.replyText = '';
  }

  postReply() {
    if (!this.replyText.trim()) {
      this.toastMsgService.showError('Error', 'Reply cannot be empty');
      return;
    }
    
    this.qnaService.addAnswer(this.currentQuestionForReply._id, this.replyText).subscribe({
      next: (res) => {
        this.toastMsgService.showSuccess('Success', 'Reply posted successfully');
        this.closeReplyModal();
        this.fetchAnalytics(); 
        this.fetchCoursesWithQuestions();
        this.currentQuestionForReply.answerCount = (this.currentQuestionForReply.answerCount || 0) + 1;
      },
      error: (err) => {
        this.toastMsgService.showError('Error', err.error?.message || 'Failed to post reply');
      }
    });
  }

  showAllAnswers(question: any) {
    this.qnaService.getQuestionDetails(question._id).subscribe({
      next: (res) => {
        this.currentQuestionAnswers = res.data.answers;
        this.displayAnswersModal = true;
      },
      error: (err) => {
        this.toastMsgService.showError('Error', err.error?.message || 'Failed to fetch answers');
      }
    });
  }

  closeAnswersModal() {
    this.displayAnswersModal = false;
    this.currentQuestionAnswers = [];
  }
}
