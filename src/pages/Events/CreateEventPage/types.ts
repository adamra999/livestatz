export interface PlatformDetails {
  platform: string;
  profileUrl: string;
  scheduledLink?: string;
  rtmpUrl?: string;
  streamKey?: string;
}

export interface EventFormData {
  // Step 1: Event Details
  title: string;
  description: string;
  dateTime: string;
  startTime: string;
  duration: string;
  coverImage: string;
  
  // Step 2: Platforms
  selectedPlatforms: PlatformDetails[];
  
  // Step 3: RSVP & Reminders
  maxAttendees: number | null;
  hasMaxAttendees: boolean;
  reminder24h: boolean;
  reminder1h: boolean;
  reminderLive: boolean;
  calendarOption: 'auto' | 'ask' | 'none';
  requireEmail: boolean;
  visibility: 'public' | 'followers' | 'private';
  
  // Step 4: Monetization
  isPaid: boolean;
  price: string;
  acceptTips: boolean;
  paymentMethod: string;
  paymentHandle: string;
  
  // Legacy fields for backward compatibility
  platform: string;
  eventUrl: string;
  targetAudience: number | null;
  attendeeBenefits: string[];
  includeReplay: boolean;
  includePerks: boolean;
  perkDescription: string;
  offerWithSubscription: boolean;
}

export interface CreateEventPageProps {
  onClose?: () => void;
  embedded?: boolean;
  onSuccess?: (event: any) => void;
}

export const PLATFORMS = [
  "Instagram Live",
  "TikTok Live",
  "YouTube Live",
  "Twitter Spaces",
  "Twitch",
  "Discord",
  "Facebook Live",
] as const;

export const ATTENDEE_BENEFITS = [
  "Live Q&A",
  "Exclusive content",
  "Behind-the-scenes",
  "VIP access",
] as const;

