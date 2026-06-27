import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {

  menuItems = [
    { label: 'Dashboard', icon: 'pi pi-home', link: '/admin/dashboard' },
    { label: 'Users', icon: 'pi pi-users', link: '/admin/users' },
    { label: 'Courses', icon: 'pi pi-book', link: '/admin/courses' },
    { label: 'Categories', icon: 'pi pi-tags', link: '/admin/categories' },
    { label: 'Transactions', icon: 'pi pi-credit-card', link: '/admin/transactions' },
    { label: 'Settings', icon: 'pi pi-cog', link: '/admin/settings' },
  ];

  constructor(private router: Router, private cookieService: CookieService) {}

  ngOnInit(): void {}

  logout() {
    this.cookieService.delete('skillUpToken', '/');
    this.router.navigate(['/admin/login']);
  }
}
