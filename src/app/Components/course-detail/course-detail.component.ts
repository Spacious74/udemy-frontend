import { Component, HostListener, ElementRef } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { courseContent } from '../../data/courseContent';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [AccordionModule, CommonModule, ButtonModule, FooterComponent],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css',
})
export class CourseDetailComponent {
  courseContent: any[] = courseContent;
  public showCard: boolean = false;
  constructor(private elRef: ElementRef) {}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    if (
      window.scrollY > 200 &&
      window.scrollY < this.getScrollYHeight() - 900
    ) {
      this.showCard = true;
    } else {
      this.showCard = false;
    }
  }

  getScrollYHeight(): number {
    return this.elRef.nativeElement.ownerDocument.documentElement.scrollHeight;
  }
}
