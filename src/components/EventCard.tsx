
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  User, 
  CheckCircle,
  XCircle,
  Clock,
  Users
} from 'lucide-react';

interface EventCardProps {
  event: any;
  onApply: (eventId: string, functionId: string) => void;
  getApplicationStatus: (eventId: string, functionId: string) => string | undefined;
}

const EventCard = ({ event, onApply, getApplicationStatus }: EventCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{event.title}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(event.date).toLocaleDateString('pt-BR')}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {event.location}, {event.city}
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {event.producerName}
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium">Vagas Disponíveis:</h4>
          {event.functions.map((func: any) => {
            const applicationStatus = getApplicationStatus(event.id, func.id);
            return (
              <div key={func.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{func.role}</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {func.quantity}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 font-medium mt-1">
                    <DollarSign className="w-4 h-4" />
                    R$ {func.salary}
                  </div>
                  {func.requirements && (
                    <p className="text-xs text-gray-500 mt-1">{func.requirements}</p>
                  )}
                </div>
                <div className="ml-4">
                  {applicationStatus ? (
                    <Badge className={`${getStatusColor(applicationStatus)} flex items-center gap-1`}>
                      {getStatusIcon(applicationStatus)}
                      {applicationStatus === 'approved' ? 'Aprovado' : 
                       applicationStatus === 'rejected' ? 'Recusado' : 'Pendente'}
                    </Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => onApply(event.id, func.id)}
                    >
                      Candidatar
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
