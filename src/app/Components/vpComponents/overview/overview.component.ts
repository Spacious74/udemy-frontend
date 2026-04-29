import { Component, Input } from '@angular/core';
import { DraftCourse } from '../../../models/Course/DraftCourse';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {
  @Input() course : DraftCourse;
}
