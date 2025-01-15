import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recent-events',
  templateUrl: './recent-events.component.html',
  styleUrls: ['./recent-events.component.css'],
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
      .get<any[]>('http://localhost:3000/api/statistics/recent', {
        params: this.filters,
      })
      .subscribe((data) => (this.events = data));
  }
}
