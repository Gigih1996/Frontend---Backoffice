import { Router } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);

  private isLoggedInSubject = new BehaviorSubject<boolean>(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // Hardcoded credentials for demo
  private validCredentials = {
    username: 'admin',
    password: 'password123'
  };

  login(username: string, password: string): boolean {
    if (username === this.validCredentials.username &&
      password === this.validCredentials.password) {
      localStorage.setItem('isLoggedIn', 'true');
      this.isLoggedInSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}


