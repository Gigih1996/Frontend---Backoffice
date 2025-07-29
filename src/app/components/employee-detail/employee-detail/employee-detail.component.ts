// components/employee-detail/employee-detail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { NotificationService } from '../../../services/notification.service';
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  employee: Employee | null = null;
  isLoading = true;
  notFound = false;
  animationState = 'initial';

  // Employee statistics
  employeeStats = {
    yearsOfService: 0,
    age: 0,
    salaryRank: 'N/A',
    departmentRank: 'N/A'
  };

  // Activity timeline (mock data)
  activityTimeline = [
    {
      date: new Date(),
      type: 'info',
      icon: 'bi-person-check',
      title: 'Profile Updated',
      description: 'Employee profile was last updated'
    },
    {
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      type: 'success',
      icon: 'bi-calendar-check',
      title: 'Attendance Review',
      description: 'Monthly attendance review completed'
    },
    {
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      type: 'warning',
      icon: 'bi-star',
      title: 'Performance Review',
      description: 'Quarterly performance review scheduled'
    }
  ];

  // Tab management
  activeTab = 'overview';
  tabs = [
    { id: 'overview', label: 'Overview', shortLabel: 'Overview', icon: 'bi bi-person' },
    { id: 'details', label: 'Details', shortLabel: 'Details', icon: 'bi bi-card-text' },
    { id: 'activity', label: 'Activity', shortLabel: 'Activity', icon: 'bi bi-clock-history' },
    { id: 'documents', label: 'Documents', shortLabel: 'Docs', icon: 'bi bi-file-earmark-text' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadEmployee();

    // Trigger entrance animation
    setTimeout(() => {
      this.animationState = 'enter';
    }, 100);
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private loadEmployee(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.handleEmployeeNotFound();
      return;
    }

    // Simulate loading delay with realistic animation
    setTimeout(() => {
      this.employee = this.employeeService.getEmployeeById(id) ?? null;

      if (!this.employee) {
        this.handleEmployeeNotFound();
      } else {
        this.calculateEmployeeStats();
        this.isLoading = false;
      }
    }, 800);
  }

  private handleEmployeeNotFound(): void {
    this.notFound = true;
    this.isLoading = false;
    this.animationState = 'error';

    this.notificationService.showNotification(
      '❌ Employee not found or has been removed',
      'error'
    );
  }

  private calculateEmployeeStats(): void {
    if (!this.employee) return;

    // Calculate age
    const today = new Date();
    const birthDate = new Date(this.employee.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    this.employeeStats.age = age;

    // Calculate years of service (mock - assume joined 2-5 years ago)
    this.employeeStats.yearsOfService = Math.floor(Math.random() * 4) + 2;

    // Calculate salary rank within department (mock)
    const allEmployees = this.employeeService.getEmployees();
    const sameGroupEmployees = allEmployees.filter(emp => emp.group === this.employee?.group);
    const sortedBySalary = sameGroupEmployees.sort((a, b) => b.basicSalary - a.basicSalary);
    const rank = sortedBySalary.findIndex(emp => emp.id === this.employee?.id) + 1;
    this.employeeStats.salaryRank = `${rank} of ${sameGroupEmployees.length}`;

    // Department rank (mock)
    this.employeeStats.departmentRank = rank <= 3 ? 'Senior' : rank <= 6 ? 'Mid-level' : 'Junior';
  }

  // Navigation methods
  onBack(): void {
    this.router.navigate(['/employees']);
  }

  onEdit(): void {
    if (this.employee) {
      this.notificationService.showNotification(
        `✏️ Edit functionality for ${this.getFullName()} will be implemented`,
        'warning'
      );
    }
  }

  onDelete(): void {
    if (this.employee) {
      const confirmed = confirm(`Are you sure you want to delete ${this.getFullName()}? This action cannot be undone.`);
      if (confirmed) {
        this.notificationService.showNotification(
          `🗑️ Delete functionality for ${this.getFullName()} will be implemented`,
          'error'
        );
      }
    }
  }

  onPrint(): void {
    window.print();
  }

  onExport(): void {
    this.notificationService.showNotification(
      '📄 Export functionality will be implemented',
      'info'
    );
  }

  // Tab management
  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  // Utility methods
  getFullName(): string {
    if (!this.employee) return '';
    return `${this.employee.firstName} ${this.employee.lastName}`;
  }

  getInitials(): string {
    if (!this.employee) return '';
    return `${this.employee.firstName.charAt(0)}${this.employee.lastName.charAt(0)}`;
  }

  formatSalary(salary: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(salary);
  }

  formatSalaryCompact(salary: number): string {
    const million = salary / 1000000;
    return `Rp ${million.toFixed(1)}M`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateShort(date: Date): string {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatUsername(username: string): string {
    return `@${username}`;
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Active': 'bg-success',
      'Inactive': 'bg-danger',
      'Pending': 'bg-warning text-dark',
      'Suspended': 'bg-secondary'
    };
    return statusClasses[status] || 'bg-secondary';
  }

  getStatusIcon(status: string): string {
    const statusIcons: { [key: string]: string } = {
      'Active': 'bi-check-circle-fill',
      'Inactive': 'bi-x-circle-fill',
      'Pending': 'bi-clock-fill',
      'Suspended': 'bi-pause-circle-fill'
    };
    return statusIcons[status] || 'bi-question-circle-fill';
  }

  getDepartmentIcon(department: string): string {
    const departmentIcons: { [key: string]: string } = {
      'Engineering': 'bi-gear-fill',
      'Marketing': 'bi-megaphone-fill',
      'Sales': 'bi-graph-up-arrow',
      'Human Resources': 'bi-people-fill',
      'Finance': 'bi-calculator-fill',
      'Operations': 'bi-diagram-3-fill',
      'Product Management': 'bi-box-seam',
      'Customer Support': 'bi-headset',
      'Quality Assurance': 'bi-shield-check',
      'Business Development': 'bi-briefcase-fill'
    };
    return departmentIcons[department] || 'bi-building';
  }

  getPerformanceLevel(): string {
    if (!this.employee) return 'N/A';

    // Mock performance based on salary and status
    if (this.employee.status === 'Active' && this.employee.basicSalary > 8000000) {
      return 'Excellent';
    } else if (this.employee.status === 'Active' && this.employee.basicSalary > 5000000) {
      return 'Good';
    } else if (this.employee.status === 'Active') {
      return 'Satisfactory';
    } else {
      return 'Under Review';
    }
  }

  getPerformanceColor(): string {
    const performance = this.getPerformanceLevel();
    const colors: { [key: string]: string } = {
      'Excellent': 'text-success',
      'Good': 'text-info',
      'Satisfactory': 'text-warning',
      'Under Review': 'text-danger'
    };
    return colors[performance] || 'text-muted';
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'info': 'bi-info-circle-fill text-info',
      'success': 'bi-check-circle-fill text-success',
      'warning': 'bi-exclamation-triangle-fill text-warning',
      'error': 'bi-x-circle-fill text-danger'
    };
    return icons[type] || 'bi-circle-fill text-muted';
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  // Quick actions
  onSendEmail(): void {
    if (this.employee) {
      window.location.href = `mailto:${this.employee.email}`;
    }
  }

  onViewCalendar(): void {
    this.notificationService.showNotification(
      '📅 Calendar integration will be implemented',
      'info'
    );
  }

  onAssignTask(): void {
    this.notificationService.showNotification(
      '📋 Task assignment feature will be implemented',
      'info'
    );
  }

  onScheduleMeeting(): void {
    this.notificationService.showNotification(
      '🤝 Meeting scheduler will be implemented',
      'info'
    );
  }

  goToAddEmployee() {
    this.router.navigate(['/employees/add']);
  }

  getJoinDate(): Date {
    const years = this.employeeStats?.yearsOfService || 0;
    const msPerYear = 365 * 24 * 60 * 60 * 1000;
    return new Date(Date.now() - years * msPerYear);
  }
}