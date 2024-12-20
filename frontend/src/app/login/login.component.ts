import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

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

  constructor(private router: Router, private authService: AuthService) {}

  // Login method - authenticates user using the AuthService
  login() {
    // Clear any previous error messages
    this.errorMessage = '';

    // Call login method from AuthService with provided email and password
    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        // Ensure response contains user and token
        if (response && response.token && response.user) {
          const user = response.user;
          const token = response.token;

          // Ensure the user has the expected properties before accessing them
          const score = user?.score ?? 0; // Default to 0 if score is undefined
          const roundsPlayed = user?.roundsPlayed ?? 0; // Default to 0 if roundsPlayed is undefined
          const level = user?.level ?? 1; // Default to 1 if level is undefined
          console.log(score, user.roundsPlayed, user.level);
          // Store user data, token, and other necessary values in localStorage
          localStorage.setItem('score', score.toString());
          localStorage.setItem('roundsPlayed', roundsPlayed.toString());
          localStorage.setItem('level', level.toString());
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', JSON.stringify(user)); // Store full user data
          localStorage.setItem('token', token); // Store JWT token

          // Update AuthService with logged-in user
          this.authService.setUser(user);

          // Redirect to the game page after successful login
          this.router.navigate(['/game']);
        } else {
          // Handle case where response is missing required data
          this.errorMessage = 'Unexpected error, please try again later.';
        }
      },
      error: (err) => {
        // Handle login failure (invalid credentials)
        this.errorMessage = 'Invalid login credentials!'; // Display error message
      }
    });
  }

  // Open Register Window - navigate to the register page
  openRegisterWindow() {
    this.router.navigate(['/register']);
  }
}
