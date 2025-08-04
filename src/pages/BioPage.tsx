import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, ExternalLink, Gift, Heart } from "lucide-react";

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
    setRsvpStatus(status);
    toast({
      title: "RSVP Confirmed!",
      description: `Thanks for letting us know you're ${status === 'going' ? 'attending' : status === 'maybe' ? 'maybe attending' : 'not attending'}.`,
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
              >
                ✅ Going
              </button>
              <button
                onClick={() => handleRSVP('maybe')}
                className={getRSVPButtonClass('maybe')}
              >
                🤔 Maybe
              </button>
              <button
                onClick={() => handleRSVP('not-going')}
                className={getRSVPButtonClass('not-going')}
              >
                ❌ Can't Make It
              </button>
            </div>
            
            {rsvpStatus && (
              <div className="text-center">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                  ✓ RSVP Confirmed
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