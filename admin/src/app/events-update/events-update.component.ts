import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { Event } from '../models/event';
import { HttpClient } from '@angular/common/http';

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

  categories: any[] = [];
  organisations: any[] = [];

  constructor(
    private route: ActivatedRoute, 
    public router: Router,
    private eventService: EventService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {

    this.eventID = Number(this.route.snapshot.paramMap.get('id'));
    
    if (!this.eventID) {
      this.errorMsg = 'No event selected';
      this.loading = false;
      return;
    }

    this.loadEvent();
    this.loadCategories();
    this.loadOrganisations();
  }

  loadCategories() {
    this.http.get<any[]>('http://localhost:8080/api/admin/categories').subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Failed to load categories:', err)
    });
  }

  loadOrganisations() {
    this.http.get<any[]>('http://localhost:8080/api/admin/organisations').subscribe({
      next: (data) => (this.organisations = data),
      error: (err) => console.error('Failed to load organisations:', err)
    });
  }

  loadEvent(): void {

    console.log('Loading event with ID:', this.eventID);

    this.eventService.getEventById(+this.eventID).subscribe({
      next: (data) => {
        this.event = data;

        // trim ISO strings for date inputs
        if (this.event.EventDate) {
          this.event.EventDate = this.event.EventDate.substring(0, 10);
        }
        if (this.event.EndDate) {
          this.event.EndDate = this.event.EndDate.substring(0, 10);
        }

        // normalize binary flags
        this.event.IsActive = !!this.event.IsActive;
        this.event.Suspended = !!this.event.Suspended;

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

    // convert boolean to int for backend
    const updatedEvent = {
      ...this.event,
      IsActive: this.event.IsActive ? 1 : 0,
      Suspended: this.event.Suspended ? 1 : 0
    };

    this.eventService.updateEvent(updatedEvent.EventID, updatedEvent).subscribe({
      next: () => {
        alert('Event updated successfully!');
        console.log('Event updated:', this.event);
        setTimeout(() => this.router.navigate(['/admin/event-list']), 1500);
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Update failed. Please try again.');
      }
    });
  }

}
