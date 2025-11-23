import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { generateICS, type CalendarEvent } from "@/lib/calendar-utils";
import { toast } from "@/hooks/use-toast";

interface UseCalendarInviteProps {
  event: CalendarEvent;
  fanEmail?: string;
  fanName?: string;
  calendarOption?: "auto" | "ask" | "none";
}

export const useCalendarInvite = ({
  event,
  fanEmail,
  fanName,
  calendarOption = "ask",
}: UseCalendarInviteProps) => {
  const [isSending, setIsSending] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const sendCalendarInvite = useCallback(async () => {
    if (!fanEmail) {
      console.log("No email provided, skipping calendar invite");
      return;
    }

    setIsSending(true);
    try {
      const icsContent = generateICS(event);

      const { error } = await supabase.functions.invoke("send-calendar-invite", {
        body: {
          to: fanEmail,
          eventTitle: event.title,
          eventDescription: event.description,
          eventLocation: event.location,
          startTime: event.startTime.toISOString(),
          endTime: event.endTime?.toISOString(),
          icsContent: icsContent,
          fanName: fanName,
          eventUrl: event.url,
        },
      });

      if (error) throw error;

      toast({
        title: "Calendar invite sent!",
        description: "Check your email for the calendar file",
      });
    } catch (error) {
      console.error("Error sending calendar invite:", error);
      toast({
        title: "Failed to send calendar invite",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  }, [event, fanEmail, fanName]);

  const handleCalendarInvite = useCallback(() => {
    if (calendarOption === "none") {
      console.log("Calendar invites disabled");
      return;
    }

    if (calendarOption === "auto") {
      sendCalendarInvite();
    } else if (calendarOption === "ask") {
      setShowDialog(true);
    }
  }, [calendarOption, sendCalendarInvite]);

  return {
    isSending,
    showDialog,
    setShowDialog,
    sendCalendarInvite,
    handleCalendarInvite,
  };
};
