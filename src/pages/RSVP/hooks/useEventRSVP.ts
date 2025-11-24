import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useFans } from "@/hooks/useFans";
import { useRsvps } from "@/hooks/useRsvps";
import { useFanEvents } from "@/hooks/useFanEvents";
import { useCalendarInvite } from "@/hooks/useCalendarInvite";
import { z } from "zod";
import type { RSVPStatus, EventData, CalendarEvent } from "../types";

const rsvpSchema = z.object({
  event_id: z.string().uuid({ message: "Invalid event ID" }),
  fan_id: z.string().uuid({ message: "Invalid fan ID" }),
  status: z.enum(["yes", "maybe", "no"], {
    errorMap: () => ({ message: "Please select a valid RSVP status" }),
  }),
});

export const useEventRSVP = (
  event: EventData | null,
  currentFan: any,
  calendarEvent: CalendarEvent | null
) => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const { fans } = useFans();
  const { createRsvp, getRsvpByEventAndFan } = useRsvps();
  const { createFanEvent } = useFanEvents();

  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    showDialog: showCalendarDialog,
    setShowDialog: setShowCalendarDialog,
    handleCalendarInvite,
  } = useCalendarInvite({
    event: calendarEvent!,
    fanEmail: currentFan?.email,
    fanName: currentFan?.name,
    calendarOption: (event as any)?.calendarOption || "ask",
  });

  const handleRSVP = useCallback(async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to RSVP for this event.",
        variant: "destructive",
      });
      return;
    }

    if (!rsvpStatus) {
      toast({
        title: "RSVP Status Required",
        description: "Please select your RSVP status.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the current user's fan record
      const currentFanRecord = fans.find((fan) => fan.user_id === user.id);

      if (!currentFanRecord) {
        toast({
          title: "Profile Not Found",
          description: "Please complete your fan profile first.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Check if RSVP already exists
      const { data: existingRsvp } = await getRsvpByEventAndFan(
        eventId!,
        currentFanRecord.id
      );

      if (existingRsvp) {
        toast({
          title: "Already Registered",
          description: "You have already RSVP'd for this event.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate input data
      const validatedData = rsvpSchema.parse({
        event_id: eventId,
        fan_id: currentFanRecord.id,
        status: rsvpStatus,
      });

      // Create RSVP record
      const { data, error } = await createRsvp({
        event_id: validatedData.event_id,
        fan_id: validatedData.fan_id,
        status: validatedData.status,
      });

      if (error) {
        throw new Error(error);
      }

      // Create fan_event entry
      if (data && event) {
        const { error: fanEventError } = await createFanEvent({
          fan_id: currentFanRecord.id,
          event_id: eventId!,
          event_name: event.title,
          ticket_price: event.isPaid ? parseFloat(String(event.price)) : 0,
          attendance_status:
            rsvpStatus === "yes"
              ? "confirmed"
              : rsvpStatus === "maybe"
              ? "tentative"
              : "declined",
        });

        if (fanEventError) {
          console.error("Error creating fan event:", fanEventError);
        }
      }

      toast({
        title: "RSVP Confirmed!",
        description: `Your RSVP status "${rsvpStatus}" has been recorded successfully.`,
      });

      setShowConfirmation(true);

      // Trigger calendar invite based on event settings
      if (rsvpStatus === "yes" && calendarEvent) {
        handleCalendarInvite();
      }
    } catch (error: any) {
      console.error("Error creating RSVP:", error);

      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0]?.message || "Invalid input data.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to submit RSVP. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    user,
    rsvpStatus,
    eventId,
    fans,
    event,
    getRsvpByEventAndFan,
    createRsvp,
    createFanEvent,
    calendarEvent,
    handleCalendarInvite,
    toast,
  ]);

  const addToCalendar = useCallback(() => {
    if (!event || !calendarEvent) return;
    setShowCalendarDialog(true);
  }, [event, calendarEvent, setShowCalendarDialog]);

  return {
    rsvpStatus,
    setRsvpStatus,
    isSubmitting,
    showConfirmation,
    showCalendarDialog,
    setShowCalendarDialog,
    handleRSVP,
    addToCalendar,
  };
};

