import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Play, Users, TrendingUp } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
          <Play className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
          <Users className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '2s' }}>
        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto">
        <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
          <Crown className="h-4 w-4 mr-2" />
          The Ultimate Creator Platform
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Transform Your
          <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            Creator Journey
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
          The all-in-one platform for influencers to manage RSVPs, schedule content, 
          track analytics, and monetize their audience like never before.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3 h-auto font-semibold shadow-glow"
            onClick={onGetStarted}
          >
            Start Free Trial
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white/10 text-lg px-8 py-3 h-auto"
          >
            Watch Demo
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">10K+</div>
            <div className="text-white/80">Active Creators</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">500K+</div>
            <div className="text-white/80">RSVPs Managed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">$2M+</div>
            <div className="text-white/80">Creator Revenue</div>
          </div>
        </div>
      </div>
    </section>
  );
};