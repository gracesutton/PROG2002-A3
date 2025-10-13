import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})

export class EventService {

  private apiUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) { }

  // Get all events
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  // Get all categories
  getCategories(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/categories/list`);
  }

  // Search events based on parameters
  searchEvents(date?: string, location?: string, categoryID?: string): Observable<Event[]> {
    
    // build query params object
    const params: any = {};
    if (date) params.date = date;
    if (location) params.location = location;
    if (categoryID) params.categoryID = categoryID;

    console.log("Search params:", params);
    console.log("API URL:", `${this.apiUrl}/search`, { params });

    // angular ignores null/undefined params & will build query string automatically
    return this.http.get<Event[]>(`${this.apiUrl}/search`, { params });
  }

  // Get event by ID
  getEventById(id: number): Observable<{ event: Event; registrations: any[] }> {
    return this.http.get<{ event: Event; registrations: any[] }>(`${this.apiUrl}/${id}`);
  }

  // Delete event by ID
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
