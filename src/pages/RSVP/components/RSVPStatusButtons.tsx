import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import type { RSVPStatus } from "../types";

interface RSVPStatusButtonsProps {
  rsvpStatus: RSVPStatus;
  onStatusChange: (status: RSVPStatus) => void;
  showConfirmation: boolean;
}

export const RSVPStatusButtons = ({
  rsvpStatus,
  onStatusChange,
  showConfirmation,
}: RSVPStatusButtonsProps) => {
  return (
    <div className="space-y-4">
      <Label>RSVP Status *</Label>
      <div className="grid grid-cols-1 gap-3">
        <Button
          variant={rsvpStatus === "yes" ? "default" : "outline"}
          onClick={() => onStatusChange("yes")}
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
          onClick={() => onStatusChange("maybe")}
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
          onClick={() => onStatusChange("no")}
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
  );
};

