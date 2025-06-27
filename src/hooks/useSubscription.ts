
import { useState, useEffect } from 'react';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string | null;
  user_type: string;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: 'free',
    subscription_end: null,
    user_type: 'freelancer'
  });
  const [loading, setLoading] = useState(false);

  const checkSubscription = async () => {
    // Mock - não faz nada
  };

  const createCheckout = async (plan: string) => {
    alert(`Simulação: Checkout do plano ${plan}`);
  };

  const openCustomerPortal = async () => {
    alert('Simulação: Portal do cliente');
  };

  return {
    subscription,
    loading,
    checkSubscription,
    createCheckout,
    openCustomerPortal
  };
};
