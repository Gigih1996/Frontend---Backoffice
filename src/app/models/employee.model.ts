// models/employee.model.ts
export interface Employee {
    id?: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: Date;
    basicSalary: number;
    status: string;
    group: string;
    description: string;
}

// models/group.model.ts
export interface Group {
    id: string;
    name: string;
}

// models/pagination.model.ts
export interface PaginationConfig {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

// models/search.model.ts
export interface SearchCriteria {
    firstName: string;
    email: string;
    group: string;
    status: string;
}

// models/sort.model.ts
export interface SortConfig {
    field: string;
    direction: 'asc' | 'desc';
}

// models/notification.model.ts
export interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}