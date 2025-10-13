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

}
