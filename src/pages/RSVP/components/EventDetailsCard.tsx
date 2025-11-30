import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Users, Mail } from "lucide-react";
import { format } from "date-fns";
import type { EventData } from "../types";

interface EventDetailsCardProps {
  event: EventData;
}

export const EventDetailsCard = ({ event }: EventDetailsCardProps) => {
  return (
    <Card className="mb-8 overflow-hidden">
      {event.coverImage && (
        <div className="w-full h-48 sm:h-56 md:h-72 lg:h-80 overflow-hidden">
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="space-y-4">
          <div>
            <CardTitle className="text-3xl mb-2">{event.title}</CardTitle>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
            {event.isPaid && (
              <Badge
                variant="default"
                className="bg-yellow-500 text-yellow-900"
              >
                ${event.price} Ticket
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Event Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Date & Time</p>
                <p className="text-muted-foreground">
                  {format(new Date(event.dateTime), "M/d/yyyy, h:mm:ss a")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-muted-foreground">{event.location}</p>
                <p className="text-sm text-muted-foreground">
                  {event.platform}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Attendees</p>
                <p className="text-muted-foreground">
                  {event.currentAttendees} of {event.maxAttendees} registered
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Organizer</p>
                <p className="text-muted-foreground">
                  {event.creatorName || event.organizer}
                  {event.creatorHandle && (
                    <span className="text-primary ml-1">
                      @{event.creatorHandle}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />
      </CardContent>
    </Card>
  );
};

