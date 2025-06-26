
import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useEvents } from '@/components/EventContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Briefcase } from 'lucide-react';

import ProducerHeader from '@/components/ProducerHeader';
import CreateEventDialog from '@/components/CreateEventDialog';
import ProducerEventCard from '@/components/ProducerEventCard';
import ApplicationsManager from '@/components/ApplicationsManager';
import ProducerProfile from '@/components/ProducerProfile';

const ProducerDashboard = () => {
  const { user, logout } = useAuth();
  const { events, createEvent, updateApplicationStatus, getEventsByProducer, getApplicationsByEvent } = useEvents();
  const { toast } = useToast();
  
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const userEvents = user ? getEventsByProducer(user.id) : [];

  const handleCreateEvent = (eventData: any) => {
    if (!user) return;
    
    createEvent({
      ...eventData,
      producerId: user.id,
      producerName: user.name,
      status: 'open'
    });

    toast({
      title: "Evento criado!",
      description: "Seu evento foi publicado com sucesso."
    });
  };

  const handleApplicationAction = (applicationId: string, action: 'approved' | 'rejected') => {
    updateApplicationStatus(applicationId, action);
    toast({
      title: action === 'approved' ? "Candidato aprovado!" : "Candidato recusado",
      description: `A candidatura foi ${action === 'approved' ? 'aprovada' : 'recusada'} com sucesso.`
    });
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
            <TabsList className="grid grid-cols-3 max-w-md">
              <TabsTrigger value="events">Meus Eventos</TabsTrigger>
              <TabsTrigger value="applications">Candidaturas</TabsTrigger>
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
            {userEvents.length === 0 ? (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userEvents.map(event => {
                  const eventApplications = getApplicationsByEvent(event.id);
                  const totalApplications = eventApplications.length;
                  const approvedApplications = eventApplications.filter(app => app.status === 'approved').length;
                  
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
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <ApplicationsManager
              events={userEvents}
              getApplicationsByEvent={getApplicationsByEvent}
              onApplicationAction={handleApplicationAction}
            />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProducerProfile
              user={user}
              events={userEvents}
              getApplicationsByEvent={getApplicationsByEvent}
            />
          </TabsContent>
        </Tabs>
      </div>

      <CreateEventDialog
        open={showCreateEvent}
        onOpenChange={setShowCreateEvent}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
};

export default ProducerDashboard;
