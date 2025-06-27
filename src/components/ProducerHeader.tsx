
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from '@/components/AuthContext';
import VerificationBadge from './VerificationBadge';

interface ProducerHeaderProps {
  user: User | null;
  onLogout: () => void;
  onCreateEvent: () => void;
}

const ProducerHeader: React.FC<ProducerHeaderProps> = ({ user, onLogout, onCreateEvent }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              EventConnect
            </h1>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">Produtor</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <VerificationBadge />
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-gray-600">{user?.city}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>Sair</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProducerHeader;
