
import { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useEvents } from '@/components/EventContext';
import { toast } from '@/hooks/use-toast';

export interface CheckinAttempt {
  id: string;
  user_id: string;
  event_id: string;
  pin_attempted: string;
  success: boolean;
  attempted_at: string;
}

export interface EventCheckin {
  id: string;
  user_id: string;
  event_id: string;
  application_id: string;
  checkin_time: string;
  pin_used: string;
  status: 'checked_in' | 'checked_out';
}

export const useCheckin = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkins, setCheckins] = useState<EventCheckin[]>([]);

  // Mock data for demonstration
  const mockEventPins: Record<string, string> = {
    '1': '1234',
    '2': '5678',
    '3': '9012',
    '4': '3456',
    '5': '7890',
    '6': '1122'
  };

  const performCheckin = async (eventId: string, pin: string): Promise<{ success: boolean; message: string }> => {
    console.log('Iniciando check-in para evento:', eventId, 'com PIN:', pin);
    
    if (!user) {
      console.log('Usuário não autenticado');
      return { success: false, message: 'Usuário não autenticado' };
    }

    setLoading(true);

    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));

      const correctPin = mockEventPins[eventId];
      console.log('PIN correto para evento', eventId, ':', correctPin);
      
      // Log da tentativa (sempre registrar para auditoria)
      const attempt: CheckinAttempt = {
        id: Date.now().toString(),
        user_id: user.id,
        event_id: eventId,
        pin_attempted: pin,
        success: pin === correctPin,
        attempted_at: new Date().toISOString()
      };

      console.log('Check-in attempt logged:', attempt);

      if (pin === correctPin) {
        // Verificar se já fez check-in
        const existingCheckin = checkins.find(
          c => c.event_id === eventId && c.user_id === user.id
        );

        if (existingCheckin) {
          console.log('Usuário já fez check-in neste evento');
          return { success: false, message: 'Você já fez check-in neste evento' };
        }

        // Criar registro de check-in
        const newCheckin: EventCheckin = {
          id: Date.now().toString(),
          user_id: user.id,
          event_id: eventId,
          application_id: `app_${eventId}_${user.id}`,
          checkin_time: new Date().toISOString(),
          pin_used: pin,
          status: 'checked_in'
        };

        setCheckins(prev => [...prev, newCheckin]);
        console.log('Check-in realizado com sucesso:', newCheckin);

        toast({
          title: "Check-in realizado!",
          description: "Sua presença foi registrada com sucesso.",
        });

        return { success: true, message: 'Check-in realizado com sucesso!' };
      } else {
        console.log('PIN inválido fornecido');
        toast({
          title: "PIN inválido",
          description: "Verifique o PIN e tente novamente.",
          variant: "destructive"
        });

        return { success: false, message: 'PIN inválido. Tente novamente.' };
      }
    } catch (error) {
      console.error('Erro no check-in:', error);
      return { success: false, message: 'Erro interno. Tente novamente.' };
    } finally {
      setLoading(false);
    }
  };

  const hasCheckedIn = (eventId: string): boolean => {
    const hasChecked = checkins.some(c => c.event_id === eventId && c.user_id === user?.id);
    console.log('Verificando se usuário fez check-in no evento', eventId, ':', hasChecked);
    return hasChecked;
  };

  const getCheckinTime = (eventId: string): string | null => {
    const checkin = checkins.find(c => c.event_id === eventId && c.user_id === user?.id);
    const time = checkin ? checkin.checkin_time : null;
    console.log('Horário do check-in para evento', eventId, ':', time);
    return time;
  };

  console.log('useCheckin - Estado atual:', { user: user?.id, checkins: checkins.length, loading });

  return {
    performCheckin,
    hasCheckedIn,
    getCheckinTime,
    loading,
    checkins
  };
};
