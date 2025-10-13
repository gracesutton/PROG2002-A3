export interface Event {
  EventID: number;
  EventName: string;
  Description: string;
  EventDate: string;
  Location: string;

  CategoryID?: number;
  CategoryName?: string;
  CategoryImage?: string;

  TicketPrice?: number;
  GoalAmount?: number;
  CurrentProgress?: number;

  OrganisationID?: number;
  OrganisationName?: string;
  OrganisationDescription?: string;
  Website?: string;
  Phone?: string;

  Status?: string; // e.g. Active, Past, Suspended
  RegistrationCount?: number;
}
