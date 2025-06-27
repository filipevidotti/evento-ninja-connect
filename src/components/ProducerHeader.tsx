
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from '@/components/AuthContext';
import VerificationBadge from './VerificationBadge';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProducerHeaderProps {
  user: User | null;
  onLogout: () => void;
  onCreateEvent: () => void;
}

const ProducerHeader: React.FC<ProducerHeaderProps> = ({ user, onLogout, onCreateEvent }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h1 
              className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => navigate('/producer/dashboard')}
            >
              EventConnect
            </h1>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs sm:text-sm">Produtor</Badge>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <VerificationBadge />
            
            <Button 
              variant="ghost" 
              onClick={() => navigate('/producer/dashboard')}
              className="text-sm"
            >
              Dashboard
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate('/producer/search-freelancers')}
              className="text-sm"
            >
              Buscar Talentos
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate('/producer/create-team')}
              className="text-sm"
            >
              Criar Equipe
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate('/producer/team-management')}
              className="text-sm"
            >
              Gerenciar Equipes
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
              <div className="hidden xl:block">
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.city}</p>
              </div>
            </div>
            
            <Button variant="outline" onClick={onLogout} size="sm">Sair</Button>
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
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/producer/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/producer/search-freelancers')}>
                  Buscar Talentos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/producer/create-team')}>
                  Criar Equipe
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/producer/team-management')}>
                  Gerenciar Equipes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                  Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout}>
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

export default ProducerHeader;
