import { Component } from '@angular/core';
import { EventService } from '../services/event.service';
import { Event } from '../models/event';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {

  events: Event[] = [];
  upcomingEvents: Event[] = [];
  pastEvents: Event[] = [];

  constructor(private service: EventService) { }

  // fetch all events on load
  ngOnInit(): void {
    this.loadEvents();
  }

  // get events from the service
  loadEvents(): void {
    this.service.getEvents().subscribe({
      next: (data: Event[]) => {
        this.events = data;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // normalise to midnight
        this.upcomingEvents = data.filter(e => new Date(e.EventDate) >= today);
        this.pastEvents = data.filter(e => new Date(e.EventDate) < today);
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }

}
