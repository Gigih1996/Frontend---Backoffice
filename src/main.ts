// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Services
import { AuthService } from './app/services/auth.service';
import { EmployeeService } from './app/services/employee.service';
import { NotificationService } from './app/services/notification.service';

bootstrapApplication(AppComponent, {
  providers: [
    // Router
    provideRouter(routes),

    // Animations
    provideAnimations(),

    // Forms
    importProvidersFrom(FormsModule, ReactiveFormsModule),

    // Services (already provided in root, but explicit for clarity)
    AuthService,
    EmployeeService,
    NotificationService
  ]
}).catch(err => console.error(err));