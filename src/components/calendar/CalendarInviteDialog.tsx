import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Mail } from "lucide-react";
import { generateICS, downloadICS, generateCalendarLinks, type CalendarEvent } from "@/lib/calendar-utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CalendarInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: CalendarEvent;
  fanEmail?: string;
  fanName?: string;
  onConfirm?: () => void;
}

export const CalendarInviteDialog = ({
  open,
  onOpenChange,
  event,
  fanEmail,
  fanName,
  onConfirm,
}: CalendarInviteDialogProps) => {
  const [isSending, setIsSending] = useState(false);
  const icsContent = generateICS(event);
  const calendarLinks = generateCalendarLinks(event);

  const handleDownloadICS = () => {
    const filename = `${event.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
    downloadICS(icsContent, filename);
    toast({
      title: "Calendar file downloaded",
      description: "Open the file to add the event to your calendar",
    });
    onConfirm?.();
  };

  const handleSendEmail = async () => {
    if (!fanEmail) {
      toast({
        title: "Email required",
        description: "Please provide an email address",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
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
      onConfirm?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error sending calendar invite:", error);
      toast({
        title: "Failed to send invite",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Add to Calendar
          </DialogTitle>
          <DialogDescription>
            Choose how you'd like to add this event to your calendar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Quick Add Buttons */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Quick Add:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(calendarLinks.google, "_blank")}
                className="w-full"
              >
                Google Calendar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(calendarLinks.outlook, "_blank")}
                className="w-full"
              >
                Outlook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(calendarLinks.office365, "_blank")}
                className="w-full"
              >
                Office 365
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(calendarLinks.yahoo, "_blank")}
                className="w-full"
              >
                Yahoo
              </Button>
            </div>
          </div>

          {/* Or Options */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Download/Email Options */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDownloadICS}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Calendar File (.ics)
            </Button>

            {fanEmail && (
              <Button
                className="w-full"
                onClick={handleSendEmail}
                disabled={isSending}
              >
                <Mail className="h-4 w-4 mr-2" />
                {isSending ? "Sending..." : "Email Calendar Invite"}
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            The .ics file works with most calendar applications
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
