import { Component } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { UserList } from '../../../models/UserList';
import { AppObject } from '../../../baseSettings/AppObject';
import { CookieService } from 'ngx-cookie-service';
import { ToastMessageService } from '../../../baseSettings/services/toastMessage.service';
import { Router, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [ToastModule, ButtonModule, AvatarModule, ChartModule],
  templateUrl: './teacher-dashboard.component.html',
  styles: ``
})
export class TeacherDashboardComponent {

  public data: any;
  public options: any;
  constructor(private router: Router) {}
  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
      datasets: [
        {
          label: 'Label text',
          data: [65, 34.567, 80, 56, 55, 40, 75, 65],
          fill: true,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4,
          backgroundColor: 'rgba(38, 107, 255, 0.2)'
        }
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 1.1,
      plugins: {
        legend: {
          display: false,
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  navigateToPage() {
    let url="/create-course/"+null;
    this.router.navigate([url]);
  }
}
