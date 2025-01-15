import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiUrl = 'http://localhost:3000/api/statistics';  // Update with your actual API base URL

  constructor(private http: HttpClient) {}

  // Function to create a new statistic
  createStatistic(statisticData: any): Observable<any> {
    return this.http.post(this.apiUrl, statisticData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  // Function to get filtered statistics
  getFilteredStatistics(filters: any): Observable<any> {
    return this.http.get(this.apiUrl, {
      params: filters,
    });
  }

  // Function to get the 10 most recent statistics with optional filters
  getRecentStatistics(filters: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/recent`, {
      params: filters,
    });
  }
}
