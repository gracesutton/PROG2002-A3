import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private apiUrl = 'https://23290509.it.scu.edu.au/prog2002/goldcoastcharityconnect/api/registrations';

  constructor(private http: HttpClient) { }

  // Register for an event
  registerForEvent(registration: any): Observable<any> {
    console.log('Attempting POST to', this.apiUrl);
    return this.http.post(this.apiUrl, registration);
  }

  // Get registrations for a specific event
  getRegistrationsByEvent(eventId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/event/${eventId}`).pipe(
      catchError((error) => {
        console.warn('Registrations endpoint not ready yet:', error.message);
        // return empty list so the frontend doesn’t break
        return of([]);
      })
    );
  }

}
