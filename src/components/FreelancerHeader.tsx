
import React from 'react';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import VerificationBadge from './VerificationBadge';

const FreelancerHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EventConnect
            </h1>
            <Badge variant="secondary">Freelancer</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <VerificationBadge />
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{user?.rating || 'Novo'}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={logout}>Sair</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default FreelancerHeader;
