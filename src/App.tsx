
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
import ProducerDashboard from "./pages/ProducerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Plans from "./pages/Plans";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedType }: { children: React.ReactNode, allowedType?: 'freelancer' | 'producer' | 'admin' }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedType && allowedType !== 'admin' && user.type !== allowedType) {
    return <Navigate to={user.type === 'freelancer' ? '/freelancer/dashboard' : '/producer/dashboard'} replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
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
              <Route 
                path="/freelancer/dashboard" 
                element={
                  <ProtectedRoute allowedType="freelancer">
                    <FreelancerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/producer/dashboard" 
                element={
                  <ProtectedRoute allowedType="producer">
                    <ProducerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedType="admin">
                    <AdminDashboard />
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
