// header.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class HeaderComponent {
  isLoggedIn: boolean = false; // Track if the user is logged in
  showDropdown = false;
  userName: string = ''; // Track the username of the logged-in user

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private sessionService: SessionService
  ) {}

  // Check if user is logged in
  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  // Log out the user
  logout() {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']); // Redirect to login page
    this.logEvent('Navigation', 'click');
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  // Navigate to login page
  login() {
    this.router.navigate(['/login']);
    this.logEvent('Navigation', 'click');
  }

  // Navigate to register page
  register() {
    this.router.navigate(['/register']);
    this.logEvent('Navigation', 'click');
  }

  // Navigate to statistics page
  statistics() {
    this.router.navigate(['/statistics']);
    this.logEvent('Navigation', 'click');
  }

  // Navigate to recent events page
  recentEvents() {
    this.router.navigate(['/statistics/recent']);
    this.logEvent('Navigation', 'click');
  }

  // Method to log events
  private logEvent(location: string, eventType: string): void {
    const sessionId = this.sessionService.getSessionId(); // Assuming session service is managing sessions
    this.http
      .post('http://localhost:3000/api/auth/statistics', {
        sessionId,
        llocEvent: location,
        tipusEvent: eventType,
        createdAt: new Date(),
      })
      .subscribe({
        next: () => console.log(`Event logged: ${location} (${eventType})`),
        error: (err) => console.error('Error logging event:', err),
      });
  }
}
