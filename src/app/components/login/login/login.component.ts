import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  loginForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  animationState = 'initial';

  // Background animation particles
  particles: { x: number, y: number, size: number, speed: number }[] = [];
  private animationFrame = 0;

  ngOnInit(): void {
    this.initializeForm();
    this.initializeBackgroundAnimation();

    // Check if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/employees']);
    }

    // Trigger entrance animation
    setTimeout(() => {
      this.animationState = 'enter';
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      rememberMe: [false]
    });
  }

  private initializeBackgroundAnimation(): void {
    // Create floating particles for background animation
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 2 + 0.5
      });
    }
    this.animateParticles();
  }

  private animateParticles(): void {
    const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.particles.forEach(particle => {
        particle.y -= particle.speed;

        if (particle.y < 0) {
          particle.y = canvas.height;
          particle.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(102, 126, 234, ${0.1 + Math.random() * 0.3})`;
        ctx.fill();
      });

      this.animationFrame = requestAnimationFrame(animate);
    };

    animate();
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.animationState = 'loading';

      const { username, password } = this.loginForm.value;

      // Simulate API call with loading animation
      setTimeout(() => {
        const loginSuccess = this.authService.login(username, password);

        if (loginSuccess) {
          this.animationState = 'success';
          this.notificationService.showNotification(
            '🎉 Welcome back! Login successful',
            'success'
          );

          // Navigate after success animation
          setTimeout(() => {
            this.router.navigate(['/employees']);
          }, 1000);
        } else {
          this.animationState = 'error';
          this.notificationService.showNotification(
            '❌ Invalid credentials. Please try again.',
            'error'
          );
          this.isLoading = false;

          // Reset animation state
          setTimeout(() => {
            this.animationState = 'enter';
          }, 2000);
        }
      }, 1500);
    } else {
      this.markFormGroupTouched();
      this.animationState = 'shake';

      setTimeout(() => {
        this.animationState = 'enter';
      }, 500);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} must be at least ${requiredLength} characters`;
      }
      if (field.errors['pattern']) {
        return 'Username can only contain letters, numbers, and underscores';
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: Record<string, string> = {
      username: 'Username',
      password: 'Password'
    };
    return displayNames[fieldName] || fieldName;
  }

  // Quick fill demo credentials
  fillDemoCredentials(): void {
    this.loginForm.patchValue({
      username: 'admin',
      password: 'password123'
    });

    this.notificationService.showNotification(
      '✨ Demo credentials filled!',
      'info'
    );
  }
}