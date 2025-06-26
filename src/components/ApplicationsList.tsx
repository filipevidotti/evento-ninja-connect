
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface ApplicationsListProps {
  userApplications: any[];
  events: any[];
}

const ApplicationsList = ({ userApplications, events }: ApplicationsListProps) => {
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
    <Card>
      <CardHeader>
        <CardTitle>Minhas Candidaturas</CardTitle>
        <CardDescription>
          Acompanhe o status das suas candidaturas enviadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userApplications.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Você ainda não se candidatou a nenhum evento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userApplications.map(application => {
              const event = events.find(e => e.id === application.eventId);
              const eventFunction = event?.functions.find(f => f.id === application.functionId);
              
              return (
                <div key={application.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{event?.title}</h3>
                    <Badge className={`${getStatusColor(application.status)} flex items-center gap-1`}>
                      {getStatusIcon(application.status)}
                      {application.status === 'approved' ? 'Aprovado' : 
                       application.status === 'rejected' ? 'Recusado' : 'Pendente'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Função:</strong> {eventFunction?.role}</p>
                    <p><strong>Data:</strong> {event?.date ? new Date(event.date).toLocaleDateString('pt-BR') : 'N/A'}</p>
                    <p><strong>Local:</strong> {event?.location}</p>
                    <p><strong>Salário:</strong> R$ {eventFunction?.salary}</p>
                    <p><strong>Candidatura enviada:</strong> {new Date(application.appliedAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationsList;
