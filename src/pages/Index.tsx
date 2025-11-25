import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { ValuePropositionSection } from "@/components/landing/ValuePropositionSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CreatorFeaturesSection } from "@/components/landing/CreatorFeaturesSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { StatsSection } from "@/components/landing/StatsSection";
import { CalendarView } from "@/components/calendar/CalendarView";
import { AnalyticsView } from "@/components/analytics/AnalyticsView";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { EventCard } from "@/components/events/EventCard";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useEvents } from "@/hooks/useEvents";
import Dashboard from "./Dashboard";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  const navigate = useNavigate();
  console.log("Index component rendering...");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { profile, setProfile } = useUserProfile();
  // if (isAuthenticated || isLoggedIn || profile?.email) {
  //   // navigate(`/e/${"f927f03d-ca98-47f7-a197-1931a94b6f80"}`);
  //   debugger;
  //   if (location?.pathname != "/") {
  //     navigate(`/dashboard`);
  //   }

  //   // return <Dashboard />;
  // }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        onGetStarted={(user) => {
          setIsLoggedIn(true);
          setProfile(user);
        }}
      />
      <ProblemSection />
      <ValuePropositionSection />
      <HowItWorksSection />
      <CreatorFeaturesSection />
      <div id="features">
        <FeatureGrid />
      </div>
      <StatsSection />

      {/* Simple CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto text-center">
          <div className="bg-primary/5 border border-primary/10 p-12 rounded-2xl max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Ready to organize your creator workflow?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of creators who've streamlined their content
              planning
            </p>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              onClick={() => setIsLoggedIn(true)}
            >
              Try LiveStatz - It's Free
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              No credit card required
            </p>
          </div>
        </div>
      </section>
      <Toaster />
    </div>
  );
};

export default Index;
