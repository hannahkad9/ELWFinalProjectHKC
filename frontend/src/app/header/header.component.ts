import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Adjust the path if necessary
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  
})
export class HeaderComponent {
  isLoggedIn: boolean = false; // Track if the user is logged in
  userName: string = '';
  showDropdown = false;


  constructor(private authService: AuthService, private router: Router) {}

  // Check if user is logged in
  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    } }

  // Log out the user
  logout() {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);  // Redirect to login page
  }
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }


  // Navigate to login page
  login() {
    this.router.navigate(['/login']);
  }

  // Navigate to register page
  register() {
    this.router.navigate(['/register']);
  }
  
  statistics() {
    this.router.navigate(['/statistics']);
  }
  recentEvents() {
    this.router.navigate(['/statistics/recent']);
  }
  
}


