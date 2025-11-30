import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { BasicInfoSection, type BasicInfoSectionRef } from "./components/BasicInfoSection";
import { ConnectedPlatformsSection } from "./components/ConnectedPlatformsSection";
import { EventsAutomationSection } from "./components/EventsAutomationSection";
import { SecuritySection } from "./components/SecuritySection";
import { DeleteAccountSection } from "./components/DeleteAccountSection";
import { useCreatorSettings } from "./hooks/useCreatorSettings";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";

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
  const basicInfoRef = useRef<BasicInfoSectionRef>(null);

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Basic Info
        if (basicInfoRef.current) {
          return basicInfoRef.current.validate();
        }
        return false;
      case 1: // Platforms
        const hasAtLeastOnePlatform = Object.values(creatorSettings.platforms).some(
          (value) => value && value.trim() !== ""
        );
        if (!hasAtLeastOnePlatform) {
          toast.error("Please connect at least one platform to continue");
          return false;
        }
        return true;
      case 2: // Automation - optional, always valid
        return true;
      case 3: // Security - optional, always valid
        return true;
      case 4: // Account - no validation needed
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }
    
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

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Complete your profile setup by following these steps.
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="shrink-0"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Stepper */}
      <div className="mb-12">
        <Stepper steps={STEPS} currentStep={currentStep} onStepClick={handleStepClick} />
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 0 && <BasicInfoSection ref={basicInfoRef} />}
        
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
