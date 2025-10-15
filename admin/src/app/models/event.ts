export interface Event {
  EventID: number;
  EventName: string;
  Description: string;
  EventDate: string;
  EndDate?: string;
  StartTime?: string;
  EndTime?: string;
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

  IsActive?: boolean;   // 1 = active, 0 = inactive
  Suspended?: boolean;  // 1 = suspended, 0 = not suspended
  RegistrationCount?: number;
}

