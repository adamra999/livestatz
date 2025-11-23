import { format } from "date-fns";

export interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime?: Date;
  url?: string;
  organizer?: {
    name: string;
    email: string;
  };
}

/**
 * Formats a date for iCalendar format (YYYYMMDDTHHMMSSZ)
 */
const formatICalDate = (date: Date): string => {
  return format(date, "yyyyMMdd'T'HHmmss'Z'");
};

/**
 * Escapes special characters in iCalendar text fields
 */
const escapeICalText = (text: string): string => {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
};

/**
 * Generates a unique identifier for the calendar event
 */
const generateUID = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}@livestatz.app`;
};

/**
 * Generates an iCalendar (.ics) file content
 */
export const generateICS = (event: CalendarEvent): string => {
  const now = new Date();
  const startDate = event.startTime;
  const endDate = event.endTime || new Date(startDate.getTime() + 60 * 60 * 1000); // Default 1 hour duration

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LiveStatz//Event Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${generateUID()}`,
    `DTSTAMP:${formatICalDate(now)}`,
    `DTSTART:${formatICalDate(startDate)}`,
    `DTEND:${formatICalDate(endDate)}`,
    `SUMMARY:${escapeICalText(event.title)}`,
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICalText(event.description)}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeICalText(event.location)}`);
  }

  if (event.url) {
    lines.push(`URL:${event.url}`);
  }

  if (event.organizer) {
    lines.push(
      `ORGANIZER;CN=${escapeICalText(event.organizer.name)}:mailto:${event.organizer.email}`
    );
  }

  lines.push(
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: Event starts in 1 hour",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  );

  return lines.join("\r\n");
};

/**
 * Downloads an .ics file to the user's device
 */
export const downloadICS = (icsContent: string, filename: string = "event.ics"): void => {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Creates a data URL for the .ics file (useful for email attachments)
 */
export const createICSDataURL = (icsContent: string): string => {
  const base64 = btoa(unescape(encodeURIComponent(icsContent)));
  return `data:text/calendar;base64,${base64}`;
};

/**
 * Generates calendar links for different providers
 */
export const generateCalendarLinks = (event: CalendarEvent) => {
  const startDate = formatICalDate(event.startTime);
  const endDate = formatICalDate(
    event.endTime || new Date(event.startTime.getTime() + 60 * 60 * 1000)
  );

  // Google Calendar
  const googleParams = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${startDate}/${endDate}`,
    details: event.description || "",
    location: event.location || "",
    sprop: "website:livestatz.app",
  });

  // Outlook
  const outlookParams = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: event.startTime.toISOString(),
    enddt: (event.endTime || new Date(event.startTime.getTime() + 60 * 60 * 1000)).toISOString(),
    body: event.description || "",
    location: event.location || "",
  });

  return {
    google: `https://calendar.google.com/calendar/render?${googleParams.toString()}`,
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?${outlookParams.toString()}`,
    office365: `https://outlook.office.com/calendar/0/deeplink/compose?${outlookParams.toString()}`,
    yahoo: `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(
      event.title
    )}&st=${startDate}&et=${endDate}&desc=${encodeURIComponent(
      event.description || ""
    )}&in_loc=${encodeURIComponent(event.location || "")}`,
  };
};
