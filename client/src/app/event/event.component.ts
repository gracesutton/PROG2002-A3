import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../services/event.service';
import { Event } from '../models/event';
import { RegistrationService } from '../services/registration.service';

@Component({
  selector: 'app-event',
  standalone: false,
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {

  event?: Event;
  registrations: any[] = [];
  eventID!: number;
  errorMsg = '';
  loading = true;

  constructor(
    private route: ActivatedRoute, 
    private eventService: EventService,
    private regoService: RegistrationService
  ) { }

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMsg = 'No event selected';
      this.loading = false;
      return;
    }

    this.eventService.getEventById(+id).subscribe({
      next: (data) => {
        console.log('Events fetched successfully: ', data);
        if ('event' in data) {
          // future backend format with registrations
          this.event = data.event;
          this.registrations = data.registrations || [];
        } else {
          // current backend format without registrations
          this.event = data as Event;
          this.regoService.getRegistrationsByEvent(id).subscribe({
            next: (regos) => {
              console.log('Fetched registrations:', regos);
              this.registrations = regos || []
            },
            error: () => this.registrations = []
          });
        }

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
