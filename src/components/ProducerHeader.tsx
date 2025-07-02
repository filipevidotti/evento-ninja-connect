
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { User } from '@/components/AuthContext';
import VerificationBadge from './VerificationBadge';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  LayoutDashboard, 
  Search, 
  Heart, 
  Wallet, 
  Users, 
  Settings, 
  Shield,
  LogOut,
  X,
  MapPin
} from 'lucide-react';

interface ProducerHeaderProps {
  user: User | null;
  onLogout: () => void;
  onCreateEvent: () => void;
}

const ProducerHeader: React.FC<ProducerHeaderProps> = ({ user, onLogout, onCreateEvent }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/producer/dashboard' },
    { icon: Search, label: 'Buscar Talentos', path: '/producer/search-freelancers' },
    { icon: Heart, label: 'Favoritos', path: '/producer/favorites' },
    { icon: MapPin, label: 'Check-in Eventos', path: '/producer/checkin' },
    { icon: Wallet, label: 'Financeiro', path: '/producer/finance' },
    { icon: Users, label: 'Criar Equipe', path: '/producer/create-team' },
    { icon: Settings, label: 'Gerenciar Equipes', path: '/producer/team-management' },
    { icon: Shield, label: 'Admin', path: '/admin/dashboard' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col space-y-2 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
          {/* Top row - Title and verification badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 
                className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent cursor-pointer"
                onClick={() => navigate('/producer/dashboard')}
              >
                O Freela
              </h1>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">Organizador</Badge>
            </div>
            
            {/* Mobile menu and verification badge - separated for better layout */}
            <div className="lg:hidden flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <VerificationBadge />
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </div>
              
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="h-4 w-4" />
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
                      <AvatarFallback className="text-xs">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-xs">{user?.name}</p>
                      <p className="text-xs text-gray-600">{user?.city}</p>
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
                        onClick={onLogout}
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <VerificationBadge />
            
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
            
            <div className="flex items-center space-x-2 ml-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={onLogout} size="sm" className="text-xs px-2 py-1">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProducerHeader;
