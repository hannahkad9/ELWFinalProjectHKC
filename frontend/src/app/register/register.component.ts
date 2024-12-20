import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Method to handle user registration
// Method to handle user registration
register() {
  if (this.email.trim() === '' || this.password.trim() === '') {
    this.errorMessage = 'Email and password cannot be empty';
    return;
  }

  this.authService.register(this.email, this.password).subscribe({
    next: (response) => {
      // Display success message
      this.successMessage = response.message; 
      this.errorMessage = ''; // Clear any error message

      // Redirect to login after a delay
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    },
    error: (error) => {
      // Display error message from the backend
      this.errorMessage = error.error.message || 'Unexpected error occurred'; 
      this.successMessage = ''; // Clear success message
    }
  });
}

backToLogin() { 
  this.router.navigate(['/login']);
}

}

