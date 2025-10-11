import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { Event } from '../models/event';
import { RegistrationService } from '../services/registration.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  eventID!: number;
  event!: Event;
  name: string = '';
  email: string = '';
  tickets: number = 1;

  loading: boolean = true;
  errorMsg: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private regoService: RegistrationService
  ) {}

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMsg = 'No event selected';
      this.loading = false;
      return;
    }

    this.eventID = id;
    this.loadEventDetails();
  }

  loadEventDetails(): void {
    this.eventService.getEventById(this.eventID).subscribe({
      next: (data: any) => {
        this.event = data.event || data; // works with or without registrations (both API shapes)
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching event details:', err);
        this.errorMsg = 'Error loading event details';
        this.loading = false;
      }
    });
  }

  register(): void {
    if (!this.name || !this.email || this.tickets < 1) {
      alert('Please fill in all fields correctly.');
      return;
    }

    const registration = {
      eventID: this.eventID,
      userName: this.name,
      email: this.email,
      tickets: this.tickets,
      date: new Date().toISOString().split('T')[0] // current date in YYYY-MM-DD format
    };

    this.regoService.registerForEvent(registration).subscribe({
      next: () => {
        console.log('Submitting registration:', registration);
        alert('Registration successful!');
        this.router.navigate(['/event', this.eventID]);
      },
      error: (err) => {
        console.error('Error submitting registration:', err);
        alert('Registration failed. Please try again later.');
      }
    });
  }

}