import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../services/event.service';
import { Event } from '../models/event';
import { TimeFormatPipe } from '../time-format.pipe';

@Component({
  selector: 'app-events-list',
  imports: [CommonModule, RouterModule, TimeFormatPipe],
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.css'
})
export class EventsListComponent {

  events: Event[] = [];
  message = '';

  constructor(private eventService: EventService) {
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => (this.events = events),
      error: (err) => {
        this.message = 'Failed to load events.';
        console.error('Failed to load events:', err);
      }
    });
  }

  deleteEvent(id: number): void {
    if (!confirm(`Are you sure you want to delete this event? This cannot be undone.`)) return;
    this.eventService.deleteEvent(id).subscribe({
      next: () => {
        this.message = `Event deleted.`;
        this.loadEvents();
      },
      error: (err) => {
        if (err.status === 409) {
          this.message = 'Sorry! This event has exisiting registrations and cannot be deleted.';
        } else {
          this.message = 'Delete failed. Please try again later.';
        }
      }
    });
  }
}
