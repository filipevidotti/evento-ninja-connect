
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/AuthContext';
import { EventProvider } from '@/components/EventContext';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import FreelancerDashboard from '@/pages/FreelancerDashboard';
import FreelancerProfile from '@/pages/FreelancerProfile';
import FreelancerCourses from '@/pages/FreelancerCourses';
import FreelancerSearchEvents from '@/pages/FreelancerSearchEvents';
import FreelancerFavorites from '@/pages/FreelancerFavorites';
import FreelancerCalendar from '@/pages/FreelancerCalendar';
import FreelancerFinance from '@/pages/FreelancerFinance';
import FreelancerReputation from '@/pages/FreelancerReputation';
import FreelancerCheckIn from '@/pages/FreelancerCheckIn';
import ProducerDashboard from '@/pages/ProducerDashboard';
import ProducerSearchFreelancers from '@/pages/ProducerSearchFreelancers';
import ProducerFavorites from '@/pages/ProducerFavorites';
import ProducerFinance from '@/pages/ProducerFinance';
import ProducerTeamManagement from '@/pages/ProducerTeamManagement';
import ProducerCreateTeam from '@/pages/ProducerCreateTeam';
import ProducerEditTeam from '@/pages/ProducerEditTeam';
import ProducerComplaint from '@/pages/ProducerComplaint';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminUsers from '@/pages/AdminUsers';
import AdminVerifications from '@/pages/AdminVerifications';
import AdminComplaints from '@/pages/AdminComplaints';
import AdminDisputes from '@/pages/AdminDisputes';
import AdminFinance from '@/pages/AdminFinance';
import PublicEvents from '@/pages/PublicEvents';
import Plans from '@/pages/Plans';
import Success from '@/pages/Success';
import Verification from '@/pages/Verification';
import NotVerified from '@/pages/NotVerified';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EventProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                
                {/* Freelancer Routes */}
                <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
                <Route path="/freelancer/profile" element={<FreelancerProfile />} />
                <Route path="/freelancer/courses" element={<FreelancerCourses />} />
                <Route path="/freelancer/search-events" element={<FreelancerSearchEvents />} />
                <Route path="/freelancer/favorites" element={<FreelancerFavorites />} />
                <Route path="/freelancer/calendar" element={<FreelancerCalendar />} />
                <Route path="/freelancer/finance" element={<FreelancerFinance />} />
                <Route path="/freelancer/reputation" element={<FreelancerReputation />} />
                <Route path="/freelancer/checkin/:eventId" element={<FreelancerCheckIn />} />
                
                {/* Producer Routes */}
                <Route path="/producer/dashboard" element={<ProducerDashboard />} />
                <Route path="/producer/search-freelancers" element={<ProducerSearchFreelancers />} />
                <Route path="/producer/favorites" element={<ProducerFavorites />} />
                <Route path="/producer/finance" element={<ProducerFinance />} />
                <Route path="/producer/team-management" element={<ProducerTeamManagement />} />
                <Route path="/producer/teams/create" element={<ProducerCreateTeam />} />
                <Route path="/producer/teams/edit/:teamId" element={<ProducerEditTeam />} />
                <Route path="/producer/complaint" element={<ProducerComplaint />} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/verifications" element={<AdminVerifications />} />
                <Route path="/admin/complaints" element={<AdminComplaints />} />
                <Route path="/admin/disputes" element={<AdminDisputes />} />
                <Route path="/admin/finance" element={<AdminFinance />} />
                
                {/* Public Routes */}
                <Route path="/events" element={<PublicEvents />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/success" element={<Success />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/not-verified" element={<NotVerified />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
          </Router>
        </EventProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
