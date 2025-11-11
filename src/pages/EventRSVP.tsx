import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import { useFans } from "@/hooks/useFans";
import { useRsvps } from "@/hooks/useRsvps";
import { useFanEvents } from "@/hooks/useFanEvents";
import { z } from "zod";

import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Plus,
  Check,
  X,
  HelpCircle,
  Mail,
  Loader2,
  UserPlus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

// Mock event data - in a real app, this would come from your backend/Supabase
const mockEvents = {
  abc123: {
    id: "abc123",
    title: "Team Building Workshop",
    description:
      "Join us for an interactive team building session with fun activities and networking opportunities.",
    dateTime: "2025-08-15T14:30:00",
    platform: "In-Person",
    location: "Conference Room A",
    isPaid: true,
    price: 25,
    organizer: "Sarah Johnson",
    organizerAvatar: "",
    maxAttendees: 50,
    currentAttendees: 23,
    tags: ["Team Building", "Networking", "Workshop"],
  },
  def456: {
    id: "def456",
    title: "Digital Marketing Masterclass",
    description:
      "Learn advanced digital marketing strategies from industry experts. Covers SEO, social media, and conversion optimization.",
    dateTime: "2025-09-20T18:00:00",
    platform: "Zoom",
    location: "Online",
    isPaid: true,
    price: 15,
    organizer: "Mike Chen",
    organizerAvatar: "",
    maxAttendees: 100,
    currentAttendees: 67,
    tags: ["Marketing", "Digital", "Education"],
  },
};

export const EventRSVPPage = () => {
  const { user } = useAuth();
  const { fetchEventById } = useEvents();
  const { eventId } = useParams<{ eventId: string }>();
  const { toast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<"yes" | "maybe" | "no" | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showAddFanModal, setShowAddFanModal] = useState(false);
  const [fanName, setFanName] = useState("");
  const [fanEmail, setFanEmail] = useState("");
  const navigate = useNavigate();
  const { createFan, fans, fetchFans } = useFans();
  const { createRsvp, getRsvpByEventAndFan } = useRsvps();
  const { createFanEvent } = useFanEvents();

  // Validation schema
  const rsvpSchema = z.object({
    event_id: z.string().uuid({ message: "Invalid event ID" }),
    fan_id: z.string().uuid({ message: "Invalid fan ID" }),
    status: z.enum(["yes", "maybe", "no"], {
      errorMap: () => ({ message: "Please select a valid RSVP status" }),
    }),
  });

  useEffect(() => {
    const loadEvent = async () => {
      if (eventId) {
        setLoading(true);
        const eventData = await fetchEventById(eventId);
        setEvent({ ...mockEvents, ...eventData });
        setLoading(false);
      }
    };
    loadEvent();
  }, [eventId, fetchEventById]);

  // Check if current user is in fans table
  useEffect(() => {
    if (user && fans && fans?.length == 0) {
      const userInFans = fans.find((fan) => fan.user_id === user.id);
      if (!userInFans) {
        // User is authenticated but not in fans table
        setFanName(user.user_metadata?.full_name || "");
        setFanEmail(user.email || "");
        setShowAddFanModal(true);
      }
    }
  }, [user, fans]);
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading event...</div>
        </div>
      </div>
    );
  }

  // useEffect(() => {
  //   // Check if user is already logged in
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     if (session) {
  //       // navigate("/");
  //       // navigate(`/e/${"f927f03d-ca98-47f7-a197-1931a94b6f80"}`);
  //     }
  //   });

  //   // Listen for auth changes
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange(async (event, session) => {
  //     if (session && event === "SIGNED_IN" && session?.user) {
  //       const user = session.user;
  //       createUser({
  //         id: user.id,
  //         name:
  //           user.user_metadata?.full_name || user.user_metadata?.name || null,
  //         avatar: user.user_metadata?.avatar_url || null,
  //         email: user.email,
  //         role: "fan",
  //       });
  //       // upsert user row (id = auth user id)
  //       // await supabase.from<any>("users").upsert({
  //       //   id: user.id,
  //       //   email: user.email,
  //       //   name:
  //       //     user.user_metadata?.full_name || user.user_metadata?.name || null,
  //       //   avatar: user.user_metadata?.avatar_url || null,
  //       // });
  //       // navigate("/");
  //       // navigate(`/e/${"f927f03d-ca98-47f7-a197-1931a94b6f80"}`);
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, [navigate]);
  // useEffect(() => {
  //   // Simulate loading event data
  //   setTimeout(() => {
  //     if (eventId && mockEvents[eventId as keyof typeof mockEvents]) {
  //       setEvent(mockEvents[eventId as keyof typeof mockEvents]);
  //     } else {
  //       // Create a dynamic event if not found in mock data (for newly created events)
  //       setEvent({
  //         id: eventId,
  //         title: "Sample Event",
  //         description:
  //           "This is a sample event description with all the details you need to know.",
  //         dateTime: "2025-08-15T14:30:00",
  //         platform: "Online",
  //         location: "Zoom Meeting",
  //         isPaid: false,
  //         price: 0,
  //         organizer: "Event Organizer",
  //         organizerAvatar: "",
  //         maxAttendees: 100,
  //         currentAttendees: 45,
  //         tags: ["Live Event", "Interactive", "Community"],
  //       });
  //     }
  //     setLoading(false);
  //   }, 1000);
  // }, [eventId]);

  const handleRSVP = async () => {
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
      const currentFan = fans.find((fan) => fan.user_id === user.id);
      
      if (!currentFan) {
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
        currentFan.id
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
        fan_id: currentFan.id,
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
          fan_id: currentFan.id,
          event_id: eventId!,
          event_name: event.title,
          ticket_price: event.isPaid ? parseFloat(event.price) : 0,
          attendance_status: rsvpStatus === "yes" ? "confirmed" : rsvpStatus === "maybe" ? "tentative" : "declined",
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
  };

  const handleGoogleLogin = () => {
    // In a real app, this would integrate with Supabase auth
    toast({
      title: "Google Login",
      description: "Google authentication would be handled here via Supabase.",
    });
  };
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name, // 👈 custom user metadata
          },
        },
      });

      if (error) throw error;
      await createFan({ id: data?.user?.id, name, email: data?.user?.email });
      toast({
        title: "Success!",
        description: "Check your email for the confirmation link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFan = async () => {
    if (!user || !eventId) return;
    
    // Validate fan data
    const fanSchema = z.object({
      name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
      email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
    });

    try {
      const validatedFanData = fanSchema.parse({
        name: fanName,
        email: fanEmail,
      });

      const fanData = await createFan({
        id: user.id,
        name: validatedFanData.name,
        email: validatedFanData.email,
      });

      if (!fanData) {
        throw new Error("Failed to create fan record");
      }

      // Create fan_event entry
      if (event) {
        const { error: fanEventError } = await createFanEvent({
          fan_id: fanData.id,
          event_id: eventId,
          event_name: event.title,
          ticket_price: event.isPaid ? parseFloat(event.price) : 0,
          attendance_status: "registered",
        });

        if (fanEventError) {
          console.error("Error creating fan event:", fanEventError);
        }
      }

      toast({
        title: "Success!",
        description: "You have been registered for this event.",
      });

      setShowAddFanModal(false);
      await fetchFans();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0]?.message || "Invalid input data.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setGoogleLoading(false);
    }
  };
  const addToCalendar = () => {
    if (!event) return;

    const startDate = new Date(event.dateTime);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const meetingLink = event.link ? `\n\nMeeting Link: ${event.link}` : '';
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${formatDate(startDate)}/${formatDate(
      endDate
    )}&details=${encodeURIComponent(
      event.description + meetingLink
    )}&location=${encodeURIComponent(event.location || event.platform)}`;

    window.open(calendarUrl, "_blank");
  };

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
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Welcome Section - Only for signed-in users */}
        {user && (
          <Card className="bg-gradient-card border-0 shadow-creator mb-6">
            <CardHeader className="py-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl ">
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
        {/* Event Details */}
        <Card className="mb-8">
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
                      {event.currentAttendees} of {event.maxAttendees}{" "}
                      registered
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Organizer</p>
                    <p className="text-muted-foreground">{event.organizer}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* RSVP Form */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">RSVP for this Event</h3>

              {/* Login Section - Only shown when user is not signed in */}
              {!user && (
                <>
                  {/* Google Login */}
                  <div>
                    <Button
                      onClick={handleGoogleSignIn}
                      disabled={googleLoading}
                      variant="outline"
                      className="w-full"
                    >
                      {googleLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      )}
                      Continue with Google
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="signin">Sign In</TabsTrigger>
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin">
                      <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signin-email">Email</Label>
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signin-password">Password</Label>
                          <Input
                            id="signin-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            "Sign In"
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="signup">
                      <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name">Name</Label>
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <Input
                            id="signup-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            "Sign Up"
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>

                  <Separator />
                </>
              )}


              {/* RSVP Status */}
              <div className="space-y-4">
                <Label>RSVP Status *</Label>
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant={rsvpStatus === "yes" ? "default" : "outline"}
                    onClick={() => setRsvpStatus("yes")}
                    className={`justify-start h-auto p-4 transition-all duration-200 hover:scale-[1.02] ${
                      rsvpStatus === "yes"
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25"
                        : "hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 mr-3 rounded-full border-2 flex items-center justify-center ${
                        rsvpStatus === "yes"
                          ? "border-white bg-white"
                          : "border-green-600"
                      }`}
                    >
                      {rsvpStatus === "yes" && (
                        <Check className="h-3 w-3 text-blue-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Yes, I'll attend</div>
                      <div
                        className={`text-sm ${
                          rsvpStatus === "yes"
                            ? "text-blue-100"
                            : "text-muted-foreground"
                        }`}
                      >
                        Count me in!
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant={rsvpStatus === "maybe" ? "default" : "outline"}
                    onClick={() => setRsvpStatus("maybe")}
                    className={`justify-start h-auto p-4 transition-all duration-200 hover:scale-[1.02] ${
                      rsvpStatus === "maybe"
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25"
                        : "hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 mr-3 rounded-full border-2 flex items-center justify-center ${
                        rsvpStatus === "maybe"
                          ? "border-white bg-white"
                          : "border-yellow-600"
                      }`}
                    >
                      {rsvpStatus === "maybe" && (
                        <Check className="h-3 w-3 text-blue-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Maybe</div>
                      <div
                        className={`text-sm ${
                          rsvpStatus === "maybe"
                            ? "text-blue-100"
                            : "text-muted-foreground"
                        }`}
                      >
                        I'm interested but not sure yet
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant={rsvpStatus === "no" ? "default" : "outline"}
                    onClick={() => setRsvpStatus("no")}
                    className={`justify-start h-auto p-4 transition-all duration-200 hover:scale-[1.02] ${
                      rsvpStatus === "no"
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25"
                        : "hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 mr-3 rounded-full border-2 flex items-center justify-center ${
                        rsvpStatus === "no"
                          ? "border-white bg-white"
                          : "border-red-600"
                      }`}
                    >
                      {rsvpStatus === "no" && (
                        <Check className="h-3 w-3 text-blue-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">No, I can't attend</div>
                      <div
                        className={`text-sm ${
                          rsvpStatus === "no"
                            ? "text-blue-100"
                            : "text-muted-foreground"
                        }`}
                      >
                        Thanks for the invite
                      </div>
                    </div>
                  </Button>
                </div>

                {/* Confirmation Message */}
                {showConfirmation && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-green-800 font-medium">
                        RSVP submitted successfully!
                      </span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      You'll receive a confirmation email shortly.
                    </p>
                  </div>
                )}
              </div>

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
      <Dialog open={showAddFanModal} onOpenChange={setShowAddFanModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Complete Your Profile
            </DialogTitle>
            <DialogDescription>
              You're signed in but not registered as a fan yet. Please complete
              your profile to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fan-name">Name</Label>
              <Input
                id="fan-name"
                type="text"
                placeholder="Your full name"
                value={fanName}
                onChange={(e) => setFanName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fan-email">Email</Label>
              <Input
                id="fan-email"
                type="email"
                placeholder="you@example.com"
                value={fanEmail}
                onChange={(e) => setFanEmail(e.target.value)}
                required
              />
            </div>
            <Button onClick={handleAddFan} className="w-full">
              Add to Fans Database
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
