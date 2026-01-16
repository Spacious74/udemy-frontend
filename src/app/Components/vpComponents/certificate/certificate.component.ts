import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [ButtonModule, CommonModule],
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.css'
})
export class CertificateComponent {
  @Input() loading : boolean = false;
  @Input() completionStatus : boolean = false;
  @Output() runParent = new EventEmitter<string>();

  notifyParent() {
    this.runParent.emit('Open certificate');
  }

}
