
import React from 'react';
import { useAuth } from '@/components/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import PlanCard from '@/components/PlanCard';
import AdminHeader from '@/components/AdminHeader';
import FreelancerHeader from '@/components/FreelancerHeader';
import ProducerHeader from '@/components/ProducerHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Plans: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { subscription, createCheckout, loading } = useSubscription();

  // Show loading state while checking auth
  if (!user && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-4">Você precisa estar logado para ver os planos.</p>
          <Button onClick={() => navigate('/login')}>Fazer Login</Button>
        </div>
      </div>
    );
  }

  const freelancerPlans = [
    {
      id: 'free',
      title: 'Gratuito',
      price: 'Gratuito',
      features: [
        '3 candidaturas por mês',
        'Perfil básico',
        'Busca limitada de eventos'
      ]
    },
    {
      id: 'destaque',
      title: 'Destaque',
      price: '14',
      features: [
        'Candidaturas ilimitadas',
        'Perfil em destaque',
        'Busca avançada',
        'Suporte prioritário'
      ],
      isPopular: true
    },
    {
      id: 'profissional',
      title: 'Profissional',
      price: '29',
      features: [
        'Todos os recursos do Destaque',
        'Análises detalhadas',
        'Badge profissional',
        'Contato direto com produtores'
      ]
    }
  ];

  const producerPlans = [
    {
      id: 'free',
      title: 'Gratuito',
      price: 'Gratuito',
      features: [
        '1 evento por mês',
        'Até 10 candidaturas por evento',
        'Ferramentas básicas'
      ]
    },
    {
      id: 'profissional',
      title: 'Profissional',
      price: '39',
      features: [
        'Eventos ilimitados',
        'Candidaturas ilimitadas',
        'Ferramentas avançadas de seleção',
        'Suporte prioritário'
      ],
      isPopular: true
    },
    {
      id: 'avancado',
      title: 'Avançado',
      price: '79',
      features: [
        'Todos os recursos do Profissional',
        'Analytics avançado',
        'API personalizada',
        'Gerente de conta dedicado'
      ]
    }
  ];

  const currentPlans = user.type === 'freelancer' ? freelancerPlans : producerPlans;

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') return;
    
    try {
      await createCheckout(planId);
    } catch (error) {
      console.error('Error creating checkout:', error);
    }
  };

  const renderHeader = () => {
    if (user.type === 'freelancer') {
      return <FreelancerHeader />;
    } else if (user.type === 'producer') {
      return <ProducerHeader user={user} onLogout={logout} onCreateEvent={() => {}} />;
    } else {
      return <AdminHeader />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                Planos para {user.type === 'freelancer' ? 'Freelancers' : 'Produtores'}
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Escolha o plano ideal para impulsionar sua carreira e encontrar as melhores oportunidades.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {currentPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                title={plan.title}
                price={plan.price}
                features={plan.features}
                isCurrentPlan={subscription?.subscription_tier === plan.id}
                isPopular={plan.isPopular}
                onSelect={() => handleSelectPlan(plan.id)}
                disabled={subscription?.subscription_tier === plan.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
