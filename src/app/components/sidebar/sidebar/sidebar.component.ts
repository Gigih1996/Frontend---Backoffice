// components/sidebar/sidebar.component.ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { filter } from 'rxjs/operators';

interface MenuItem {
  icon: string;
  title: string;
  route: string;
  badge?: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Output() sidebarToggle = new EventEmitter<boolean>();

  collapsed = false;
  isMobile = false;
  mobileMenuOpen = false;
  isToggle = false;

  menuItems: MenuItem[] = [
    {
      icon: 'bi-speedometer2',
      title: 'Dashboard',
      route: '/employees'
    },
    {
      icon: 'bi-people-fill',
      title: 'Employee List',
      route: '/employees'
    },
    {
      icon: 'bi-person-plus-fill',
      title: 'Add Employee',
      route: '/employees/add'
    },
    // {
    //   icon: 'bi-graph-up',
    //   title: 'Reports',
    //   route: '/reports',
    //   badge: 'Soon'
    // },
    // {
    //   icon: 'bi-gear-fill',
    //   title: 'Settings',
    //   route: '/settings',
    //   badge: 'Soon'
    // }
  ];

  userInfo = {
    name: 'Admin User',
    email: 'admin@company.com',
    avatar: 'AU'
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  ngOnInit(): void {
    this.setActiveMenuItem();

    // Listen to route changes to update active menu
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setActiveMenuItem();
    });
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth <= 991.98;
    if (!this.isMobile) {
      this.mobileMenuOpen = false;
    }
  }

  private setActiveMenuItem(): void {
    const currentRoute = this.router.url;
    this.menuItems.forEach(item => {
      item.active = currentRoute.startsWith(item.route) ||
        (item.route === '/employees' && currentRoute === '/');
    });
  }

  toggleSidebar(): void {
    if (this.isMobile) {
      this.mobileMenuOpen = !this.mobileMenuOpen;
      this.isToggle = true;
    } else {
      this.isToggle = false;
      // this.collapsed = !this.collapsed;
      // this.sidebarToggle.emit(this.collapsed);
    }
  }

  closeMobileMenu(): void {
    if (this.isMobile) {
      this.mobileMenuOpen = false;
    }
  }

  navigateTo(route: string): void {
    if (route === '/reports' || route === '/settings') {
      this.notificationService.showNotification(
        'This feature is coming soon!',
        'info'
      );
      return;
    }

    this.router.navigate([route]);
    this.closeMobileMenu();
  }

  logout(): void {
    this.authService.logout();
    this.notificationService.showNotification('Logged out successfully', 'success');
  }

  getMenuItemClass(item: MenuItem): string {
    let classes = 'menu-item';
    if (item.active) classes += ' active';
    return classes;
  }
}