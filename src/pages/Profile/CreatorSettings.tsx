import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BasicInfoSection } from "./components/BasicInfoSection";
import { ConnectedPlatformsSection } from "./components/ConnectedPlatformsSection";
import { EventsAutomationSection } from "./components/EventsAutomationSection";
import { SecuritySection } from "./components/SecuritySection";
import { DeleteAccountSection } from "./components/DeleteAccountSection";

const CreatorSettings = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account details and connected platforms.
        </p>
      </div>

      <div className="space-y-8">
        {/* Basic Info Section */}
        <BasicInfoSection />

        <Separator />

        {/* Connected Platforms Section */}
        <ConnectedPlatformsSection />

        <Separator />

        {/* Events & Automation Section */}
        <EventsAutomationSection />

        <Separator />

        {/* Security Section */}
        <SecuritySection />

        <Separator />

        {/* Delete Account Section */}
        <DeleteAccountSection />
      </div>

      {/* Back button */}
      <div className="mt-8">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default CreatorSettings;
