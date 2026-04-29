import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {

  constructor(private messageService: MessageService) {}

  showToast(severity: string, summary: string, detail: string): void {
    console.log("toast showing...")
    this.messageService.add({severity, summary, detail});
  }

  showSuccess(summary: string, detail: string): void {
    this.showToast('success', summary, detail);
  }

  showError(summary: string, detail: string): void {
    this.showToast('error', summary, detail);
  }

  showInfo(summary: string, detail: string): void {
    this.showToast('info', summary, detail);
  }

  showWarn(summary: string, detail: string): void {
    this.showToast('warn', summary, detail);
  }
}