
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EventConnect
          </h1>
          <p className="text-gray-600 mt-2">Conectando talentos aos melhores eventos</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Demo - Frontend Only</CardTitle>
            <CardDescription className="text-center">
              Escolha um tipo de usuário para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate('/freelancer/dashboard')} 
              className="w-full"
            >
              Entrar como Freelancer
            </Button>
            
            <Button 
              onClick={() => navigate('/producer/dashboard')} 
              variant="outline"
              className="w-full"
            >
              Entrar como Produtor
            </Button>
            
            <Button 
              onClick={() => navigate('/admin/dashboard')} 
              variant="secondary"
              className="w-full"
            >
              Painel Administrativo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
