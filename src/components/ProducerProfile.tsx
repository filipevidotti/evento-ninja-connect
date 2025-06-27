
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { User } from '@/components/AuthContext';
import { Event } from '@/components/EventContext';
import EditableProfile from './EditableProfile';

interface ProducerProfileProps {
  user: User | null;
  events: Event[];
  getApplicationsByEvent: (eventId: string) => any[];
}

const ProducerProfile: React.FC<ProducerProfileProps> = ({ user, events, getApplicationsByEvent }) => {
  const totalApplications = events.reduce((total, event) => {
    return total + getApplicationsByEvent(event.id).length;
  }, 0);

  const totalApprovals = events.reduce((total, event) => {
    return total + getApplicationsByEvent(event.id).filter(app => app.status === 'aprovado').length;
  }, 0);

  return (
    <div className="space-y-6">
      <EditableProfile />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Estatísticas do Produtor
          </CardTitle>
          <CardDescription>Resumo da sua atividade na plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{events.length}</div>
              <div className="text-sm text-gray-600">Eventos Criados</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.status === 'open').length}
              </div>
              <div className="text-sm text-gray-600">Eventos Ativos</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {totalApplications}
              </div>
              <div className="text-sm text-gray-600">Candidaturas</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {totalApprovals}
              </div>
              <div className="text-sm text-gray-600">Aprovações</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProducerProfile;
