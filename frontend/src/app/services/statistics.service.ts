import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiUrl = 'http://localhost:3000/api/stats';  // Update with your actual API base URL

  constructor(private http: HttpClient) {}


  // Get all statistics with optional filters
  getStatistics(filters: any): Observable<any> {
    let params = new URLSearchParams();

    if (filters) {
      if (filters.dataInici) params.set('dataInici', filters.dataInici);
      if (filters.dataFinal) params.set('dataFinal', filters.dataFinal);
      if (filters.llocEvent) params.set('llocEvent', filters.llocEvent);
      if (filters.tipusEvent) params.set('tipusEvent', filters.tipusEvent);
    }

    return this.http.get<any>(`${this.apiUrl}/statistics?${params.toString()}`);
  }

  // Get the most recent 10 events with optional filters
  getRecentEvents(filters: any): Observable<any> {
    let params = new URLSearchParams();

    if (filters) {
      if (filters.dataInici) params.set('dataInici', filters.dataInici);
      if (filters.dataFinal) params.set('dataFinal', filters.dataFinal);
      if (filters.llocEvent) params.set('llocEvent', filters.llocEvent);
      if (filters.tipusEvent) params.set('tipusEvent', filters.tipusEvent);
    }

    return this.http.get<any>(`${this.apiUrl}/statistics/recent?${params.toString()}`);
  }
}
