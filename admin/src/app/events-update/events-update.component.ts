import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { Event } from '../models/event';

@Component({
  selector: 'app-events-update',
  imports: [CommonModule, FormsModule],
  templateUrl: './events-update.component.html',
  styleUrl: './events-update.component.css'
})
export class EventsUpdateComponent {
  
  event?: Event;
  eventID!: number;
  errorMsg = '';
  loading = true;



  constructor(
    private route: ActivatedRoute, 
    public router: Router,
    private eventService: EventService,
  ) { }

  ngOnInit(): void {

    this.eventID = Number(this.route.snapshot.paramMap.get('id'));
    
    if (!this.eventID) {
      this.errorMsg = 'No event selected';
      this.loading = false;
      return;
    }

    this.loadEvent();
  }

  loadEvent(): void {

    console.log('Loading event with ID:', this.eventID);

    this.eventService.getEventById(+this.eventID).subscribe({
      next: (data) => {
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

  updateEvent(): void {

    if (!this.event) return;

    this.eventService.updateEvent(this.eventID, this.event).subscribe({
      next: () => {
        alert('Event updated successfully!');
        setTimeout(() => this.router.navigate(['/admin/event-list']), 1500);
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Update failed. Please try again.');
      }
    });
  }

}
