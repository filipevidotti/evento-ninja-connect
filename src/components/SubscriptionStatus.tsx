
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/components/AuthContext';
import { Crown, Calendar, RefreshCw } from 'lucide-react';

const SubscriptionStatus: React.FC = () => {
  const { user } = useAuth();
  const { subscription, loading, checkSubscription, openCustomerPortal } = useSubscription();

  if (!user || loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Carregando...</div>
        </CardContent>
      </Card>
    );
  }

  const getTierDisplayName = (tier: string) => {
    const names = {
      free: 'Gratuito',
      destaque: 'Destaque',
      profissional: 'Profissional',
      avancado: 'Avançado'
    };
    return names[tier as keyof typeof names] || tier;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="w-5 h-5" />
          <span>Status da Assinatura</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Plano Atual:</span>
          <Badge variant={subscription?.subscribed ? "default" : "secondary"}>
            {getTierDisplayName(subscription?.subscription_tier || 'free')}
          </Badge>
        </div>

        {subscription?.subscription_end && (
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Renovação:</span>
            </span>
            <span className="text-sm text-gray-600">
              {new Date(subscription.subscription_end).toLocaleDateString('pt-BR')}
            </span>
          </div>
        )}

        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkSubscription}
            className="flex items-center space-x-1"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Atualizar</span>
          </Button>
          
          {subscription?.subscribed && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={openCustomerPortal}
            >
              Gerenciar Assinatura
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
