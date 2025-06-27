
import { useState } from 'react';
import { ReputationLevel } from '@/components/ReputationBadge';

export interface ReputationData {
  level: ReputationLevel;
  points: number;
  totalEvents: number;
  completionRate: number;
  attendanceRate: number;
  averageRating: number;
  complaints: {
    total: number;
    valid: number;
    invalid: number;
  };
  recentChanges: {
    date: string;
    change: number;
    reason: string;
    eventId?: string;
  }[];
  monthlyProgress: {
    month: string;
    points: number;
  }[];
}

export const useReputation = () => {
  const [reputationData] = useState<ReputationData>({
    level: 'gold',
    points: 1245,
    totalEvents: 45,
    completionRate: 95.6,
    attendanceRate: 97.8,
    averageRating: 4.7,
    complaints: {
      total: 3,
      valid: 1,
      invalid: 2
    },
    recentChanges: [
      {
        date: '2024-01-15',
        change: 15,
        reason: 'Evento concluído + Avaliação 5 estrelas',
        eventId: 'evt_123'
      },
      {
        date: '2024-01-10',
        change: 10,
        reason: 'Evento concluído',
        eventId: 'evt_122'
      },
      {
        date: '2024-01-05',
        change: -15,
        reason: 'Desistência com menos de 24h',
        eventId: 'evt_121'
      }
    ],
    monthlyProgress: [
      { month: 'Ago', points: 1150 },
      { month: 'Set', points: 1180 },
      { month: 'Out', points: 1200 },
      { month: 'Nov', points: 1220 },
      { month: 'Dez', points: 1235 },
      { month: 'Jan', points: 1245 }
    ]
  });

  const getNextLevel = (currentLevel: ReputationLevel, points: number) => {
    if (currentLevel === 'bronze' && points >= 1000) return { level: 'silver', pointsNeeded: 1000 - points };
    if (currentLevel === 'silver' && points >= 1200) return { level: 'gold', pointsNeeded: 1200 - points };
    if (currentLevel === 'gold' && points >= 1500) return { level: 'diamond', pointsNeeded: 1500 - points };
    
    const thresholds = { bronze: 1000, silver: 1200, gold: 1500, diamond: 2000 };
    const currentThreshold = thresholds[currentLevel];
    const nextThreshold = currentLevel === 'diamond' ? 2000 : 
                         currentLevel === 'gold' ? 1500 :
                         currentLevel === 'silver' ? 1200 : 1000;
    
    return { 
      level: currentLevel === 'diamond' ? 'diamond' : 
             currentLevel === 'gold' ? 'diamond' as ReputationLevel :
             currentLevel === 'silver' ? 'gold' as ReputationLevel : 'silver' as ReputationLevel,
      pointsNeeded: nextThreshold - points 
    };
  };

  const getLevelRequirements = (level: ReputationLevel) => {
    const requirements = {
      bronze: {
        minEvents: 3,
        pointsRange: '800-999',
        maxQuitRate: 15,
        maxNoShowRate: 10,
        minRating: 0,
        benefits: ['Badge bronze', 'Aparece nas buscas']
      },
      silver: {
        minEvents: 10,
        pointsRange: '1000-1199',
        maxQuitRate: 10,
        maxNoShowRate: 5,
        minRating: 4.0,
        benefits: ['Prioridade na busca', 'Badge prata']
      },
      gold: {
        minEvents: 25,
        pointsRange: '1200-1499',
        maxQuitRate: 5,
        maxNoShowRate: 2,
        minRating: 4.5,
        benefits: ['Destaque especial', 'Comissão reduzida 1%']
      },
      diamond: {
        minEvents: 50,
        pointsRange: '1500+',
        maxQuitRate: 3,
        maxNoShowRate: 1,
        minRating: 4.8,
        benefits: ['Selo premium', 'Comissão reduzida 2%', 'Suporte prioritário']
      }
    };
    
    return requirements[level];
  };

  return {
    reputationData,
    getNextLevel,
    getLevelRequirements
  };
};
