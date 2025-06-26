
import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useEvents } from '@/components/EventContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';
import FreelancerHeader from '@/components/FreelancerHeader';
import EventFilters from '@/components/EventFilters';
import EventCard from '@/components/EventCard';
import ApplicationsList from '@/components/ApplicationsList';
import FreelancerProfile from '@/components/FreelancerProfile';

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const { events, applyToEvent, getApplicationsByUser } = useEvents();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterCity, setFilterCity] = useState('all');

  const userApplications = user ? getApplicationsByUser(user.id) : [];
  
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || 
                       event.functions.some(func => func.role.toLowerCase().includes(filterRole.toLowerCase()));
    const matchesCity = filterCity === 'all' || event.city === filterCity;
    const isOpen = event.status === 'open';
    
    return matchesSearch && matchesRole && matchesCity && isOpen;
  });

  const handleApply = (eventId: string, functionId: string) => {
    if (!user) return;
    
    const hasApplied = userApplications.some(app => 
      app.eventId === eventId && app.functionId === functionId
    );
    
    if (hasApplied) {
      toast({
        title: "Já candidatado",
        description: "Você já se candidatou para esta função.",
        variant: "destructive"
      });
      return;
    }
    
    applyToEvent(eventId, functionId, user.id, user.name, user.email);
    toast({
      title: "Candidatura enviada!",
      description: "Sua candidatura foi enviada com sucesso."
    });
  };

  const getApplicationStatus = (eventId: string, functionId: string) => {
    return userApplications.find(app => 
      app.eventId === eventId && app.functionId === functionId
    )?.status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <FreelancerHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="applications">Candidaturas</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <EventFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterRole={filterRole}
              setFilterRole={setFilterRole}
              filterCity={filterCity}
              setFilterCity={setFilterCity}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onApply={handleApply}
                  getApplicationStatus={getApplicationStatus}
                />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
                  <p className="text-gray-500">Tente ajustar os filtros de busca.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <ApplicationsList userApplications={userApplications} events={events} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <FreelancerProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
