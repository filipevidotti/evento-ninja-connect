
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface PlanCardProps {
  title: string;
  price: string;
  features: string[];
  isCurrentPlan?: boolean;
  isPopular?: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  price,
  features,
  isCurrentPlan,
  isPopular,
  onSelect,
  disabled
}) => {
  return (
    <Card className={`relative ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''} ${isPopular ? 'border-purple-500' : ''}`}>
      {isPopular && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-500">
          Mais Popular
        </Badge>
      )}
      {isCurrentPlan && (
        <Badge className="absolute -top-2 right-4 bg-green-500">
          Plano Atual
        </Badge>
      )}
      
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{title}</CardTitle>
        <div className="text-3xl font-bold text-purple-600">
          {price === 'Gratuito' ? price : `R$ ${price}/mês`}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          onClick={onSelect}
          disabled={disabled || isCurrentPlan}
          className="w-full"
          variant={isCurrentPlan ? "secondary" : "default"}
        >
          {isCurrentPlan ? 'Plano Atual' : price === 'Gratuito' ? 'Gratuito' : 'Assinar'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlanCard;
