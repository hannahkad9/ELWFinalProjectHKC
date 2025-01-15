import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SessionService {
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return localStorage.getItem('sessionId') || this.createRandomId();
  }

  private createRandomId(): string {
    const id = Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sessionId', id);
    return id;
  }

  getSessionId(): string {
    return this.sessionId;
  }
}
