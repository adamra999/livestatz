import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFans } from "@/hooks/useFans";
import { useFanEvents } from "@/hooks/useFanEvents";
import { z } from "zod";
import type { EventData } from "../types";

interface AddFanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: EventData | null;
  eventId: string;
  user: any;
  fanName: string;
  setFanName: (name: string) => void;
  fanEmail: string;
  setFanEmail: (email: string) => void;
  onSuccess?: () => void;
}

export const AddFanModal = ({
  open,
  onOpenChange,
  event,
  eventId,
  user,
  fanName,
  setFanName,
  fanEmail,
  setFanEmail,
  onSuccess,
}: AddFanModalProps) => {
  const { toast } = useToast();
  const { createFan, fetchFans } = useFans();
  const { createFanEvent } = useFanEvents();

  const handleAddFan = async () => {
    if (!user || !eventId) return;

    // Validate fan data
    const fanSchema = z.object({
      name: z
        .string()
        .trim()
        .min(1, "Name is required")
        .max(100, "Name must be less than 100 characters"),
      email: z
        .string()
        .trim()
        .email("Invalid email address")
        .max(255, "Email must be less than 255 characters"),
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
          ticket_price: event.isPaid ? parseFloat(String(event.price)) : 0,
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

      onOpenChange(false);
      await fetchFans();
      onSuccess?.();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};

