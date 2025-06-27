
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string | null;
  user_type: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Dados mockados de assinatura
    setSubscription({
      subscribed: false,
      subscription_tier: 'free',
      subscription_end: null,
      user_type: user.type
    });
    
    setLoading(false);
  };

  useEffect(() => {
    checkSubscription();
  }, [user]);

  const createCheckout = async (plan: string) => {
    if (!user) throw new Error('User not authenticated');
    
    // Simular abertura do checkout
    alert(`Redirecionando para checkout do plano: ${plan}`);
  };

  const openCustomerPortal = async () => {
    if (!user) throw new Error('User not authenticated');
    
    // Simular abertura do portal
    alert('Redirecionando para portal do cliente');
  };

  return {
    subscription,
    loading,
    checkSubscription,
    createCheckout,
    openCustomerPortal
  };
};
