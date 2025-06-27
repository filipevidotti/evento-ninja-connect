
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const Success: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { checkSubscription } = useSubscription();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId && user) {
      // Refresh subscription status after successful payment
      setTimeout(() => {
        checkSubscription();
      }, 2000);
    }
  }, [sessionId, user, checkSubscription]);

  const handleContinue = () => {
    if (user) {
      navigate(`/${user.type}/dashboard`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Pagamento Realizado!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Sua assinatura foi ativada com sucesso. Agora você tem acesso a todos os recursos do seu plano!
          </p>
          
          <div className="text-sm text-gray-500">
            <p>Atualizando status da assinatura...</p>
          </div>
          
          <Button onClick={handleContinue} className="w-full">
            Continuar para o Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
