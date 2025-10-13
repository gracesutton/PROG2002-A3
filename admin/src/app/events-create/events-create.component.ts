import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { Event } from '../models/event';

@Component({
  selector: 'app-events-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './events-create.component.html',
  styleUrl: './events-create.component.css'
})
export class EventsCreateComponent {

    event: Event = {
      EventID: 0,
      EventName: '',
      Description: '',
      EventDate: '',
      Location: '',
      CategoryName: '',
      CategoryImage: '',
      TicketPrice: 0,
      GoalAmount: 0,
      CurrentProgress: 0,
      OrganisationName: ''
    };

    submitting = false;

    constructor(private eventService: EventService, public router: Router) { }

    createEvent() {

      if (!this.event.EventName || !this.event.EventDate || !this.event.Location) {
        alert('Please fill in all required fields.');
        return;
      }

      this.submitting = true;
      this.eventService.createEvent(this.event).subscribe({
        next: () => {
          alert('Event created successfully!');
          this.router.navigate(['/admin/event-list']);
        },
        error: (err) => {
          console.error('Error creating event:', err);
          alert('Error creating event. Please try again.');
          this.submitting = false;
        }
      });
    }

}
