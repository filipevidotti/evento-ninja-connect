
import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useEvents } from '@/components/EventContext';
import { useTeams } from '@/hooks/useTeams';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase } from 'lucide-react';

import ProducerHeader from '@/components/ProducerHeader';
import CreateEventDialog from '@/components/CreateEventDialog';
import ProducerEventCard from '@/components/ProducerEventCard';
import ApplicationsManager from '@/components/ApplicationsManager';
import ProducerProfile from '@/components/ProducerProfile';

const ProducerDashboard = () => {
  const { user, logout } = useAuth();
  const { events, createEvent, updateApplicationStatus, getEventsByProducer, getApplicationsByEvent } = useEvents();
  const { getTeamsByProducer } = useTeams();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  // Eventos de teste para demonstração
  const mockTestEvents = [
    {
      id: 'test-1',
      name: 'Casamento Silva & Santos',
      produtor_id: user?.id || 'test-producer',
      data: '2024-02-15T18:00:00Z',
      local: 'Buffet Elegance - Salão Principal',
      descricao: 'Cerimônia de casamento com 200 convidados. Evento elegante com decoração clássica.',
      status: 'open' as const,
      checkin_pin: '1234',
      functions: [
        { id: 'f1', cargo: 'Garçom', quantidade: 8, valor: '150.00', requirements: 'Experiência mínima de 1 ano' },
        { id: 'f2', cargo: 'Recepcionista', quantidade: 2, valor: '120.00', requirements: 'Boa comunicação' },
        { id: 'f3', cargo: 'Segurança', quantidade: 2, valor: '180.00', requirements: 'Curso de segurança' }
      ]
    },
    {
      id: 'test-2',
      name: 'Evento Corporativo TechCorp',
      produtor_id: user?.id || 'test-producer',
      data: '2024-02-20T14:00:00Z',
      local: 'Centro de Convenções - Auditório A',
      descricao: 'Convenção anual da empresa com palestrantes e networking.',
      status: 'open' as const,
      checkin_pin: '5678',
      functions: [
        { id: 'f4', cargo: 'Hostess', quantidade: 4, valor: '130.00', requirements: 'Inglês fluente' },
        { id: 'f5', cargo: 'Técnico de Som', quantidade: 2, valor: '200.00', requirements: 'Experiência com equipamentos' },
        { id: 'f6', cargo: 'Limpeza', quantidade: 3, valor: '100.00', requirements: 'Disponibilidade integral' }
      ]
    },
    {
      id: 'test-3',
      name: 'Festa de 15 Anos - Maria',
      produtor_id: user?.id || 'test-producer',
      data: '2024-02-25T19:00:00Z',
      local: 'Salão de Festas Cristal',
      descricao: 'Festa de debutante com tema princesa. 150 convidados.',
      status: 'open' as const,
      checkin_pin: '9012',
      functions: [
        { id: 'f7', cargo: 'Garçom', quantidade: 6, valor: '140.00', requirements: 'Experiência em festas' },
        { id: 'f8', cargo: 'DJ', quantidade: 1, valor: '300.00', requirements: 'Equipamento próprio' },
        { id: 'f9', cargo: 'Decorador', quantidade: 2, valor: '250.00', requirements: 'Portfolio comprovado' }
      ]
    }
  ];

  // Usar eventos de teste se não houver eventos reais
  const userEvents = user ? getEventsByProducer(user.id) : [];
  const displayEvents = userEvents.length > 0 ? userEvents : mockTestEvents;
  const userTeams = user ? getTeamsByProducer(user.id) : [];

  const handleCreateEvent = async (eventData: any) => {
    if (!user) return;
    
    const success = await createEvent({
      ...eventData,
      produtor_id: user.id,
      status: 'open' as const
    });

    if (success) {
      toast({
        title: "Evento criado!",
        description: "Seu evento foi publicado com sucesso."
      });
      setShowCreateEvent(false);
    }
  };

  const handleApplicationAction = async (applicationId: string, action: 'aprovado' | 'recusado') => {
    const success = await updateApplicationStatus(applicationId, action);
    if (success) {
      toast({
        title: action === 'aprovado' ? "Candidato aprovado!" : "Candidato recusado",
        description: `A candidatura foi ${action === 'aprovado' ? 'aprovada' : 'recusada'} com sucesso.`
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <ProducerHeader 
        user={user} 
        onLogout={logout} 
        onCreateEvent={() => setShowCreateEvent(true)} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="events" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid grid-cols-4 max-w-lg">
              <TabsTrigger value="events">Meus Eventos</TabsTrigger>
              <TabsTrigger value="applications">Candidaturas</TabsTrigger>
              <TabsTrigger value="finance">Financeiro</TabsTrigger>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
            </TabsList>
            
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => setShowCreateEvent(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Evento
            </Button>
          </div>

          <TabsContent value="events" className="space-y-6">
            {displayEvents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento criado</h3>
                  <p className="text-gray-500 mb-4">Comece criando seu primeiro evento.</p>
                  <Button onClick={() => setShowCreateEvent(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Evento
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {userEvents.length === 0 && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      📋 <strong>Dados de Demonstração:</strong> Os eventos abaixo são exemplos para demonstrar a funcionalidade de gerenciamento de PINs de check-in.
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayEvents.map(event => {
                    const eventApplications = getApplicationsByEvent(event.id);
                    const totalApplications = eventApplications.length || Math.floor(Math.random() * 15) + 5; // Mock data
                    const approvedApplications = eventApplications.filter(app => app.status === 'aprovado').length || Math.floor(totalApplications * 0.7);
                    
                    return (
                      <ProducerEventCard
                        key={event.id}
                        event={event}
                        totalApplications={totalApplications}
                        approvedApplications={approvedApplications}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <ApplicationsManager
              events={displayEvents}
              getApplicationsByEvent={getApplicationsByEvent}
              onApplicationAction={handleApplicationAction}
            />
          </TabsContent>

          <TabsContent value="finance" className="space-y-6">
            <Card>
              <CardContent className="text-center py-12">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Área Financeira</h3>
                  <p className="text-gray-500 mb-6">Gerencie seu saldo e aprove pagamentos de freelancers</p>
                  <Button onClick={() => navigate('/producer/finance')}>
                    Acessar Área Financeira
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProducerProfile
              user={user}
              events={displayEvents}
              getApplicationsByEvent={getApplicationsByEvent}
            />
          </TabsContent>
        </Tabs>
      </div>

      <CreateEventDialog
        open={showCreateEvent}
        onOpenChange={setShowCreateEvent}
        onCreateEvent={handleCreateEvent}
        availableTeams={userTeams}
      />
    </div>
  );
};

export default ProducerDashboard;
