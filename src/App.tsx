import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { EventProvider } from "./components/EventContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import FreelancerProfile from "./pages/FreelancerProfile";
import FreelancerCalendar from "./pages/FreelancerCalendar";
import FreelancerFinance from "./pages/FreelancerFinance";
import FreelancerFavorites from "./pages/FreelancerFavorites";
import FreelancerReputation from "./pages/FreelancerReputation";
import ProducerDashboard from "./pages/ProducerDashboard";
import ProducerSearchFreelancers from "./pages/ProducerSearchFreelancers";
import ProducerTeamManagement from "./pages/ProducerTeamManagement";
import ProducerCreateTeam from "./pages/ProducerCreateTeam";
import ProducerFavorites from "./pages/ProducerFavorites";
import ProducerEditTeam from "./pages/ProducerEditTeam";
import ProducerComplaint from "./pages/ProducerComplaint";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminVerifications from "./pages/AdminVerifications";
import AdminComplaints from "./pages/AdminComplaints";
import AdminFinance from "./pages/AdminFinance";
import AdminDisputes from "./pages/AdminDisputes";
import Verification from "./pages/Verification";
import Plans from "./pages/Plans";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <EventProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                
                {/* Freelancer Routes */}
                <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
                <Route path="/freelancer/profile" element={<FreelancerProfile />} />
                <Route path="/freelancer/calendar" element={<FreelancerCalendar />} />
                <Route path="/freelancer/finance" element={<FreelancerFinance />} />
                <Route path="/freelancer/favorites" element={<FreelancerFavorites />} />
                <Route path="/freelancer/reputation" element={<FreelancerReputation />} />
                
                {/* Producer Routes */}
                <Route path="/producer/dashboard" element={<ProducerDashboard />} />
                <Route path="/producer/search-freelancers" element={<ProducerSearchFreelancers />} />
                <Route path="/producer/team-management" element={<ProducerTeamManagement />} />
                <Route path="/producer/create-team" element={<ProducerCreateTeam />} />
                <Route path="/producer/favorites" element={<ProducerFavorites />} />
                <Route path="/producer/edit-team/:teamId" element={<ProducerEditTeam />} />
                <Route path="/producer/complaint/:freelancerId" element={<ProducerComplaint />} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/verifications" element={<AdminVerifications />} />
                <Route path="/admin/complaints" element={<AdminComplaints />} />
                <Route path="/admin/finance" element={<AdminFinance />} />
                <Route path="/admin/disputes" element={<AdminDisputes />} />
                
                {/* Common Routes */}
                <Route path="/verification" element={<Verification />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/success" element={<Success />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </EventProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
