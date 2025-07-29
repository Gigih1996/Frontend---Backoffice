import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { NotificationService } from '../../../services/notification.service';
import { Employee, SearchCriteria, SortConfig, PaginationConfig } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  employees: Employee[] = [];
  displayedEmployees: Employee[] = [];
  totalCount = 0;
  isLoading = true;
  isSearching = false;

  searchCriteria: SearchCriteria = {
    firstName: '',
    email: '',
    group: '',
    status: ''
  };

  sortConfig: SortConfig = {
    field: 'firstName',
    direction: 'asc'
  };

  paginationConfig: PaginationConfig = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  };

  itemsPerPageOptions = [5, 10, 25, 50, 100];

  // View modes
  viewMode: 'table' | 'grid' = 'table';

  // Filter options
  statusOptions = ['All', 'Active', 'Inactive', 'Pending', 'Suspended'];
  groupOptions = ['All'];

  ngOnInit(): void {
    this.loadGroupOptions();
    this.loadEmployees();
    this.restoreSearchState();
  }

  private loadGroupOptions(): void {
    const groups = this.employeeService.getGroups();
    this.groupOptions = ['All', ...groups.map(g => g.name)];
  }

  private restoreSearchState(): void {
    const savedSearch = this.employeeService.getCurrentSearch();
    if (savedSearch) {
      this.searchCriteria = { ...savedSearch };
    }
  }

  loadEmployees(): void {
    this.isLoading = true;

    setTimeout(() => {
      const result = this.employeeService.searchAndFilterEmployees(
        this.searchCriteria,
        this.sortConfig,
        this.paginationConfig
      );

      this.displayedEmployees = result.employees;
      this.totalCount = result.totalCount;
      this.paginationConfig.totalItems = result.totalCount;
      this.paginationConfig.totalPages = Math.ceil(result.totalCount / this.paginationConfig.itemsPerPage);

      this.isLoading = false;
      this.isSearching = false;
    }, 300);
  }

  onSearch(): void {
    this.isSearching = true;
    this.paginationConfig.currentPage = 1;
    this.employeeService.updateCurrentSearch(this.searchCriteria);
    this.loadEmployees();
  }

  onQuickFilter(field: string, value: string): void {
    if (field === 'status') {
      this.searchCriteria.status = value === 'All' ? '' : value;
    } else if (field === 'group') {
      this.searchCriteria.group = value === 'All' ? '' : value;
    }
    this.onSearch();
  }

  onClearSearch(): void {
    this.searchCriteria = {
      firstName: '',
      email: '',
      group: '',
      status: ''
    };
    this.employeeService.updateCurrentSearch(this.searchCriteria);
    this.onSearch();
  }

  onSort(field: string): void {
    if (this.sortConfig.field === field) {
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortConfig.field = field;
      this.sortConfig.direction = 'asc';
    }
    this.loadEmployees();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.paginationConfig.totalPages) {
      this.paginationConfig.currentPage = page;
      this.loadEmployees();
    }
  }

  onItemsPerPageChange(): void {
    this.paginationConfig.currentPage = 1;
    this.loadEmployees();
  }

  onViewModeChange(mode: 'table' | 'grid'): void {
    this.viewMode = mode;
  }

  onAddEmployee(): void {
    this.router.navigate(['/employees/add']);
  }

  onViewEmployee(employee: Employee): void {
    this.router.navigate(['/employees', employee.id]);
  }

  onEditEmployee(employee: Employee, event?: Event): void {
    if (event) event.stopPropagation();
    this.notificationService.showNotification(
      `Edit functionality for ${employee.firstName} ${employee.lastName} will be implemented`,
      'warning'
    );
  }

  onDeleteEmployee(employee: Employee, event?: Event): void {
    if (event) event.stopPropagation();
    this.notificationService.showNotification(
      `Delete confirmation for ${employee.firstName} ${employee.lastName}`,
      'error'
    );
  }

  getSortIcon(field: string): string {
    if (this.sortConfig.field !== field) return 'bi-arrow-down-up';
    return this.sortConfig.direction === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  }

  formatSalary(salary: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(salary);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: Record<string, string> = {
      'Active': 'bg-success',
      'Inactive': 'bg-danger',
      'Pending': 'bg-warning',
      'Suspended': 'bg-secondary'
    };
    return statusClasses[status] || 'bg-secondary';
  }

  getStatusIcon(status: string): string {
    const statusIcons: Record<string, string> = {
      'Active': 'bi-check-circle-fill',
      'Inactive': 'bi-x-circle-fill',
      'Pending': 'bi-clock-fill',
      'Suspended': 'bi-pause-circle-fill'
    };
    return statusIcons[status] || 'bi-question-circle-fill';
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.paginationConfig.totalPages;
    const current = this.paginationConfig.currentPage;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, -1, total);
      } else if (current >= total - 3) {
        pages.push(1, -1, total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, -1, current - 1, current, current + 1, -1, total);
      }
    }

    return pages;
  }

  // Bulk operations
  selectedEmployees = new Set<string>();
  selectAll = false;

  onSelectAll(): void {
    if (this.selectAll) {
      this.displayedEmployees.forEach(emp => this.selectedEmployees.add(emp.id!));
    } else {
      this.selectedEmployees.clear();
    }
  }

  onSelectEmployee(employeeId: string): void {
    if (this.selectedEmployees.has(employeeId)) {
      this.selectedEmployees.delete(employeeId);
    } else {
      this.selectedEmployees.add(employeeId);
    }

    this.selectAll = this.selectedEmployees.size === this.displayedEmployees.length;
  }

  onBulkDelete(): void {
    if (this.selectedEmployees.size === 0) {
      this.notificationService.showNotification('No employees selected', 'warning');
      return;
    }

    this.notificationService.showNotification(
      `Bulk delete for ${this.selectedEmployees.size} employees will be implemented`,
      'warning'
    );
  }

  exportToCSV(): void {
    this.notificationService.showNotification(
      'CSV export functionality will be implemented',
      'info'
    );
  }

  getLastItemIndex(): number {
    const endIndex = this.paginationConfig.currentPage * this.paginationConfig.itemsPerPage;
    return endIndex > this.totalCount ? this.totalCount : endIndex;
  }

  // Keyboard event handlers for accessibility
  onEmployeeKeydown(event: KeyboardEvent, employee: Employee): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onViewEmployee(employee);
    }
  }
}