
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Medal, Award, Crown, Diamond } from 'lucide-react';

export type ReputationLevel = 'bronze' | 'silver' | 'gold' | 'diamond';

interface ReputationBadgeProps {
  level: ReputationLevel;
  points: number;
  size?: 'sm' | 'md' | 'lg';
}

const ReputationBadge: React.FC<ReputationBadgeProps> = ({ level, points, size = 'md' }) => {
  const getBadgeConfig = (level: ReputationLevel) => {
    switch (level) {
      case 'bronze':
        return {
          icon: Medal,
          color: 'bg-amber-600 text-white',
          label: 'Bronze',
          bgClass: 'bg-amber-50 border-amber-200'
        };
      case 'silver':
        return {
          icon: Medal,
          color: 'bg-gray-500 text-white',
          label: 'Prata',
          bgClass: 'bg-gray-50 border-gray-200'
        };
      case 'gold':
        return {
          icon: Award,
          color: 'bg-yellow-500 text-white',
          label: 'Ouro',
          bgClass: 'bg-yellow-50 border-yellow-200'
        };
      case 'diamond':
        return {
          icon: Diamond,
          color: 'bg-blue-600 text-white',
          label: 'Diamante',
          bgClass: 'bg-blue-50 border-blue-200'
        };
    }
  };

  const config = getBadgeConfig(level);
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`inline-flex items-center space-x-2 p-2 rounded-lg border ${config.bgClass}`}>
      <div className={`${sizeClasses[size]} ${config.color} rounded-full flex items-center justify-center`}>
        <Icon className={iconSizes[size]} />
      </div>
      <div>
        <p className="font-semibold text-sm">{config.label}</p>
        <p className="text-xs text-gray-600">{points} pontos</p>
      </div>
    </div>
  );
};

export default ReputationBadge;
