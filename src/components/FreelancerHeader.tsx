
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  User, 
  Calendar, 
  Wallet, 
  Heart, 
  Search, 
  Bell,
  BookOpen,
  LogOut,
  X,
  MapPin
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import VerificationBadge from './VerificationBadge';

const FreelancerHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { icon: User, label: 'Meu Perfil', path: '/freelancer/profile' },
    { icon: Search, label: 'Buscar Eventos', path: '/freelancer/search-events' },
    { icon: Heart, label: 'Favoritos', path: '/freelancer/favorites' },
    { icon: Calendar, label: 'Minha Agenda', path: '/freelancer/calendar' },
    { icon: MapPin, label: 'Check-in', path: '/freelancer/checkin' },
    { icon: BookOpen, label: 'Cursos', path: '/freelancer/courses' },
    { icon: Wallet, label: 'Financeiro', path: '/freelancer/finance' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/freelancer/dashboard')}
              className="text-xl font-bold text-blue-600 hover:text-blue-700"
            >
              FreelanceEvents
            </button>
          </div>

          {/* Desktop Navigation - Mais compacto */}
          <nav className="hidden xl:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation(item.path)}
                className="flex items-center space-x-1 px-2 py-1 text-xs"
              >
                <item.icon className="w-3 h-3" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>

          {/* User Info & Mobile Menu */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hidden sm:flex p-2">
              <Bell className="w-4 h-4" />
            </Button>

            <div className="hidden lg:flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="text-xs">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden xl:block">
                  <p className="text-xs font-medium">{user?.name}</p>
                  <VerificationBadge />
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="xl:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold">Menu</h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsMenuOpen(false)}
                      className="p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2 mb-3 p-2 bg-gray-50 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-xs">{user?.name}</p>
                      <VerificationBadge />
                    </div>
                  </div>

                  <nav className="space-y-1">
                    {menuItems.map((item) => (
                      <Button
                        key={item.path}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start h-8 px-2"
                        onClick={() => handleNavigation(item.path)}
                      >
                        <item.icon className="w-3 h-3 mr-2" />
                        <span className="text-xs">{item.label}</span>
                      </Button>
                    ))}
                    
                    <div className="pt-1 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                        onClick={logout}
                      >
                        <LogOut className="w-3 h-3 mr-2" />
                        <span className="text-xs">Sair</span>
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default FreelancerHeader;
