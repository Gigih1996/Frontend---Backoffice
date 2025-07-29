import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { NotificationService } from '../../../services/notification.service';
import { Group } from '../../../models/employee.model';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  employeeForm!: FormGroup;
  groups: Group[] = [];
  filteredGroups: Group[] = [];
  groupSearchTerm = '';
  isGroupDropdownOpen = false;
  isLoading = false;
  isFormSubmitted = false;

  // Form validation states
  fieldValidations: Record<string, boolean> = {};

  // Date constraints
  maxDate = new Date().toISOString().split('T')[0];
  minDate = new Date(1950, 0, 1).toISOString().split('T')[0];

  // Status options
  statusOptions = [
    { value: 'Active', label: 'Active', icon: 'bi-check-circle-fill', color: 'success' },
    { value: 'Inactive', label: 'Inactive', icon: 'bi-x-circle-fill', color: 'danger' },
    { value: 'Pending', label: 'Pending', icon: 'bi-clock-fill', color: 'warning' },
    { value: 'Suspended', label: 'Suspended', icon: 'bi-pause-circle-fill', color: 'secondary' }
  ];

  // Form step tracking
  currentStep = 1;
  totalSteps = 3;

  // Animation state
  animationState = 'initial';

  ngOnInit(): void {
    this.initializeForm();
    this.loadGroups();
    this.setupFormValidation();

    // Trigger entrance animation
    setTimeout(() => {
      this.animationState = 'enter';
    }, 100);
  }

  private initializeForm(): void {
    this.employeeForm = this.fb.group({
      // Step 1: Personal Information
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      birthDate: ['', [
        Validators.required,
        this.dateValidator.bind(this)
      ]],

      // Step 2: Work Information
      basicSalary: ['', [
        Validators.required,
        Validators.min(1000000),
        Validators.max(1000000000),
        Validators.pattern(/^\d+$/)
      ]],
      status: ['Active', Validators.required],
      group: ['', Validators.required],

      // Step 3: Additional Information
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]]
    });
  }

  private loadGroups(): void {
    this.groups = this.employeeService.getGroups();
    this.filteredGroups = [...this.groups];
  }

  private setupFormValidation(): void {
    // Real-time validation feedback
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      if (control) {
        control.valueChanges.subscribe(() => {
          this.fieldValidations[key] = control.valid;
        });
      }
    });
  }

  private dateValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const inputDate = new Date(control.value);
      const today = new Date();
      const minDateObj = new Date(1950, 0, 1);

      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);

      if (inputDate > today) {
        return { futureDate: true };
      }

      if (inputDate < minDateObj) {
        return { tooOld: true };
      }

      // Age validation (must be at least 17 years old)
      const age = today.getFullYear() - inputDate.getFullYear();
      const monthDiff = today.getMonth() - inputDate.getMonth();
      const dayDiff = today.getDate() - inputDate.getDate();

      let actualAge = age;
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        actualAge--;
      }

      if (actualAge < 17) {
        return { tooYoung: true };
      }
    }
    return null;
  }

  // Group dropdown methods
  onGroupSearch(): void {
    if (this.groupSearchTerm.trim() === '') {
      this.filteredGroups = [...this.groups];
    } else {
      this.filteredGroups = this.groups.filter(group =>
        group.name.toLowerCase().includes(this.groupSearchTerm.toLowerCase())
      );
    }
  }

  selectGroup(group: Group): void {
    this.employeeForm.patchValue({ group: group.name });
    this.groupSearchTerm = group.name;
    this.isGroupDropdownOpen = false;
  }

  toggleGroupDropdown(): void {
    this.isGroupDropdownOpen = !this.isGroupDropdownOpen;
    if (this.isGroupDropdownOpen) {
      this.onGroupSearch();
      // Focus search input after dropdown opens
      setTimeout(() => {
        const searchInput = document.getElementById('groupSearch') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }, 100);
    }
  }

  closeGroupDropdown(): void {
    setTimeout(() => {
      this.isGroupDropdownOpen = false;
    }, 200);
  }

  // Step navigation
  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      if (this.validateCurrentStep()) {
        this.currentStep++;
        this.animationState = 'slideNext';
        setTimeout(() => {
          this.animationState = 'enter';
        }, 300);
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.animationState = 'slidePrev';
      setTimeout(() => {
        this.animationState = 'enter';
      }, 300);
    }
  }

  goToStep(step: number): void {
    if (step !== this.currentStep && step >= 1 && step <= this.totalSteps) {
      // Validate previous steps if moving forward
      if (step > this.currentStep) {
        for (let i = 1; i < step; i++) {
          if (!this.validateStep(i)) {
            this.currentStep = i;
            return;
          }
        }
      }
      this.currentStep = step;
    }
  }

  private validateCurrentStep(): boolean {
    return this.validateStep(this.currentStep);
  }

  private validateStep(step: number): boolean {
    const stepFields = this.getStepFields(step);
    let isValid = true;

    stepFields.forEach(fieldName => {
      const control = this.employeeForm.get(fieldName);
      if (control) {
        control.markAsTouched();
        if (control.invalid) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

  private getStepFields(step: number): string[] {
    switch (step) {
      case 1:
        return ['username', 'firstName', 'lastName', 'email', 'birthDate'];
      case 2:
        return ['basicSalary', 'status', 'group'];
      case 3:
        return ['description'];
      default:
        return [];
    }
  }

  // Form submission
  onSubmit(): void {
    this.isFormSubmitted = true;

    if (this.employeeForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.animationState = 'loading';

      const formValue = this.employeeForm.value;
      const employee = {
        ...formValue,
        birthDate: new Date(formValue.birthDate),
        basicSalary: Number(formValue.basicSalary)
      };

      // Simulate API call with realistic delay
      setTimeout(() => {
        try {
          this.employeeService.addEmployee(employee);
          this.animationState = 'success';

          this.notificationService.showNotification(
            `✅ Employee ${employee.firstName} ${employee.lastName} has been added successfully!`,
            'success'
          );

          // Navigate back after success animation
          setTimeout(() => {
            this.router.navigate(['/employees']);
          }, 2000);

        } catch {
          this.animationState = 'error';
          this.isLoading = false;

          this.notificationService.showNotification(
            '❌ Failed to add employee. Please try again.',
            'error'
          );

          setTimeout(() => {
            this.animationState = 'enter';
          }, 2000);
        }
      }, 2000);

    } else {
      this.markFormGroupTouched();
      this.animationState = 'shake';

      this.notificationService.showNotification(
        '⚠️ Please fill in all required fields correctly',
        'warning'
      );

      // Find first invalid step
      for (let i = 1; i <= this.totalSteps; i++) {
        if (!this.validateStep(i)) {
          this.currentStep = i;
          break;
        }
      }

      setTimeout(() => {
        this.animationState = 'enter';
      }, 500);
    }
  }

  onCancel(): void {
    if (this.employeeForm.dirty) {
      const confirmed = confirm('Are you sure you want to leave? All unsaved changes will be lost.');
      if (!confirmed) return;
    }

    this.router.navigate(['/employees']);
  }

  // Utility methods
  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (field?.touched && field?.errors) {
      const errors = field.errors;

      if (errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (errors['minlength']) {
        const requiredLength = errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} must be at least ${requiredLength} characters`;
      }
      if (errors['maxlength']) {
        const maxLength = errors['maxlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${maxLength} characters`;
      }
      if (errors['email']) {
        return 'Please enter a valid email address';
      }
      if (errors['min']) {
        const minValue = errors['min'].min;
        return `${this.getFieldDisplayName(fieldName)} must be at least ${this.formatCurrency(minValue)}`;
      }
      if (errors['max']) {
        const maxValue = errors['max'].max;
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${this.formatCurrency(maxValue)}`;
      }
      if (errors['pattern']) {
        return this.getPatternErrorMessage(fieldName);
      }
      if (errors['futureDate']) {
        return 'Birth date cannot be in the future';
      }
      if (errors['tooOld']) {
        return 'Birth date cannot be before 1950';
      }
      if (errors['tooYoung']) {
        return 'Employee must be at least 17 years old';
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: Record<string, string> = {
      username: 'Username',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      birthDate: 'Birth Date',
      basicSalary: 'Basic Salary',
      status: 'Status',
      group: 'Department',
      description: 'Description'
    };
    return displayNames[fieldName] || fieldName;
  }

  private getPatternErrorMessage(fieldName: string): string {
    const patternMessages: Record<string, string> = {
      username: 'Username can only contain letters, numbers, and underscores',
      firstName: 'First name can only contain letters and spaces',
      lastName: 'Last name can only contain letters and spaces',
      basicSalary: 'Salary must be a valid number'
    };
    return patternMessages[fieldName] || 'Invalid format';
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Auto-format salary input
  onSalaryInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    let value = target.value.replace(/\D/g, '');
    if (value) {
      // Remove leading zeros
      value = value.replace(/^0+/, '') || '0';
      this.employeeForm.patchValue({ basicSalary: value });
    }
  }

  getFormattedSalary(): string {
    const salary = this.employeeForm.get('basicSalary')?.value;
    if (salary && !isNaN(salary)) {
      return this.formatCurrency(Number(salary));
    }
    return '';
  }

  // Progress calculation
  getFormProgress(): number {
    const totalFields = Object.keys(this.employeeForm.controls).length;
    let filledFields = 0;

    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      if (control?.value && control.valid) {
        filledFields++;
      }
    });

    return Math.round((filledFields / totalFields) * 100);
  }

  getStepProgress(): number {
    return Math.round((this.currentStep / this.totalSteps) * 100);
  }
}