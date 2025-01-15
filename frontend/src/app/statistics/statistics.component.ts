import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})

export class StatisticsComponent implements OnInit {
  stats: any[] = [];
  filters = { dataInici: '', dataFinal: '', llocEvent: '', tipusEvent: '' };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.http.get<any[]>('http://localhost:3000/api/statistics', { params: this.filters })
      .subscribe(data => this.stats = data);
  }
}

