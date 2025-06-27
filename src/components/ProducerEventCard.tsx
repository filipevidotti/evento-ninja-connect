
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '@/components/EventContext';

interface ProducerEventCardProps {
  event: Event;
  totalApplications: number;
  approvedApplications: number;
}

const ProducerEventCard: React.FC<ProducerEventCardProps> = ({ event, totalApplications, approvedApplications }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{event.name}</CardTitle>
          <Badge variant={event.status === 'open' ? 'default' : 'secondary'}>
            {event.status === 'open' ? 'Aberto' : event.status === 'closed' ? 'Fechado' : 'Concluído'}
          </Badge>
        </div>
        <CardDescription>{event.descricao}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(event.data).toLocaleDateString('pt-BR')}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {event.local}
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {totalApplications} candidaturas ({approvedApplications} aprovadas)
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Funções:</h4>
          {event.functions.map(func => (
            <div key={func.id} className="flex items-center justify-between text-sm">
              <span>{func.cargo} ({func.quantidade}x)</span>
              <span className="text-green-600 font-medium">R$ {func.valor}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProducerEventCard;
