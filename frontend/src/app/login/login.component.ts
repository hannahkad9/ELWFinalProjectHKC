import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  email: string = ''; // User's email input
  password: string = ''; // User's password input
  errorMessage: string = ''; // Error message if login fails

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private sessionService: SessionService
  ) {}

  // Login method - authenticates user using the AuthService
  login() {
    this.errorMessage = ''; // Clear any previous error messages

    // Log click event for the "Login" button
    this.logEvent('Login', 'click');

    // Call login method from AuthService with provided email and password
    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        // Ensure response contains user and token
        if (response && response.token && response.user) {
          const user = response.user;
          const token = response.token;

          // Store user data, token, and other necessary values in localStorage
          localStorage.setItem('score', (user?.score ?? 0).toString());
          localStorage.setItem('roundsPlayed', (user?.roundsPlayed ?? 0).toString());
          localStorage.setItem('level', (user?.level ?? 1).toString());
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);

          // Update AuthService with logged-in user
          this.authService.setUser(user);

          // Log success event
          this.logEvent('Login', 'click');

          // Redirect to the game page after successful login
          this.router.navigate(['/game']);
        } else {
          // Log failure event
          this.logEvent('Login', 'click');
          this.errorMessage = 'Unexpected error, please try again later.';
        }
      },
      error: (err) => {
        // Log failed login attempt
        this.logEvent('Login', 'click');
        this.errorMessage = 'Invalid login credentials!'; // Display error message
      }
    });
  }

  // Open Register Window - navigate to the register page
  openRegisterWindow() {
    this.logEvent('Login', 'click');
    this.router.navigate(['/register']);
  }

  // Method to log events
  private logEvent(location: string, eventType: string): void {
    const sessionId = this.sessionService.getSessionId();
    this.http
      .post('http://localhost:3000/api/stats/statistics', {
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
