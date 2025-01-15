import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recent-events',
  templateUrl: './recent-events.component.html',
  styleUrls: ['./recent-events.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
  
})
export class RecentEventsComponent implements OnInit {
  events: any[] = [];
  filters = { dataInici: '', dataFinal: '', llocEvent: '', tipusEvent: '' };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.http
      .get<any[]>('http://localhost:3000/api/stats/statistics/recent', {
        params: this.filters,
      })
      .subscribe((data) => (this.events = data));
  }
}
