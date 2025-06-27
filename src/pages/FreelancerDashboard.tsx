
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, User, Wallet, Heart, Search } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useNavigate } from 'react-router-dom';
import FreelancerHeader from '@/components/FreelancerHeader';
import EventCard from '@/components/EventCard';
import ApplicationsList from '@/components/ApplicationsList';
import FreelancerProfile from '@/components/FreelancerProfile';
import { useEvents } from '@/components/EventContext';

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const { events, getApplicationsByUser } = useEvents();
  const navigate = useNavigate();

  // Get user applications
  const userApplications = user ? getApplicationsByUser(user.id) : [];

  const stats = [
    { label: 'Eventos Aplicados', value: userApplications.length, trend: '+2 desde a última semana' },
    { label: 'Eventos Confirmados', value: userApplications.filter(app => app.status === 'aprovado').length, trend: '+1 desde ontem' },
    { label: 'Próximos Eventos', value: 3, trend: 'Nos próximos 7 dias' },
    { label: 'Ganhos Este Mês', value: 'R$ 2.850', trend: '+15% vs mês anterior' },
  ];

  // Function to handle event applications
  const handleApply = (eventId: string, functionId: string) => {
    console.log('Applying to event:', eventId, 'function:', functionId);
    // Here you would implement the application logic
  };

  // Function to get application status
  const getApplicationStatus = (eventId: string, functionId: string) => {
    const application = userApplications.find(
      app => app.function_id === functionId
    );
    return application?.status;
  };

  // Get recent events (first 3)
  const recentEvents = events.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <FreelancerHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base">Bem-vindo de volta, {user?.name}!</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate('/freelancer/profile')} variant="outline" size="sm" className="flex-1 sm:flex-none">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </Button>
            <Button onClick={() => navigate('/freelancer/calendar')} variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Calendar className="w-4 h-4 mr-2" />
              Agenda
            </Button>
            <Button onClick={() => navigate('/freelancer/finance')} variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Wallet className="w-4 h-4 mr-2" />
              Grana
            </Button>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-3 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Aplicados</CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 sm:p-6 sm:pt-0">
              <div className="text-lg sm:text-2xl font-bold">{stats[0].value}</div>
              <p className="text-xs text-muted-foreground hidden sm:block">{stats[0].trend}</p>
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Confirmados</CardTitle>
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 sm:p-6 sm:pt-0">
              <div className="text-lg sm:text-2xl font-bold">{stats[1].value}</div>
              <p className="text-xs text-muted-foreground hidden sm:block">{stats[1].trend}</p>
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Próximos</CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 sm:p-6 sm:pt-0">
              <div className="text-lg sm:text-2xl font-bold">{stats[2].value}</div>
              <p className="text-xs text-muted-foreground hidden sm:block">{stats[2].trend}</p>
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Ganhos</CardTitle>
              <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 sm:p-6 sm:pt-0">
              <div className="text-lg sm:text-2xl font-bold">{stats[3].value}</div>
              <p className="text-xs text-muted-foreground hidden sm:block">{stats[3].trend}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Eventos Recentes */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle className="text-lg sm:text-xl">Eventos Recentes</CardTitle>
                <CardDescription className="text-sm">Últimos eventos disponíveis</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/freelancer/favorites')}
                  className="w-full sm:w-auto"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Favoritos
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/freelancer/search-events')}
                  className="w-full sm:w-auto"
                >
                  <Search className="w-4 h-4 mr-1" />
                  Buscar Eventos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onApply={handleApply}
                    getApplicationStatus={getApplicationStatus}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Grid para Desktop, Stack para Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Próximos Eventos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Próximos Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Festival de Música 2024', date: '2024-12-31', time: '20:00', role: 'Fotógrafo' },
                    { name: 'Casamento Maria & Pedro', date: '2024-07-15', time: '16:00', role: 'Garçom' },
                    { name: 'Evento Corporativo XYZ', date: '2024-08-20', time: '08:00', role: 'Recepcionista' }
                  ].map((event, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{event.name}</p>
                        <p className="text-xs text-gray-600">{event.date} - {event.time}</p>
                        <p className="text-xs text-blue-600">{event.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  size="sm"
                  onClick={() => navigate('/freelancer/calendar')}
                >
                  Ver Calendário Completo
                </Button>
              </CardContent>
            </Card>

            {/* Minhas Aplicações */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Minhas Aplicações</CardTitle>
              </CardHeader>
              <CardContent>
                <ApplicationsList 
                  userApplications={userApplications}
                  events={events}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
