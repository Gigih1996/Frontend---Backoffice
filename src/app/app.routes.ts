// app/app.routes.ts
import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';


// Standalone Components
import { LoginComponent } from './components/login/login/login.component';
import { EmployeeListComponent } from './components/employee-list/employee-list/employee-list.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee/add-employee.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail/employee-detail.component';

// Auth Guard Function (Functional Guard for Angular 19)
export const authGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
};

export const routes: Routes = [
    // Default redirect
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },

    // Public routes
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login - Employee Management'
    },

    // Protected routes
    {
        path: 'employees',
        component: EmployeeListComponent,
        canActivate: [authGuard],
        title: 'Employee List - Employee Management'
    },
    {
        path: 'employees/add',
        component: AddEmployeeComponent,
        canActivate: [authGuard],
        title: 'Add Employee - Employee Management'
    },
    {
        path: 'employees/:id',
        component: EmployeeDetailComponent,
        canActivate: [authGuard],
        title: 'Employee Details - Employee Management'
    },

    // Wildcard route - must be last
    {
        path: '**',
        redirectTo: '/login'
    }
];