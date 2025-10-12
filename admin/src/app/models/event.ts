export interface Event {
  EventID: number;
  EventName: string;
  Description: string;
  EventDate: Date;
  Location: string;
  CategoryName: string;
  CategoryImage: string;

  TicketPrice?: number;
  GoalAmount?: number;
  CurrentProgress?: number;

  OrganisationName?: string;
  OrganisationDescription?: string;
  Website?: string;
  Phone?: string;
}
