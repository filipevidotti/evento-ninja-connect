
import React from 'react';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Settings, Menu, CalendarDays, MapPin, Heart, CreditCard, ClipboardCheck, Search } from 'lucide-react';
import VerificationBadge from './VerificationBadge';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const FreelancerHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h1 
              className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => navigate('/freelancer/dashboard')}
            >
              EventConnect
            </h1>
            <Badge variant="secondary" className="text-xs sm:text-sm">Freelancer</Badge>
          </div>
          
          {/* Desktop Navigation - Melhorado para não quebrar */}
          <div className="hidden lg:flex items-center space-x-2">
            <VerificationBadge />
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/freelancer/search-events')}
              className="text-xs px-2"
            >
              <Search className="w-4 h-4 mr-1" />
              Buscar
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/freelancer/calendar')}
              className="text-xs px-2"
            >
              <CalendarDays className="w-4 h-4 mr-1" />
              Calendário
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/freelancer/checkin')}
              className="text-xs px-2"
            >
              <ClipboardCheck className="w-4 h-4 mr-1" />
              Check-in
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/freelancer/favorites')}
              className="text-xs px-2"
            >
              <Heart className="w-4 h-4 mr-1" />
              Favoritos
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/freelancer/finance')}
              className="text-xs px-2"
            >
              <CreditCard className="w-4 h-4 mr-1" />
              Financeiro
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs px-2">
                  <Menu className="w-4 h-4 mr-1" />
                  Mais
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/freelancer/reputation')}>
                  <Star className="w-4 h-4 mr-2" />
                  Reputação
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-sm">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="hidden xl:block">
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
          <div className="lg:hidden flex items-center space-x-2">
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
                <DropdownMenuItem onClick={() => navigate('/freelancer/search-events')}>
                  <Search className="w-4 h-4 mr-2" />
                  Buscar Eventos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/freelancer/calendar')}>
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Calendário
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/freelancer/checkin')}>
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Check-in
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/freelancer/favorites')}>
                  <Heart className="w-4 h-4 mr-2" />
                  Favoritos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/freelancer/finance')}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Financeiro
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/freelancer/reputation')}>
                  Reputação
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                  Admin
                </DropdownMenuItem>
                <DropdownMenuSeparator />
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
