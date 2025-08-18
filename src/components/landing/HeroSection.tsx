import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Crown, Play, Users, TrendingUp, Sparkles, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulate sending email to adam.mailme@gmail.com
    try {
      // In a real implementation, you'd send this to your backend
      console.log("Sending email to adam.mailme@gmail.com:", email);
      
      toast({
        title: "Thanks for your interest!",
        description: "We'll be in touch soon with early access.",
      });
      
      setShowEmailDialog(false);
      setEmail("");
      onGetStarted();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Clean background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/20 to-primary/5"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Brand Logo */}
          <div className="mb-8">
            <img 
              src="/lovable-uploads/def4dcb4-fadf-44a9-9165-7dc152e72c4b.png" 
              alt="LiveStatz - Social Growth" 
              className="h-48 w-auto mx-auto mb-8"
            />
          </div>

          <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8 border border-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            Social events for influencers
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
            One platform{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              for all your events
            </span>{" "}
            - meetups, drops, collabs, and livestreams.
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-4 h-auto font-medium shadow-creator"
              onClick={() => setShowEmailDialog(true)}
            >
              Start Building Your Community
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground mb-12">
            No credit card required
          </div>
          
          {/* App Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
              <img 
                src="/lovable-uploads/a9048a85-bb95-4514-b115-e3c11f9d0bca.png" 
                alt="LiveStatz events dashboard showing event management, RSVP tracking, and analytics" 
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Email Capture Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Get Early Access</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Get Early Access"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};