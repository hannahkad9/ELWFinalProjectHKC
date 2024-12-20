import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(p0: unknown): boolean {
    const token = localStorage.getItem('authToken');  // Check token in local storage
    if (token) {
      return true;  // Allow access to the game page
    } else {
      this.router.navigate(['/login']);  // Redirect to login if no token
      return false;
    }
  }
}
