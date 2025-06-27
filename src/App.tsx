
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/AuthContext";
import { EventProvider } from "@/components/EventContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import FreelancerProfile from "./pages/FreelancerProfile";
import FreelancerFinance from "./pages/FreelancerFinance";
import FreelancerCalendar from "./pages/FreelancerCalendar";
import FreelancerFavorites from "./pages/FreelancerFavorites";
import ProducerDashboard from "./pages/ProducerDashboard";
import Plans from "./pages/Plans";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";
import Verification from "./pages/Verification";
import AdminVerifications from "./pages/AdminVerifications";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminDisputes from "./pages/AdminDisputes";
import AdminFinance from "./pages/AdminFinance";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <EventProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/success" element={<Success />} />
              <Route path="/verification" element={<Verification />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/verifications" element={<AdminVerifications />} />
              <Route path="/admin/disputes" element={<AdminDisputes />} />
              <Route path="/admin/finance" element={<AdminFinance />} />
              
              {/* Freelancer Routes */}
              <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
              <Route path="/freelancer/profile" element={<FreelancerProfile />} />
              <Route path="/freelancer/finance" element={<FreelancerFinance />} />
              <Route path="/freelancer/calendar" element={<FreelancerCalendar />} />
              <Route path="/freelancer/favorites" element={<FreelancerFavorites />} />
              
              {/* Producer Routes */}
              <Route path="/producer/dashboard" element={<ProducerDashboard />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </EventProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
