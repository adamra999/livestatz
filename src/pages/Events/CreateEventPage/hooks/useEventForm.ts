import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useEvents } from "@/hooks/useEvents";
import { format } from "date-fns";
import type { EventFormData } from "../types";

const initialFormData: EventFormData = {
  title: "",
  platform: "Instagram Live",
  dateTime: "",
  description: "",
  eventUrl: "",
  targetAudience: null,
  isPaid: false,
  price: "",
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
        setFormData({
          title: event.title || "",
          platform: event.platform || "Instagram Live",
          dateTime: event.dateTime ? format(new Date(event.dateTime), "yyyy-MM-dd'T'HH:mm") : "",
          description: event.description || "",
          eventUrl: event.link || "",
          targetAudience: null,
          isPaid: event.isPaid || false,
          price: event.ticketPrice || "",
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
    if (!formData.title || !formData.dateTime || !formData.eventUrl) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!validateUrl(formData.eventUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid event URL",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      if (isEditMode && eventId) {
        await updateEvent(eventId, { ...formData });
        toast({
          title: "Event Updated!",
          description: "Your event has been successfully updated.",
        });
        navigate(`/events/${eventId}`);
      } else {
        const response = await createEvent({ ...formData });
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
  }, [formData, isEditMode, eventId, validateUrl, createEvent, updateEvent, navigate, embedded, onSuccess, onClose]);

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

