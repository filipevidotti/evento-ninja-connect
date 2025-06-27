
import React, { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldCheck, ShieldX, Clock } from 'lucide-react';
import { useVerification } from '@/hooks/useVerification';

const VerificationBadge = () => {
  const navigate = useNavigate();
  const { verification, checkVerificationStatus } = useVerification();

  useEffect(() => {
    checkVerificationStatus();
  }, [checkVerificationStatus]);

  const getVerificationStatus = () => {
    if (!verification) {
      return {
        icon: Shield,
        text: 'Não verificado',
        variant: 'secondary' as const,
        className: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      };
    }

    switch (verification.status) {
      case 'aprovado':
        return {
          icon: ShieldCheck,
          text: 'Verificado',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 hover:bg-green-200'
        };
      case 'rejeitado':
        return {
          icon: ShieldX,
          text: 'Rejeitado',
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 hover:bg-red-200'
        };
      default:
        return {
          icon: Clock,
          text: 'Pendente',
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
        };
    }
  };

  const status = getVerificationStatus();
  const IconComponent = status.icon;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate('/verification')}
      className={`${status.className} cursor-pointer`}
    >
      <IconComponent className="w-4 h-4 mr-2" />
      {status.text}
    </Button>
  );
};

export default VerificationBadge;
