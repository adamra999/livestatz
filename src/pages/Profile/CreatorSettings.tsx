import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { BasicInfoSection } from "./components/BasicInfoSection";
import { ConnectedPlatformsSection } from "./components/ConnectedPlatformsSection";
import { EventsAutomationSection } from "./components/EventsAutomationSection";
import { SecuritySection } from "./components/SecuritySection";
import { DeleteAccountSection } from "./components/DeleteAccountSection";
import { useCreatorSettings } from "./hooks/useCreatorSettings";
import { ArrowLeft, ArrowRight } from "lucide-react";

const STEPS = [
  "Basic Info",
  "Platforms",
  "Automation",
  "Security",
  "Account"
];

const CreatorSettings = () => {
  const navigate = useNavigate();
  const creatorSettings = useCreatorSettings();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Complete your profile setup by following these steps.
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-12">
        <Stepper steps={STEPS} currentStep={currentStep} />
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 0 && <BasicInfoSection />}
        
        {currentStep === 1 && (
          <ConnectedPlatformsSection 
            platforms={creatorSettings.platforms}
            setPlatforms={creatorSettings.setPlatforms}
            savePlatforms={creatorSettings.savePlatforms}
            disconnectPlatform={creatorSettings.disconnectPlatform}
            loading={creatorSettings.loading}
          />
        )}
        
        {currentStep === 2 && (
          <EventsAutomationSection 
            settings={creatorSettings.automation}
            setSettings={creatorSettings.setAutomation}
            saveSettings={creatorSettings.saveAutomation}
            loading={creatorSettings.loading}
          />
        )}
        
        {currentStep === 3 && (
          <SecuritySection 
            twoFactorEnabled={creatorSettings.twoFactorEnabled}
            save2FA={creatorSettings.save2FA}
            loading={creatorSettings.loading}
          />
        )}
        
        {currentStep === 4 && <DeleteAccountSection />}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-8 border-t border-border">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep < STEPS.length - 1 ? (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleFinish}>
            Finish
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreatorSettings;
