import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.notificationService.showNotification('Logged out successfully', 'info');
  }

  navigateToEmployees(): void {
    this.router.navigate(['/employees']);
    this.isMenuOpen = false;
  }

  navigateToAddEmployee(): void {
    this.router.navigate(['/employees/add']);
    this.isMenuOpen = false;
  }
}