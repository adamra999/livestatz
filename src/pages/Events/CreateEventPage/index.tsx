import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEventForm } from "./hooks/useEventForm";
import { BasicInfoSection } from "./components/BasicInfoSection";
import { PaymentSection } from "./components/PaymentSection";
import type { CreateEventPageProps } from "./types";

export default function CreateEventPage({
  onClose,
  embedded = false,
  onSuccess,
}: CreateEventPageProps) {
  const {
    formData,
    isCreating,
    isLoading,
    isEditMode,
    urlError,
    updateFormField,
    validateUrl,
    handleCreateEvent,
    handleCancel,
  } = useEventForm(embedded, onSuccess, onClose);

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
        <h1 className="text-xl font-semibold text-center">
          {isEditMode ? "Edit Event" : "Create Live Event"}
        </h1>
      </header>

      {/* Form */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <BasicInfoSection
          formData={formData}
          urlError={urlError}
          onFieldChange={updateFormField}
          onUrlBlur={validateUrl}
        />

        <PaymentSection formData={formData} onFieldChange={updateFormField} />

        {/* Submit */}
        <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4">
          <Button
            onClick={handleCreateEvent}
            className="flex-1 py-3"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              isEditMode ? "Update Event" : "Create Event"
            )}
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1 py-3"
            disabled={isCreating}
          >
            Cancel
          </Button>
        </div>
      </main>
    </div>
  );
}

