import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, ExternalLink, Gift, Heart, Mail, Check } from "lucide-react";

interface BioLink {
  id: string;
  title: string;
  url: string;
  type: 'rsvp' | 'tip' | 'merch' | 'calendar' | 'custom';
}

export default function BioPage() {
  const { username } = useParams();
  const { toast } = useToast();
  const [rsvpStatus, setRsvpStatus] = useState<'going' | 'maybe' | 'not-going' | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Mock data - in real app, this would come from API based on username
  const bioData = {
    title: "💥 Join My Next Live — Aug 8 @ 7PM • RSVP Now 💥",
    description: "Don't miss out on exclusive content and live interactions! Join thousands of viewers for my biggest live event yet.",
    profileImage: "",
    backgroundColor: "#1a1a1a",
    textColor: "#ffffff",
    links: [
      { id: '1', title: 'RSVP for Live Event', url: '/e/live-event-123', type: 'rsvp' as const },
      { id: '2', title: 'Support with Tips ❤️', url: '#tip', type: 'tip' as const },
      { id: '3', title: 'Shop Exclusive Merch', url: '#merch', type: 'merch' as const },
      { id: '4', title: 'Add to Calendar 📅', url: '#calendar', type: 'calendar' as const }
    ]
  };

  const handleRSVP = (status: 'going' | 'maybe' | 'not-going') => {
    if (status === 'going' && !emailSubmitted) {
      setShowEmailForm(true);
      setRsvpStatus(status);
      return;
    }
    
    setRsvpStatus(status);
    toast({
      title: "RSVP Confirmed!",
      description: `Thanks for letting us know you're ${status === 'going' ? 'attending' : status === 'maybe' ? 'maybe attending' : 'not attending'}.`,
    });
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulate API call for email submission and calendar invite
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setEmailSubmitted(true);
    setShowEmailForm(false);
    setIsSubmitting(false);
    
    toast({
      title: "RSVP Complete! 📅",
      description: "Calendar invite sent to your email. Check your inbox!",
    });
  };

  const handleLinkClick = (link: BioLink) => {
    if (link.type === 'rsvp') {
      // Handle RSVP separately
      return;
    }
    
    if (link.url.startsWith('#')) {
      toast({
        title: "Coming Soon!",
        description: `${link.title} will be available soon.`,
      });
    } else {
      window.open(link.url, '_blank');
    }
  };

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'tip': return <Heart className="w-4 h-4" />;
      case 'merch': return <Gift className="w-4 h-4" />;
      case 'calendar': return <Calendar className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  const getRSVPButtonClass = (status: string) => {
    const baseClass = "flex-1 py-3 px-4 rounded-lg font-medium transition-all";
    if (rsvpStatus === status) {
      return `${baseClass} bg-blue-500 text-white shadow-lg transform scale-105`;
    }
    return `${baseClass} bg-white/10 border border-white/20 hover:bg-white/20`;
  };

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: bioData.backgroundColor, color: bioData.textColor }}
    >
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Profile Section */}
        <div className="text-center space-y-4 mb-8">
          <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto" />
          <div>
            <h1 className="font-bold text-xl leading-tight mb-3">{bioData.title}</h1>
            <p className="text-sm opacity-90">{bioData.description}</p>
          </div>
        </div>

        {/* RSVP Section */}
        <div className="mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="font-semibold text-center mb-4">Will you be joining the live?</h3>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => handleRSVP('going')}
                className={getRSVPButtonClass('going')}
                disabled={showEmailForm}
              >
                ✅ Going
              </button>
              <button
                onClick={() => handleRSVP('maybe')}
                className={getRSVPButtonClass('maybe')}
                disabled={showEmailForm}
              >
                🤔 Maybe
              </button>
              <button
                onClick={() => handleRSVP('not-going')}
                className={getRSVPButtonClass('not-going')}
                disabled={showEmailForm}
              >
                ❌ Can't Make It
              </button>
            </div>
            
            {/* Email Form for Going RSVP */}
            {showEmailForm && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium text-sm">Get your calendar invite</span>
                </div>
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-blue-500 hover:bg-blue-600" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Calendar Invite"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowEmailForm(false)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Skip
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            {(rsvpStatus && !showEmailForm) && (
              <div className="text-center">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                  {emailSubmitted && rsvpStatus === 'going' ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      RSVP Confirmed + Calendar Sent
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      RSVP Confirmed
                    </span>
                  )}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-3">
          {bioData.links.filter(link => link.type !== 'rsvp').map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link)}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/20 transition-all duration-200 hover:scale-102 hover:shadow-lg group"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="group-hover:scale-110 transition-transform">
                  {getLinkIcon(link.type)}
                </span>
                <span className="font-medium">{link.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-white/10">
          <p className="text-xs opacity-60">
            Powered by LiveStatz
          </p>
        </div>
      </div>
    </div>
  );
}