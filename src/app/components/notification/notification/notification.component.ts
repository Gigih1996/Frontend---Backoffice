// components/notification/notification.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';
import { Notification } from '../../../models/employee.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription!: Subscription;
  private animationTimeouts: { [key: string]: any } = {};

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(
      notifications => {
        this.handleNotificationsChange(notifications);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // Clear all timeouts
    Object.values(this.animationTimeouts).forEach(timeout => {
      if (timeout) clearTimeout(timeout);
    });
  }

  private handleNotificationsChange(newNotifications: Notification[]): void {
    // Handle new notifications with entrance animation
    newNotifications.forEach(notification => {
      const existing = this.notifications.find(n => n.id === notification.id);
      if (!existing) {
        // Add entrance animation class after a brief delay
        this.animationTimeouts[notification.id] = setTimeout(() => {
          const element = document.getElementById(`notification-${notification.id}`);
          if (element) {
            element.classList.add('notification-enter');
          }
        }, 50);
      }
    });

    // Handle removed notifications with exit animation
    this.notifications.forEach(oldNotification => {
      const stillExists = newNotifications.find(n => n.id === oldNotification.id);
      if (!stillExists) {
        const element = document.getElementById(`notification-${oldNotification.id}`);
        if (element) {
          element.classList.add('notification-exit');
          // Remove from DOM after animation
          setTimeout(() => {
            this.notifications = newNotifications;
          }, 300);
        }
      }
    });

    // Update notifications list if no exit animations are needed
    const hasExitingNotifications = this.notifications.some(oldNotification =>
      !newNotifications.find(n => n.id === oldNotification.id)
    );

    if (!hasExitingNotifications) {
      this.notifications = newNotifications;
    }
  }

  removeNotification(id: string): void {
    const element = document.getElementById(`notification-${id}`);
    if (element) {
      element.classList.add('notification-exit');
      // Delay removal to allow exit animation
      setTimeout(() => {
        this.notificationService.removeNotification(id);
      }, 300);
    } else {
      // Fallback if element not found
      this.notificationService.removeNotification(id);
    }
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'success': 'bi-check-circle-fill',
      'error': 'bi-x-circle-fill',
      'warning': 'bi-exclamation-triangle-fill',
      'info': 'bi-info-circle-fill'
    };
    return icons[type] || 'bi-info-circle-fill';
  }

  getNotificationClass(type: string): string {
    const classes: { [key: string]: string } = {
      'success': 'notification-success',
      'error': 'notification-error',
      'warning': 'notification-warning',
      'info': 'notification-info'
    };
    return classes[type] || 'notification-info';
  }

  getNotificationTitle(type: string): string {
    const titles: { [key: string]: string } = {
      'success': 'Success',
      'error': 'Error',
      'warning': 'Warning',
      'info': 'Information'
    };
    return titles[type] || 'Notification';
  }

  pauseAutoRemoval(notification: Notification): void {
    // This would pause the auto-removal timer if we implemented that feature
    // For now, it's a placeholder for future enhancement
  }

  resumeAutoRemoval(notification: Notification): void {
    // This would resume the auto-removal timer if we implemented that feature
    // For now, it's a placeholder for future enhancement
  }

  onNotificationClick(notification: Notification): void {
    // Handle notification click - could navigate or perform actions
    // For now, just remove the notification
    this.removeNotification(notification.id);
  }

  // Tracking method for ngFor performance
  trackByNotificationId(index: number, notification: Notification): string {
    return notification.id;
  }

  // Accessibility methods
  getAriaLabel(notification: Notification): string {
    return `${this.getNotificationTitle(notification.type)}: ${notification.message}`;
  }

  getAriaLive(type: string): string {
    // Error notifications should be announced immediately
    return type === 'error' ? 'assertive' : 'polite';
  }
}