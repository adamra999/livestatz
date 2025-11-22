import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  Eye,
  Copy,
  Check,
  Instagram,
  Youtube,
  Play,
  ExternalLink,
  TrendingUp,
  Zap,
  Trash2,
  Edit,
  MoreVertical,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description?: string;
    platform: string;
    date: string;
    time: string;
    rsvpCount: number;
    rsvpGoal?: number;
    isPaid: boolean;
    price?: number;
    isLive?: boolean;
    coverImage?: string;
    liveLink?: string;
    totalViews?: number;
    revenue?: number;
    organizer?: string;
  };
  variant?: "default" | "compact";
  onDelete?: (eventId: string) => void;
  onEdit?: (eventId: string) => void;
}

export function EventCard({ event, variant = "default", onDelete, onEdit }: EventCardProps) {
  const { toast } = useToast();
  const [copiedLink, setCopiedLink] = useState(false);

  const rsvpProgress = event.rsvpGoal
    ? (event.rsvpCount / event.rsvpGoal) * 100
    : 0;

  const copyLink = async () => {
    if (event.liveLink) {
      await navigator.clipboard.writeText(event.liveLink);
      setCopiedLink(true);
      toast({
        title: "Link copied!",
        description: "Event link has been copied to clipboard",
      });
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram live":
      case "instagram":
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case "youtube live":
      case "youtube":
        return <Youtube className="h-4 w-4 text-red-500" />;
      default:
        return <Play className="h-4 w-4" />;
    }
  };

  if (variant === "compact") {
    return (
      <Link to={`/events/${event.id}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-sm">{event.title}</h4>
                  {event.isLive && (
                    <Badge
                      variant="destructive"
                      className="text-xs animate-pulse"
                    >
                      🔴 LIVE
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    {getPlatformIcon(event.platform)}
                    <span>{event.platform}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="text-xs">
                  {event.rsvpCount} RSVPs
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Card className="hover:shadow-creator transition-all duration-300 border-0 bg-gradient-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-bold text-lg">{event.title}</h3>
              {event.isLive && (
                <Badge variant="destructive" className="animate-pulse">
                  🔴 LIVE
                </Badge>
              )}
              <Badge variant={event.isPaid ? "default" : "secondary"}>
                {event.isPaid ? `$${event.price}` : "Free"}
              </Badge>
            </div>

            {event.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {event.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center space-x-1">
                {getPlatformIcon(event.platform)}
                <span>{event.platform}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{event.time}</span>
              </div>
            </div>
          </div>

          {event.coverImage && (
            <div className="ml-4">
              <img
                src={event.coverImage}
                alt="Event cover"
                className="w-16 h-16 rounded-lg object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <Users className="h-5 w-5 text-primary mx-auto mb-1" />
            <div className="text-lg font-bold">{event.rsvpCount}</div>
            <div className="text-xs text-muted-foreground">RSVPs</div>
          </div>

          {event.totalViews && (
            <div className="text-center p-3 bg-secondary/10 rounded-lg">
              <Eye className="h-5 w-5 text-secondary-foreground mx-auto mb-1" />
              <div className="text-lg font-bold">
                {event.totalViews.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Views</div>
            </div>
          )}

          {event.revenue && (
            <div className="text-center p-3 bg-accent/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-accent-foreground mx-auto mb-1" />
              <div className="text-lg font-bold">
                ${event.revenue.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Revenue</div>
            </div>
          )}
        </div>

        {/* RSVP Progress */}
        {event.rsvpGoal && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>RSVP Progress</span>
              <span>{Math.round(rsvpProgress)}% of goal</span>
            </div>
            <Progress value={rsvpProgress} className="h-2" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link to={`/events/${event.id}`} className="flex-1">
            <Button size="sm" variant="default" className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>

          {event.liveLink && (
            <Button size="sm" variant="outline" onClick={copyLink}>
              {copiedLink ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          )}

          {event.isLive && (
            <Button size="sm" variant="secondary" asChild>
              <a
                href={event.liveLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Live
              </a>
            </Button>
          )}

          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(event.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Event
                  </DropdownMenuItem>
                )}
                
                {onEdit && onDelete && <DropdownMenuSeparator />}
                
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(event.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Event
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
