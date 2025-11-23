import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useEvents } from "@/hooks/useEvents";
import { format } from "date-fns";
import type { EventFormData } from "../types";

const initialFormData: EventFormData = {
  // Step 1: Event Details
  title: "",
  description: "",
  dateTime: "",
  startTime: "",
  duration: "",
  coverImage: "",
  
  // Step 2: Platforms
  selectedPlatforms: [],
  
  // Step 3: RSVP & Reminders
  maxAttendees: null,
  hasMaxAttendees: false,
  reminder24h: true,
  reminder1h: true,
  reminderLive: true,
  calendarOption: "auto",
  requireEmail: true,
  visibility: "public",
  
  // Step 4: Monetization
  isPaid: false,
  price: "",
  acceptTips: false,
  paymentMethod: "",
  paymentHandle: "",
  
  // Legacy fields
  platform: "Instagram Live",
  eventUrl: "",
  targetAudience: null,
  attendeeBenefits: [],
  includeReplay: false,
  includePerks: false,
  perkDescription: "",
  offerWithSubscription: false,
};

export const useEventForm = (embedded = false, onSuccess?: (event: any) => void, onClose?: () => void) => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { createEvent, updateEvent, fetchEventById } = useEvents();
  const [isCreating, setIsCreating] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [isLoading, setIsLoading] = useState(!!eventId);
  const isEditMode = !!eventId;
  const [formData, setFormData] = useState<EventFormData>(initialFormData);

  useEffect(() => {
    if (eventId) {
      loadEventData();
    }
  }, [eventId]);

  const loadEventData = useCallback(async () => {
    if (!eventId) return;

    try {
      setIsLoading(true);
      const event = await fetchEventById(eventId);
      if (event) {
        const dateTime = event.dateTime ? format(new Date(event.dateTime), "yyyy-MM-dd'T'HH:mm") : "";
        const eventData = event as any; // Type assertion for new fields until types are regenerated
        
        setFormData({
          // Event Details
          title: event.title || "",
          description: event.description || "",
          dateTime: dateTime,
          startTime: dateTime ? dateTime.split("T")[1] : "",
          duration: eventData.duration || "",
          coverImage: eventData.coverImage || "",
          
          // Platforms
          selectedPlatforms: eventData.selectedPlatforms || [],
          
          // RSVP Settings
          maxAttendees: eventData.maxAttendees || null,
          hasMaxAttendees: eventData.hasMaxAttendees || false,
          reminder24h: eventData.reminder24h ?? true,
          reminder1h: eventData.reminder1h ?? true,
          reminderLive: eventData.reminderLive ?? true,
          calendarOption: eventData.calendarOption || "auto",
          requireEmail: eventData.requireEmail ?? true,
          visibility: eventData.visibility || "public",
          
          // Monetization
          isPaid: event.isPaid || false,
          price: eventData.price || event.ticketPrice || "",
          acceptTips: eventData.acceptTips || false,
          paymentMethod: eventData.paymentMethod || "",
          paymentHandle: eventData.paymentHandle || "",
          
          // Legacy fields
          platform: event.platform || "Instagram Live",
          eventUrl: event.link || "",
          targetAudience: null,
          attendeeBenefits: (event.attendeeBenefits as string[]) || [],
          includeReplay: event.includeReplay || false,
          includePerks: event.includePerks || false,
          perkDescription: event.perkDescription || "",
          offerWithSubscription: event.offerWithSubscription || false,
        });
      }
    } catch (error) {
      toast({
        title: "Error loading event",
        description: (error as Error).message,
        variant: "destructive",
      });
      navigate("/events");
    } finally {
      setIsLoading(false);
    }
  }, [eventId, fetchEventById, navigate]);

  const validateUrl = useCallback((url: string): boolean => {
    if (!url) {
      setUrlError("Event URL is required");
      return false;
    }

    // Auto-prepend https:// if no protocol is provided
    let urlToValidate = url.trim();
    if (!urlToValidate.match(/^https?:\/\//i)) {
      urlToValidate = `https://${urlToValidate}`;
      // Update the form data with the corrected URL
      setFormData((prev) => ({ ...prev, eventUrl: urlToValidate }));
    }

    try {
      const urlObj = new URL(urlToValidate);
      if (!urlObj.protocol.match(/^https?:$/)) {
        setUrlError("URL must start with http:// or https://");
        return false;
      }
      setUrlError("");
      return true;
    } catch {
      setUrlError("Please enter a valid URL (e.g., example.com/event)");
      return false;
    }
  }, []);

  const handleCreateEvent = useCallback(async () => {
    if (!formData.title || !formData.dateTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.selectedPlatforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      // Use the first platform's profile URL as the main event URL for backward compatibility
      const eventUrl = formData.selectedPlatforms[0]?.profileUrl || 
                       formData.selectedPlatforms[0]?.scheduledLink || 
                       "https://example.com/live";

      // Map all form fields to database columns
      const eventData = {
        // Basic info
        title: formData.title,
        description: formData.description,
        dateTime: formData.dateTime,
        platform: formData.selectedPlatforms.map(p => p.platform).join(", "),
        link: eventUrl,
        eventUrl: eventUrl,
        
        // New wizard fields
        coverImage: formData.coverImage || null,
        duration: formData.duration || null,
        selectedPlatforms: formData.selectedPlatforms,
        
        // RSVP settings
        maxAttendees: formData.maxAttendees,
        hasMaxAttendees: formData.hasMaxAttendees,
        reminder24h: formData.reminder24h,
        reminder1h: formData.reminder1h,
        reminderLive: formData.reminderLive,
        calendarOption: formData.calendarOption,
        requireEmail: formData.requireEmail,
        visibility: formData.visibility,
        
        // Monetization
        isPaid: formData.isPaid,
        price: formData.price || null,
        acceptTips: formData.acceptTips,
        paymentMethod: formData.paymentMethod || null,
        paymentHandle: formData.paymentHandle || null,
        
        // Legacy fields
        targetAudience: formData.targetAudience,
        attendeeBenefits: formData.attendeeBenefits,
        includeReplay: formData.includeReplay,
        includePerks: formData.includePerks,
        perkDescription: formData.perkDescription,
        offerWithSubscription: formData.offerWithSubscription,
      };

      if (isEditMode && eventId) {
        await updateEvent(eventId, eventData);
        toast({
          title: "Event Updated!",
          description: "Your event has been successfully updated.",
        });
        navigate(`/events/${eventId}`);
      } else {
        const response = await createEvent(eventData);
        toast({
          title: "Event Created!",
          description:
            "Your live event has been successfully created. Redirecting to RSVP page...",
        });

        if (embedded && onSuccess) {
          onSuccess(response);
          onClose?.();
        } else {
          navigate(`/events/success/${response?.id}`);
        }
      }
    } catch (error) {
      toast({
        title: isEditMode ? "Error updating event" : "Error creating event",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  }, [formData, isEditMode, eventId, createEvent, updateEvent, navigate, embedded, onSuccess, onClose]);

  const handleCancel = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  }, [onClose, navigate]);

  const updateFormField = useCallback(<K extends keyof EventFormData>(
    field: K,
    value: EventFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  return {
    formData,
    isCreating,
    isLoading,
    isEditMode,
    urlError,
    updateFormField,
    validateUrl,
    handleCreateEvent,
    handleCancel,
  };
};

