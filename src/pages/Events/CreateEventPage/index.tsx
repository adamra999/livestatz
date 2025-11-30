import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useEventForm } from "./hooks/useEventForm";
import { EventDetailsSection, StepValidationRef } from "./components/EventDetailsSection";
import { PlatformsSection } from "./components/PlatformsSection";
import { RSVPSection } from "./components/RSVPSection";
import { MonetizationSection } from "./components/MonetizationSection";
import { ReviewSection } from "./components/ReviewSection";
import { Stepper } from "@/components/ui/stepper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CreateEventPageProps } from "./types";
import { useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { useCreatorSettings } from "@/pages/Profile/hooks/useCreatorSettings";
import { generateSampleEventData, SAMPLE_EVENTS } from "./utils/sampleData";

const STEPS = [
  "Event Details",
  "Live Platforms",
  "RSVP & Reminders",
  "Monetization",
  "Review & Publish",
];

export default function CreateEventPage({
  onClose,
  embedded = false,
  onSuccess,
}: CreateEventPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const stepRefs = useRef<(StepValidationRef | null)[]>([null, null, null, null]);
  
  const {
    formData,
    isCreating,
    isLoading,
    isEditMode,
    updateFormField,
    handleCreateEvent,
    handleCancel,
    loadSampleData,
  } = useEventForm(embedded, onSuccess, onClose);

  const { platforms: creatorPlatforms } = useCreatorSettings();

  const validateCurrentStep = () => {
    const currentRef = stepRefs.current[currentStep];
    if (currentRef && !currentRef.validate()) {
      let errorMessage = "Please fill in all required fields";
      
      if (currentStep === 0) {
        errorMessage = "Please enter event title, date, and start time";
      } else if (currentStep === 1) {
        errorMessage = "Please select at least one platform";
      } else if (currentStep === 3) {
        if (formData.isPaid && (!formData.price || parseFloat(formData.price) <= 0)) {
          errorMessage = "Please enter a valid ticket price";
        } else if (formData.acceptTips && !formData.paymentHandle.trim()) {
          errorMessage = "Please enter your payment handle";
        }
      }
      
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handlePublish = async () => {
    await handleCreateEvent();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p>Loading event data...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        embedded ? "" : "min-h-screen"
      } bg-background text-foreground flex flex-col`}
    >
      {/* Header */}
      <header
        className={`p-4 border-b bg-card ${
          embedded ? "" : "sticky top-0 z-10"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">
            {isEditMode ? "Edit Event" : "Create New Event"}
          </h1>
          {!isEditMode && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Load Sample Data
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => loadSampleData(SAMPLE_EVENTS.default())}>
                  Default Event
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => loadSampleData(SAMPLE_EVENTS.free())}>
                  Free Community Event
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => loadSampleData(SAMPLE_EVENTS.paid())}>
                  Paid Masterclass
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => loadSampleData(SAMPLE_EVENTS.private())}>
                  Private VIP Event
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => loadSampleData(SAMPLE_EVENTS.multiPlatform())}>
                  Multi-Platform Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          className="max-w-4xl mx-auto"
        />
      </header>

      {/* Form */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="max-w-2xl mx-auto">
          {currentStep === 0 && (
            <EventDetailsSection
              ref={(el) => (stepRefs.current[0] = el)}
              formData={formData}
              onFieldChange={updateFormField}
            />
          )}

          {currentStep === 1 && (
            <PlatformsSection
              ref={(el) => (stepRefs.current[1] = el)}
              formData={formData}
              onFieldChange={updateFormField}
              creatorPlatforms={{
                instagram: creatorPlatforms.instagram,
                tiktok: creatorPlatforms.tiktok,
                youtube: creatorPlatforms.youtube,
                twitch: creatorPlatforms.twitch,
                facebook: creatorPlatforms.facebook,
              }}
            />
          )}

          {currentStep === 2 && (
            <RSVPSection
              ref={(el) => (stepRefs.current[2] = el)}
              formData={formData}
              onFieldChange={updateFormField}
            />
          )}

          {currentStep === 3 && (
            <MonetizationSection
              ref={(el) => (stepRefs.current[3] = el)}
              formData={formData}
              onFieldChange={updateFormField}
            />
          )}

          {currentStep === 4 && (
            <ReviewSection formData={formData} onEditStep={setCurrentStep} />
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row-reverse gap-3 pt-6 border-t mt-6">
            {currentStep < STEPS.length - 1 ? (
              <>
                <Button onClick={handleNext} className="flex-1 py-3" disabled={isCreating}>
                  Next →
                </Button>
                {currentStep > 0 && (
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    className="flex-1 py-3"
                    disabled={isCreating}
                  >
                    ← Previous
                  </Button>
                )}
              </>
            ) : (
              <Button
                onClick={handlePublish}
                className="flex-1 py-3"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "🎉 Publish Event"
                )}
              </Button>
            )}
            
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 py-3"
              disabled={isCreating}
            >
              Cancel
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

