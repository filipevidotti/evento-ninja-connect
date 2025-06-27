
import React from 'react';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Settings, Menu } from 'lucide-react';
import VerificationBadge from './VerificationBadge';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const FreelancerHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EventConnect
            </h1>
            <Badge variant="secondary" className="text-xs sm:text-sm">Freelancer</Badge>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <VerificationBadge />
            
            <Button 
              variant="ghost" 
              onClick={() => navigate('/freelancer/reputation')}
              className="text-sm"
            >
              Reputação
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/dashboard')}
              className="text-sm"
            >
              Admin
            </Button>
            
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-sm">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="hidden lg:block">
                <p className="font-medium text-sm">{user?.name}</p>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{user?.rating || 'Novo'}</span>
                </div>
              </div>
            </div>
            
            <Button variant="outline" onClick={logout} size="sm">Sair</Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <VerificationBadge />
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-sm">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/freelancer/reputation')}>
                  Reputação
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                  Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default FreelancerHeader;
