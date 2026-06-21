import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiTutorService, ChatMessage } from '../../Services/ai-tutor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ai-tutor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-tutor.component.html',
  styleUrls: ['./ai-tutor.component.css']
})
export class AiTutorComponent implements OnInit, OnDestroy, AfterViewChecked {
  isOpen = false;
  isCourseMode = false;
  courseId: string | null = null;
  
  messages: ChatMessage[] = [];
  userInput = '';
  isLoading = false;
  
  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;
  
  private modeSub!: Subscription;

  constructor(private aiService: AiTutorService) {}

  ngOnInit() {
    this.modeSub = this.aiService.isCourseMode.subscribe(mode => {
      this.isCourseMode = mode;
      this.courseId = this.aiService.courseId.value;
      
      if (this.isCourseMode && this.courseId) {
        this.loadCourseChat();
      } else {
        this.messages = []; // Clear for general mode
      }
    });
  }

  ngOnDestroy() {
    if (this.modeSub) this.modeSub.unsubscribe();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.scrollToBottom();
    }
  }

  loadCourseChat() {
    if (!this.courseId) return;
    this.isLoading = true;
    this.aiService.getCourseChat(this.courseId).subscribe({
      next: (res: any) => {
        if (res.success && res.messages) {
          this.messages = res.messages;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading chat:', err);
        this.isLoading = false;
      }
    });
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput.trim();
    this.messages.push({ role: 'user', content: userMessage });
    this.userInput = '';
    this.isLoading = true;

    this.aiService.sendMessage(userMessage).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.isLoading = false;
          this.simulateTyping(res.response);
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Chat error:', err);
        let errorMsg = "Something went wrong.";
        if (err.error && err.error.message) {
          errorMsg = err.error.message;
        }
        this.messages.push({ role: 'model', content: `Error: ${errorMsg}` });
        this.isLoading = false;
      }
    });
  }

  scrollToBottom(): void {
    try {
      if (this.chatScrollContainer) {
        this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  parseMarkdown(text: string): string {
    let html = text;
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre style="background: #1e293b; color: #fff; padding: 10px; border-radius: 8px; overflow-x: auto;"><code>$1</code></pre>');
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code style="background: #e2e8f0; padding: 2px 4px; border-radius: 4px; color: #db2777;">$1</code>');
    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3 style="margin: 8px 0; font-size: 1.1em;">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 style="margin: 10px 0; font-size: 1.2em;">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 style="margin: 12px 0; font-size: 1.3em;">$1</h1>');
    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Italics
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li style="margin-left: 20px;">$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li style="margin-left: 20px;">$1</li>');
    
    // Newlines (skip within pre/code blocks by doing it selectively if needed, 
    // but for simple parser, just replacing all \n not inside pre is complex. 
    // We will just do a simple replace that might affect pre, but it's okay for now)
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  simulateTyping(fullText: string) {
    const newMessage: ChatMessage = { role: 'model', content: '' };
    this.messages.push(newMessage);
    
    const formattedText = this.parseMarkdown(fullText);
    
    // Split text by HTML tags to avoid breaking tags during typing
    const tokens = formattedText.split(/(<[^>]+>)/g);
    let tokenIndex = 0;
    let charIndex = 0;

    const typeNext = () => {
      if (tokenIndex >= tokens.length) return;
      
      const currentToken = tokens[tokenIndex];
      
      if (currentToken.startsWith('<') && currentToken.endsWith('>')) {
        // It's an HTML tag, append it entirely
        newMessage.content += currentToken;
        tokenIndex++;
        typeNext(); // immediately process next
      } else {
        // It's text, type char by char
        if (charIndex < currentToken.length) {
          newMessage.content += currentToken.charAt(charIndex);
          charIndex++;
          this.scrollToBottom();
          setTimeout(typeNext, 20);
        } else {
          tokenIndex++;
          charIndex = 0;
          typeNext();
        }
      }
    };
    
    typeNext();
  }
}
