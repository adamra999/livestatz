export interface EventFormData {
  title: string;
  platform: string;
  dateTime: string;
  description: string;
  eventUrl: string;
  targetAudience: number | null;
  isPaid: boolean;
  price: string;
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

