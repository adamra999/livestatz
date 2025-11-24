import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import livestatzLogo from "@/assets/livestatz-logo.svg";
import type { EventData } from "../types";

interface EventHeaderProps {
  event: EventData;
}

export const EventHeader = ({ event }: EventHeaderProps) => {
  return (
    <header className="bg-gradient-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={livestatzLogo} alt="LiveStatz" className="h-8 w-8" />
            <div>
              <h1 className="font-semibold text-lg">LiveStatz</h1>
              <p className="text-white/80 text-sm">Event RSVP</p>
            </div>
          </div>
          {event?.organizer && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/80 hidden sm:inline">
                Hosted by
              </span>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-white/20">
                  <AvatarImage src={event.organizerAvatar} />
                  <AvatarFallback className="bg-white/20 text-white text-xs">
                    {event.organizer.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{event.organizer}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

