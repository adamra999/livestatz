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
        setFormData({
          title: event.title || "",
          description: event.description || "",
          dateTime: dateTime,
          startTime: dateTime ? dateTime.split("T")[1] : "",
          duration: "",
          coverImage: "",
          selectedPlatforms: [],
          maxAttendees: null,
          hasMaxAttendees: false,
          reminder24h: true,
          reminder1h: true,
          reminderLive: true,
          calendarOption: "auto",
          requireEmail: true,
          visibility: "public",
          isPaid: event.isPaid || false,
          price: event.ticketPrice || "",
          acceptTips: false,
          paymentMethod: "",
          paymentHandle: "",
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
      // Map new form data to existing database schema
      const eventUrl = formData.selectedPlatforms[0]?.profileUrl || 
                       formData.selectedPlatforms[0]?.scheduledLink || 
                       "https://example.com/live";

      // Store monetization info in description or use existing fields
      let enhancedDescription = formData.description;
      if (formData.acceptTips && formData.paymentHandle) {
        enhancedDescription += `\n\nTips accepted via ${formData.paymentMethod}: ${formData.paymentHandle}`;
      }

      // Map to existing database fields only
      const eventData = {
        title: formData.title,
        platform: formData.selectedPlatforms.map(p => p.platform).join(", "),
        dateTime: formData.dateTime,
        description: enhancedDescription,
        eventUrl: eventUrl,
        link: eventUrl, // Some parts of the code use 'link' instead of 'eventUrl'
        isPaid: formData.isPaid,
        price: formData.price || null,
        targetAudience: formData.targetAudience,
        attendeeBenefits: formData.attendeeBenefits,
        includeReplay: formData.includeReplay,
        includePerks: formData.includePerks,
        perkDescription: formData.perkDescription,
        offerWithSubscription: formData.offerWithSubscription,
        // Store additional wizard data in tags field as JSON
        tags: [
          ...((formData as any).tags || []),
          {
            type: "wizard_data",
            coverImage: formData.coverImage,
            duration: formData.duration,
            platforms: formData.selectedPlatforms,
            rsvp: {
              maxAttendees: formData.maxAttendees,
              hasMaxAttendees: formData.hasMaxAttendees,
              reminder24h: formData.reminder24h,
              reminder1h: formData.reminder1h,
              reminderLive: formData.reminderLive,
              calendarOption: formData.calendarOption,
              requireEmail: formData.requireEmail,
              visibility: formData.visibility,
            },
            monetization: {
              acceptTips: formData.acceptTips,
              paymentMethod: formData.paymentMethod,
              paymentHandle: formData.paymentHandle,
            },
          },
        ],
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

