import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Employee, Group, PaginationConfig, SearchCriteria, SortConfig } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$ = this.employeesSubject.asObservable();

  private currentSearchSubject = new BehaviorSubject<SearchCriteria>({
    firstName: '',
    email: '',
    group: '',
    status: ''
  });
  public currentSearch$ = this.currentSearchSubject.asObservable();

  private groups: Group[] = [
    { id: '1', name: 'Engineering' },
    { id: '2', name: 'Marketing' },
    { id: '3', name: 'Sales' },
    { id: '4', name: 'Human Resources' },
    { id: '5', name: 'Finance' },
    { id: '6', name: 'Operations' },
    { id: '7', name: 'Product Management' },
    { id: '8', name: 'Customer Support' },
    { id: '9', name: 'Quality Assurance' },
    { id: '10', name: 'Business Development' }
  ];

  constructor() {
    this.generateDummyData();
  }

  private generateDummyData(): void {
    const statuses = ['Active', 'Inactive', 'Pending', 'Suspended'];
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Christopher', 'Ashley', 'Daniel', 'Jessica'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

    const employees: Employee[] = [];

    for (let i = 1; i <= 150; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const group = this.groups[Math.floor(Math.random() * this.groups.length)];

      employees.push({
        id: i.toString(),
        username: `user${i.toString().padStart(3, '0')}`,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`,
        birthDate: new Date(1980 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        basicSalary: 3000000 + Math.floor(Math.random() * 10000000),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        group: group.name,
        description: `Employee description for ${firstName} ${lastName}`
      });
    }

    this.employeesSubject.next(employees);
  }

  getEmployees(): Employee[] {
    return this.employeesSubject.value;
  }

  getEmployeeById(id: string): Employee | undefined {
    return this.employeesSubject.value.find(emp => emp.id === id);
  }

  addEmployee(employee: Employee): void {
    const employees = this.employeesSubject.value;
    const newId = (Math.max(...employees.map(e => parseInt(e.id || '0'))) + 1).toString();
    employee.id = newId;
    employees.push(employee);
    this.employeesSubject.next([...employees]);
  }

  getGroups(): Group[] {
    return this.groups;
  }

  updateCurrentSearch(search: SearchCriteria): void {
    this.currentSearchSubject.next(search);
  }

  getCurrentSearch(): SearchCriteria {
    return this.currentSearchSubject.value;
  }

  searchAndFilterEmployees(
    search: SearchCriteria,
    sort: SortConfig,
    pagination: PaginationConfig
  ): { employees: Employee[], totalCount: number } {
    let filteredEmployees = this.getEmployees();

    // Apply search filters
    if (search.firstName) {
      filteredEmployees = filteredEmployees.filter(emp =>
        emp.firstName.toLowerCase().includes(search.firstName.toLowerCase())
      );
    }
    if (search.email) {
      filteredEmployees = filteredEmployees.filter(emp =>
        emp.email.toLowerCase().includes(search.email.toLowerCase())
      );
    }
    if (search.group) {
      filteredEmployees = filteredEmployees.filter(emp =>
        emp.group.toLowerCase().includes(search.group.toLowerCase())
      );
    }
    if (search.status) {
      filteredEmployees = filteredEmployees.filter(emp =>
        emp.status.toLowerCase().includes(search.status.toLowerCase())
      );
    }

    // Apply sorting
    filteredEmployees.sort((a, b) => {
      let aValue = a[sort.field as keyof Employee] ?? '';
      let bValue = b[sort.field as keyof Employee] ?? '';

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    const totalCount = filteredEmployees.length;

    // Apply pagination
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

    return { employees: paginatedEmployees, totalCount };
  }
}