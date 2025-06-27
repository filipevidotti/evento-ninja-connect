
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Application {
  id: string;
  user_id: string;
  function_id: string;
  status: 'pendente' | 'aprovado' | 'recusado';
  applied_at: string;
  user_name?: string;
  user_email?: string;
  event_name?: string;
  function_cargo?: string;
}

interface Event {
  id: string;
  name: string;
  data: string;
  local: string;
  functions: Array<{
    id: string;
    cargo: string;
    valor: number;
  }>;
}

interface ApplicationsListProps {
  userApplications: Application[];
  events: Event[];
}

const ApplicationsList = ({ userApplications, events }: ApplicationsListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'recusado': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado': return <CheckCircle className="w-4 h-4" />;
      case 'recusado': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getEventDetails = (functionId: string) => {
    for (const event of events) {
      const func = event.functions.find(f => f.id === functionId);
      if (func) {
        return { event, func };
      }
    }
    return null;
  };

  if (userApplications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Você ainda não se candidatou a nenhum evento.</p>
        <Button className="mt-4" size="sm">
          Buscar Eventos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {userApplications.map((application) => {
        const details = getEventDetails(application.function_id);
        if (!details) return null;

        const { event, func } = details;
        
        return (
          <div key={application.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-sm">{application.event_name || event.name}</h3>
                <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(event.data).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {event.local}
                </p>
              </div>
              <Badge className={`${getStatusColor(application.status)} flex items-center gap-1`}>
                {getStatusIcon(application.status)}
                {application.status === 'aprovado' ? 'Aprovado' : 
                 application.status === 'recusado' ? 'Recusado' : 'Pendente'}
              </Badge>
            </div>
            
            <div className="bg-gray-50 rounded p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{application.function_cargo || func.cargo}</p>
                  <p className="text-xs text-gray-600">
                    Candidatado em {new Date(application.applied_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    R$ {func.valor}
                  </p>
                </div>
              </div>
            </div>

            {application.status === 'aprovado' && (
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="text-sm text-green-800 font-medium">🎉 Parabéns! Sua candidatura foi aprovada!</p>
                <p className="text-xs text-green-700 mt-1">
                  Você receberá mais informações sobre o evento em breve.
                </p>
              </div>
            )}
            
            {application.status === 'recusado' && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-sm text-red-800">Candidatura não foi selecionada desta vez.</p>
                <p className="text-xs text-red-700 mt-1">
                  Continue se candidatando a outros eventos!
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ApplicationsList;
