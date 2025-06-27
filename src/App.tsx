import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/AuthContext";
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

const ProtectedRoute = ({ children, allowedType }: { children: React.ReactNode, allowedType?: 'freelancer' | 'producer' }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedType && user.type !== allowedType) {
    return <Navigate to={user.type === 'freelancer' ? '/freelancer/dashboard' : '/producer/dashboard'} replace />;
  }
  
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Por enquanto, vamos permitir acesso admin para todos os usuários logados
  // Depois você pode implementar uma verificação de role específica
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to={user.type === 'freelancer' ? '/freelancer/dashboard' : '/producer/dashboard'} replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <EventProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
              <Route path="/success" element={<Success />} />
              <Route path="/verification" element={<ProtectedRoute><Verification /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/verifications" element={<AdminRoute><AdminVerifications /></AdminRoute>} />
              <Route path="/admin/disputes" element={<AdminRoute><AdminDisputes /></AdminRoute>} />
              <Route path="/admin/finance" element={<AdminRoute><AdminFinance /></AdminRoute>} />
              
              {/* Freelancer Routes */}
              <Route 
                path="/freelancer/dashboard" 
                element={
                  <ProtectedRoute allowedType="freelancer">
                    <FreelancerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/freelancer/profile" 
                element={
                  <ProtectedRoute allowedType="freelancer">
                    <FreelancerProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/freelancer/finance" 
                element={
                  <ProtectedRoute allowedType="freelancer">
                    <FreelancerFinance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/freelancer/calendar" 
                element={
                  <ProtectedRoute allowedType="freelancer">
                    <FreelancerCalendar />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/freelancer/favorites" 
                element={
                  <ProtectedRoute allowedType="freelancer">
                    <FreelancerFavorites />
                  </ProtectedRoute>
                } 
              />
              
              {/* Producer Routes */}
              <Route 
                path="/producer/dashboard" 
                element={
                  <ProtectedRoute allowedType="producer">
                    <ProducerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </EventProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
