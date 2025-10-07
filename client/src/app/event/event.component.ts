import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../services/event.service';
import { Event } from '../models/event';

@Component({
  selector: 'app-event',
  imports: [CommonModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {

  event?: Event;
  errorMsg = '';
  loading = true;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {

    const id = window.location.pathname.split('/').pop();

    if (!id) {
      this.errorMsg = 'No event selected';
      this.loading = false;
      return;
    }

    this.eventService.getEventById(+id).subscribe({
      next: (data: Event) => {
        this.event = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching event:', err);
        this.errorMsg = 'Error fetching event details';
        this.loading = false;
      }
    });

  }

}
