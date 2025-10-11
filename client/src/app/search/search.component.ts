import { Component } from '@angular/core';
import { EventService } from '../services/event.service';
import { Event } from '../models/event';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  events: Event[] = [];
  categories: any[] = [];

  searchDate = '';
  searchCategory = '';
  searchLocation = '';

  loading = false;
  message = '';

  constructor(private service: EventService) { }

  // fetch all categories on load for ddl
  ngOnInit(): void {
    this.loadCategories();
  }

  // get categories from the service
  loadCategories(): void {
    this.service.getCategories().subscribe({
      next: (data: Event[]) =>
        this.categories = data,
      error: (err) => {
        console.error('Error loading categories:', err);
        this.message = 'Error loading categories';
      }
    });
  }

  // search events based on query parameters
  searchEvents(): void {
    this.loading = true;
    this.message = 'Searching...';

    this.service.searchEvents(this.searchDate, this.searchLocation, this.searchCategory)
      .subscribe({
        next: (data: Event[]) => {
          this.events = data;
          this.loading = false;
          this.message = data.length ? '' : 'No events found';
          console.log('Search results:', data);
        },
        error: (err) => {
          console.error('Error searching events:', err);
          this.loading = false;
          this.message = 'Error searching events';
        }
      });
  }

  // clear all filters and results
  clearFilters(): void {
    this.searchDate = '';
    this.searchLocation = '';
    this.searchCategory = '';
    this.events = [];
    this.message = '';
  }

}
