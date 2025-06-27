
import React from 'react';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 
              className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => navigate('/admin/dashboard')}
            >
              EventConnect
            </h1>
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Navigation Buttons */}
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/dashboard')}
              className="text-sm"
            >
              Dashboard
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/users')}
              className="text-sm"
            >
              Usuários
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/verifications')}
              className="text-sm"
            >
              Verificações
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/complaints')}
              className="text-sm"
            >
              Reclamações
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/finance')}
              className="text-sm"
            >
              Financeiro
            </Button>
            
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarFallback>{user?.name?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-gray-600">Administrador</p>
              </div>
            </div>
            
            <Button variant="outline" onClick={logout}>Sair</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
