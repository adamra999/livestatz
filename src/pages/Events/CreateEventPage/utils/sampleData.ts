import type { EventFormData, PlatformDetails } from "../types";

/**
 * Generates sample event data for testing and development
 */
export const generateSampleEventData = (): EventFormData => {
  // Get a date 7 days from now
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);
  futureDate.setHours(18, 0, 0, 0); // 6 PM

  const dateTimeString = futureDate.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  const startTime = futureDate.toTimeString().slice(0, 5); // HH:mm

  return {
    // Step 1: Event Details
    title: "Morning Workout Session",
    description: "Join me for an energizing morning workout session! We'll do a mix of cardio, strength training, and stretching. Perfect for all fitness levels. Bring your water bottle and let's get moving together!",
    dateTime: dateTimeString,
    startTime: startTime,
    duration: "60", // 60 minutes
    coverImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    
    // Step 2: Platforms
    selectedPlatforms: [
      {
        platform: "Instagram Live",
        profileUrl: "https://instagram.com/live/your-event",
        scheduledLink: "https://instagram.com/live/your-event",
      },
      {
        platform: "YouTube Live",
        profileUrl: "https://youtube.com/live/your-event",
        scheduledLink: "https://youtube.com/live/your-event",
      },
    ] as PlatformDetails[],
    
    // Step 3: RSVP & Reminders
    maxAttendees: 100,
    hasMaxAttendees: true,
    reminder24h: true,
    reminder1h: true,
    reminderLive: true,
    calendarOption: "auto",
    requireEmail: true,
    visibility: "public",
    
    // Step 4: Monetization
    isPaid: false,
    price: "",
    acceptTips: true,
    paymentMethod: "venmo",
    paymentHandle: "@yourhandle",
    
    // Legacy fields
    platform: "Instagram Live",
    eventUrl: "https://instagram.com/live/your-event",
    targetAudience: 100,
    attendeeBenefits: ["Live Q&A", "Exclusive content"],
    includeReplay: true,
    includePerks: false,
    perkDescription: "",
    offerWithSubscription: false,
  };
};

/**
 * Generates a paid event sample
 */
export const generatePaidEventSample = (): EventFormData => {
  const baseData = generateSampleEventData();
  
  return {
    ...baseData,
    title: "Exclusive Masterclass: Digital Marketing Secrets",
    description: "Learn advanced digital marketing strategies from industry experts. This exclusive masterclass covers SEO, social media advertising, and conversion optimization. Limited seats available!",
    isPaid: true,
    price: "49.99",
    attendeeBenefits: ["Live Q&A", "Exclusive content", "Behind-the-scenes", "VIP access"],
    maxAttendees: 50,
    hasMaxAttendees: true,
  };
};

/**
 * Generates a free community event sample
 */
export const generateFreeEventSample = (): EventFormData => {
  const baseData = generateSampleEventData();
  
  return {
    ...baseData,
    title: "Community Q&A Session",
    description: "Join our community Q&A session! Ask me anything about fitness, nutrition, or lifestyle. This is a free event open to everyone. Come with your questions!",
    isPaid: false,
    price: "",
    acceptTips: false,
    maxAttendees: null,
    hasMaxAttendees: false,
    visibility: "public",
    attendeeBenefits: [],
  };
};

/**
 * Generates a private event sample
 */
export const generatePrivateEventSample = (): EventFormData => {
  const baseData = generateSampleEventData();
  
  return {
    ...baseData,
    title: "VIP Members Only: Exclusive Workshop",
    description: "This is an exclusive workshop for VIP members only. We'll cover advanced techniques and provide personalized feedback.",
    visibility: "private",
    maxAttendees: 20,
    hasMaxAttendees: true,
    requireEmail: true,
  };
};

/**
 * Generates multiple platform event sample
 */
export const generateMultiPlatformEventSample = (): EventFormData => {
  const baseData = generateSampleEventData();
  
  return {
    ...baseData,
    title: "Multi-Platform Live Stream: Product Launch",
    description: "Join us for our biggest product launch ever! We'll be streaming simultaneously across multiple platforms. Don't miss out on exclusive launch day offers!",
    selectedPlatforms: [
      {
        platform: "Instagram Live",
        profileUrl: "https://instagram.com/live/product-launch",
        scheduledLink: "https://instagram.com/live/product-launch",
      },
      {
        platform: "YouTube Live",
        profileUrl: "https://youtube.com/live/product-launch",
        scheduledLink: "https://youtube.com/live/product-launch",
      },
      {
        platform: "TikTok Live",
        profileUrl: "https://tiktok.com/live/product-launch",
        scheduledLink: "https://tiktok.com/live/product-launch",
      },
      {
        platform: "Twitch",
        profileUrl: "https://twitch.tv/yourchannel",
        rtmpUrl: "rtmp://live.twitch.tv/app/",
        streamKey: "live_xxxxxxxxxxxxx",
      },
    ] as PlatformDetails[],
    platform: "Instagram Live, YouTube Live, TikTok Live, Twitch",
  };
};

/**
 * All sample event generators
 */
export const SAMPLE_EVENTS = {
  free: generateFreeEventSample,
  paid: generatePaidEventSample,
  private: generatePrivateEventSample,
  multiPlatform: generateMultiPlatformEventSample,
  default: generateSampleEventData,
};

