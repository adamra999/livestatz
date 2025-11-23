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
import Profile from "./pages/Profile/index";
import CreatorSettings from "./pages/Profile/CreatorSettings";
import FanDatabase from "./pages/FanDatabase";
import Interactions from "./pages/Interactions";
import Rewards from "./pages/Rewards";
import Collaborations from "./pages/Collaborations";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import EventSuccessPage from "./pages/EventSuccessPage";
import CreateEventPage from "./pages/CreateEventPage";
import EventsView from "./components/events/EventsView";
import { CalendarView } from "@/components/calendar/CalendarView";
import { AnalyticsView } from "@/components/analytics/AnalyticsView";

import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  console.log("App component rendering...");
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <Layout>
                    <Index />
                  </Layout>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
              <Route
                path="/events"
                element={
                  <Layout>
                    <EventsView />
                  </Layout>
                }
              />
              <Route
                path="/calendar"
                element={
                  <Layout>
                    <CalendarView />
                  </Layout>
                }
              />
              <Route
                path="/analytics"
                element={
                  <Layout>
                    <AnalyticsView />
                  </Layout>
                }
              />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/events/success/:eventId"
                element={<Layout><EventSuccessPage /></Layout>}
              />
              <Route
                path="/events/create-event"
                element={<Layout><CreateEventPage /></Layout>}
              />
              <Route
                path="/events/edit/:eventId"
                element={<Layout><CreateEventPage /></Layout>}
              />

              <Route
                path="/e/:eventId"
                element={
                  <Layout>
                    <EventRSVPPage />
                  </Layout>
                }
              />
              <Route
                path="/events/:eventId"
                element={
                  <Layout>
                    <EventDetail />
                  </Layout>
                }
              />
              <Route
                path="/bio-builder"
                element={
                  <Layout>
                    <LinkBioBuilder />
                  </Layout>
                }
              />
              <Route
                path="/content-manager"
                element={
                  <Layout>
                    <ContentManager />
                  </Layout>
                }
              />
              <Route
                path="/profile"
                element={
                  <Layout>
                    <Profile />
                  </Layout>
                }
              />
              <Route
                path="/profile/creator-settings"
                element={
                  <Layout>
                    <CreatorSettings />
                  </Layout>
                }
              />
              <Route
                path="/fan-database"
                element={
                  <Layout>
                    <FanDatabase />
                  </Layout>
                }
              />
              <Route
                path="/interactions"
                element={
                  <Layout>
                    <Interactions />
                  </Layout>
                }
              />
              <Route
                path="/rewards"
                element={
                  <Layout>
                    <Rewards />
                  </Layout>
                }
              />
              <Route
                path="/favorites"
                element={
                  <Layout>
                    <Collaborations />
                  </Layout>
                }
              />
              <Route
                path="/bio/:username"
                element={
                  <Layout>
                    <BioPage />
                  </Layout>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route
                path="*"
                element={
                  <Layout>
                    <NotFound />
                  </Layout>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
