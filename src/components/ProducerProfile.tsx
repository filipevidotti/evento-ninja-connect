
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Briefcase } from 'lucide-react';
import { User } from '@/components/AuthContext';
import { Event } from '@/components/EventContext';

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
    return total + getApplicationsByEvent(event.id).filter(app => app.status === 'approved').length;
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meu Perfil</CardTitle>
        <CardDescription>Informações da sua conta como produtor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <Input value={user?.name || ''} disabled />
          </div>
          <div>
            <label className="text-sm font-medium">E-mail</label>
            <Input value={user?.email || ''} disabled />
          </div>
          <div>
            <label className="text-sm font-medium">Cidade</label>
            <Input value={user?.city || ''} disabled />
          </div>
          <div>
            <label className="text-sm font-medium">Tipo de Conta</label>
            <div className="flex items-center gap-2 mt-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              <span>Produtor de Eventos</span>
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Estatísticas</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{events.length}</div>
              <div className="text-sm text-gray-600">Eventos Criados</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.status === 'open').length}
              </div>
              <div className="text-sm text-gray-600">Eventos Ativos</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {totalApplications}
              </div>
              <div className="text-sm text-gray-600">Candidaturas</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {totalApprovals}
              </div>
              <div className="text-sm text-gray-600">Aprovações</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProducerProfile;
