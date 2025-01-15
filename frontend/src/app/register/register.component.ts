import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
})
export class RegisterComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    // Log a visit to the "Register" page
    this.logEvent('Register Page', 'visita');
  }

  // Method to handle user registration
  register() {
    if (this.email.trim() === '' || this.password.trim() === '') {
      this.errorMessage = 'Email and password cannot be empty';
      // Log a click event for the "Register" button with error
      this.logEvent('Register Button', 'click');
      return;
    }

    this.authService.register(this.email, this.password).subscribe({
      next: (response) => {
        // Display success message
        this.successMessage = response.message;
        this.errorMessage = ''; // Clear any error message

        // Log a successful click event for the "Register" button
        this.logEvent('Register Button - Success', 'click');

        // Redirect to login after a delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        // Display error message from the backend
        this.errorMessage = error.error.message || 'Unexpected error occurred';
        this.successMessage = ''; // Clear success message

        // Log a failed click event for the "Register" button
        this.logEvent('Register Button - Error', 'click');
      },
    });
  }

  backToLogin() {
    // Log a click event for the "Back to Login" button
    this.logEvent('Back to Login Button', 'click');
    this.router.navigate(['/login']);
  }

  // Method to log events
  private logEvent(location: string, eventType: string): void {
    const sessionId = this.sessionService.getSessionId();
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
