import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft, X, Users, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFans } from "@/hooks/useFans";
import { useToast } from "@/hooks/use-toast";
import { CalendarInviteDialog } from "@/components/calendar/CalendarInviteDialog";
import { useEventData } from "./hooks/useEventData";
import { useEventRSVP } from "./hooks/useEventRSVP";
import { useFanModal } from "./hooks/useFanModal";
import { EventHeader } from "./components/EventHeader";
import { EventDetailsCard } from "./components/EventDetailsCard";
import { AuthSection } from "./components/AuthSection";
import { RSVPStatusButtons } from "./components/RSVPStatusButtons";
import { AddFanModal } from "./components/AddFanModal";
import type { CalendarEvent } from "./types";

export const EventRSVPPage = () => {
  const { user } = useAuth();
  const { eventId } = useParams<{ eventId: string }>();
  const { toast } = useToast();
  const { event, loading } = useEventData();
  const { fans } = useFans();
  const navigate = useNavigate();

  // Get current fan
  const currentFan = fans.find((fan) => fan.user_id === user?.id);

  // Calendar invite integration
  const calendarEvent: CalendarEvent | null = event
    ? {
        title: event.title,
        description: event.description,
        location: event.location || event.platform,
        startTime: new Date(event.dateTime),
        endTime: event.duration
          ? new Date(
              new Date(event.dateTime).getTime() +
                parseInt(event.duration) * 60000
            )
          : undefined,
        url: event.link || event.eventUrl,
        organizer: event.organizer
          ? {
              name: event.organizer,
              email: event.organizerEmail || "events@livestatz.app",
            }
          : undefined,
      }
    : null;

  const {
    rsvpStatus,
    setRsvpStatus,
    isSubmitting,
    showConfirmation,
    showCalendarDialog,
    setShowCalendarDialog,
    handleRSVP,
    addToCalendar,
  } = useEventRSVP(event, currentFan, calendarEvent);

  const {
    showAddFanModal,
    setShowAddFanModal,
    fanName,
    setFanName,
    fanEmail,
    setFanEmail,
  } = useFanModal();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <X className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Event Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <EventHeader event={event} />

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Welcome Section - Only for signed-in users */}
        {user && (
          <Card className="bg-gradient-card border-0 shadow-creator mb-6">
            <CardHeader className="py-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    Welcome back,{" "}
                    {user?.user_metadata?.full_name
                      ? user?.user_metadata?.full_name
                      : "Creator"}
                    ! 🚀
                  </CardTitle>
                  <CardDescription>
                    You're viewing this event RSVP page
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        <EventDetailsCard event={event} />

        {/* RSVP Form */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">RSVP for this Event</h3>

              {/* Login Section - Only shown when user is not signed in */}
              {!user && <AuthSection />}

              {/* RSVP Status */}
              <RSVPStatusButtons
                rsvpStatus={rsvpStatus}
                onStatusChange={setRsvpStatus}
                showConfirmation={showConfirmation}
              />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleRSVP}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit RSVP"
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={addToCalendar}
                  className="flex-1 sm:flex-none transition-all duration-200 hover:scale-[1.02] hover:bg-primary/5 hover:border-primary/30"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Calendar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Stats */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                <Users className="h-4 w-4 mr-2" />
                {event.currentAttendees} people are attending
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Fan Modal */}
      <AddFanModal
        open={showAddFanModal}
        onOpenChange={setShowAddFanModal}
        event={event}
        eventId={eventId!}
        user={user}
        fanName={fanName}
        setFanName={setFanName}
        fanEmail={fanEmail}
        setFanEmail={setFanEmail}
      />

      {/* Calendar Invite Dialog */}
      {calendarEvent && (
        <CalendarInviteDialog
          open={showCalendarDialog}
          onOpenChange={setShowCalendarDialog}
          event={calendarEvent}
          fanEmail={currentFan?.email}
          fanName={currentFan?.name}
          onConfirm={() => {
            toast({
              title: "Calendar event added",
              description: "The event has been added to your calendar",
            });
          }}
        />
      )}
    </div>
  );
};

