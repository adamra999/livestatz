import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import { EventRSVPPage } from "./pages/EventRSVP";
import EventDetail from "./pages/EventDetail";
import LinkBioBuilder from "./pages/LinkBioBuilder";
import BioPage from "./pages/BioPage";
import ContentManager from "./pages/ContentManager";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendering...');
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/e/:eventId" element={<Layout><EventRSVPPage /></Layout>} />
          <Route path="/events/:eventId" element={<Layout><EventDetail /></Layout>} />
          <Route path="/bio-builder" element={<Layout><LinkBioBuilder /></Layout>} />
          <Route path="/content-manager" element={<Layout><ContentManager /></Layout>} />
          <Route path="/bio/:username" element={<Layout><BioPage /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
