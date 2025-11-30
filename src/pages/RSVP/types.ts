export type RSVPStatus = "yes" | "maybe" | "no" | null;

export interface EventData {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  platform: string;
  location?: string;
  isPaid: boolean;
  price: string | number;
  organizer?: string;
  organizerAvatar?: string;
  organizerEmail?: string;
  creatorName?: string;
  creatorHandle?: string;
  maxAttendees: number;
  currentAttendees: number;
  tags: string[];
  link?: string;
  eventUrl?: string;
  duration?: string;
  calendarOption?: "auto" | "ask" | "none";
  coverImage?: string;
}

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime?: Date;
  url?: string;
  organizer?: {
    name: string;
    email: string;
  };
}

