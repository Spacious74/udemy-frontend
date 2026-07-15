import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AiTutorService, ChatMessage } from '../../Services/ai-tutor.service';
import { AuthService } from '../../Services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-ai-tutor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ai-tutor.component.html',
  styleUrls: ['./ai-tutor.component.css']
})
export class AiTutorComponent implements OnInit, OnDestroy, AfterViewChecked {
  isOpen = false;
  isExpanded = false;
  isCourseMode = false;
  courseId: string | null = null;
  
  messages: ChatMessage[] = [];
  userInput = '';
  isLoading = false;
  isTyping = false;
  private typingTimeout: any;
  private apiSub: Subscription | null = null;

  isLoggedIn = false;
  userName: string | null = null;
  freeQueriesRemaining = 5;
  
  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;
  
  private modeSub!: Subscription;
  private routerSub!: Subscription;
  public showTutor = true;

  constructor(
    private aiService: AiTutorService,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {
    // Initial check
    this.checkRoute(this.router.url);

    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkRoute(event.urlAfterRedirects);
      });
  }

  checkRoute(url: string) {
    if (url.startsWith('/educator') || url.startsWith('/admin')) {
      this.showTutor = false;
      this.isOpen = false;
    } else {
      this.showTutor = true;
    }
  }

  ngOnInit() {
    this.checkLoginStatus();

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

  checkLoginStatus() {
    const token = this.cookieService.get('skillUpToken');
    if (token) {
      this.authService.getUserData().subscribe({
        next: (res: any) => {
          if (res.success && res.data) {
            this.isLoggedIn = true;
            this.userName = res.data.name;
          }
          this.fetchDailyLimit();
        },
        error: () => {
          this.isLoggedIn = false;
          this.fetchDailyLimit();
        }
      });
    } else {
      this.isLoggedIn = false;
      this.fetchDailyLimit();
    }
  }

  fetchDailyLimit() {
    this.aiService.getDailyLimit().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.freeQueriesRemaining = res.remaining;
        }
      },
      error: (err) => {
        console.error("Error fetching limit", err);
      }
    });
  }

  askQuestion(question: string) {
    this.userInput = question;
    this.sendMessage();
  }

  ngOnDestroy() {
    if (this.modeSub) this.modeSub.unsubscribe();
    if (this.routerSub) this.routerSub.unsubscribe();
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

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  clearGeneralChat() {
    if (this.isCourseMode) return;
    this.messages = [];
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

    if (this.freeQueriesRemaining <= 0) {
      const msg = this.isLoggedIn 
        ? 'You have exhausted your daily free queries. Please try again tomorrow.'
        : 'You have exhausted your daily free queries. Please <a href="/login">login</a> to increase your limit.';
      this.messages.push({ role: 'model', content: msg });
      this.scrollToBottom();
      return;
    }

    const userMessage = this.userInput.trim();
    this.messages.push({ role: 'user', content: userMessage });
    this.userInput = '';
    this.isLoading = true;

    this.apiSub = this.aiService.sendMessage(userMessage).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.isLoading = false;
          this.simulateTyping(res.response);
          this.freeQueriesRemaining = Math.max(0, this.freeQueriesRemaining - 1);
        } else {
          this.isLoading = false;
        }
        this.apiSub = null;
      },
      error: (err) => {
        console.error('Chat error:', err);
        let errorMsg = "Something went wrong.";
        if (err.error && err.error.message) {
          errorMsg = err.error.message;
        }
        this.messages.push({ role: 'model', content: `Error: ${errorMsg}` });
        this.isLoading = false;
        this.scrollToBottom();
        this.apiSub = null;
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
    this.isTyping = true;
    const newMessage: ChatMessage = { role: 'model', content: '' };
    this.messages.push(newMessage);
    
    const formattedText = this.parseMarkdown(fullText);
    
    // Split text by HTML tags to avoid breaking tags during typing
    const tokens = formattedText.split(/(<[^>]+>)/g);
    let tokenIndex = 0;
    let charIndex = 0;

    const typeNext = () => {
      if (!this.isTyping) return;
      if (tokenIndex >= tokens.length) {
        this.isTyping = false;
        return;
      }
      
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
          this.typingTimeout = setTimeout(typeNext, 20);
        } else {
          tokenIndex++;
          charIndex = 0;
          typeNext();
        }
      }
    };
    
    typeNext();
  }

  stopResponding() {
    this.isTyping = false;
    this.isLoading = false;
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    if (this.apiSub) {
      this.apiSub.unsubscribe();
      this.apiSub = null;
    }
  }
}
