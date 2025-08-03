import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Play, Users, TrendingUp, Sparkles, Calendar } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Clean background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/20 to-primary/5"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8 border border-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            A better creator planner
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
            CreatorFlow helps you{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              organize events
            </span>{" "}
            and plan your content in a beautiful and simple app.
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-4 h-auto font-medium shadow-creator"
              onClick={onGetStarted}
            >
              Try CreatorFlow - It's Free
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground mb-12">
            No credit card required
          </div>
          
          {/* App Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl shadow-2xl border border-border p-6">
              <div className="bg-muted/50 rounded-xl h-96 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Beautiful app preview coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};