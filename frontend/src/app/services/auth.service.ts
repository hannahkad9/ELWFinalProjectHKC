// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

interface User {
  email: string;
  roundsPlayed: number;
  level: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // Backend API URL
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Register a new user
  register(email: string, password: string) {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, { email, password });
  }
  

  // Login an existing user
login(email: string, password: string) {
  return this.http.post<{ token: string; user: { email: string; roundsPlayed: number; level: number } }>(
    `${this.apiUrl}/login`,
    { email, password }
  );
}

  

  // Update user data (e.g., rounds played and level)
  updateProgress(token: string, roundsPlayedIncrement: number, levelIncrement: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update`, {
      token, 
      roundsPlayedIncrement, 
      levelIncrement
    });
  }
  

  // Set the user data after login or registration
  setUser(user: User) {
    this.userSubject.next(user);
  }

  // Get the current user data
  getUser() {
    return this.userSubject.value;
  }

  // Get user info
  getUserInfo(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Save user info
  saveUserInfo(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Remove user info
  removeUserInfo(): void {
    localStorage.removeItem('user');
  }
}
