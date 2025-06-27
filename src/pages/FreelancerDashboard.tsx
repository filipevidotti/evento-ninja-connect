
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, User, Wallet, Heart } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useNavigate } from 'react-router-dom';
import FreelancerHeader from '@/components/FreelancerHeader';
import EventCard from '@/components/EventCard';
import EventFilters from '@/components/EventFilters';
import ApplicationsList from '@/components/ApplicationsList';
import FreelancerProfile from '@/components/FreelancerProfile';
import { useEvents } from '@/components/EventContext';

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const { events } = useEvents();
  const navigate = useNavigate();

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterCity, setFilterCity] = useState('all');

  // Mock user applications for now - this should come from a context or API
  const [userApplications] = useState([]);

  const stats = [
    { label: 'Eventos Aplicados', value: 12, trend: '+2 desde a última semana' },
    { label: 'Eventos Confirmados', value: 5, trend: '+1 desde ontem' },
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
    // This would check the user's applications for this event/function
    const application = userApplications.find(
      app => app.eventId === eventId && app.functionId === functionId
    );
    return application?.status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FreelancerHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base">Bem-vindo de volta, {user?.name}!</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:space-x-4 sm:gap-0">
            <Button onClick={() => navigate('/freelancer/profile')} variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Meu Perfil</span>
              <span className="sm:hidden">Perfil</span>
            </Button>
            <Button onClick={() => navigate('/freelancer/calendar')} variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Calendário</span>
              <span className="sm:hidden">Agenda</span>
            </Button>
            <Button onClick={() => navigate('/freelancer/finance')} variant="outline" size="sm">
              <Wallet className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Financeiro</span>
              <span className="sm:hidden">Grana</span>
            </Button>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos Aplicados</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 desde a última semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos Confirmados</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">+1 desde ontem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximos Eventos</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Nos próximos 7 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ganhos Este Mês</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 2.850</div>
              <p className="text-xs text-muted-foreground">+15% vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Eventos Disponíveis */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Eventos Disponíveis</CardTitle>
                  <CardDescription className="text-sm">Novos eventos em sua área</CardDescription>
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
                  <div className="w-full sm:w-auto">
                    <EventFilters 
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      filterRole={filterRole}
                      setFilterRole={setFilterRole}
                      filterCity={filterCity}
                      setFilterCity={setFilterCity}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.slice(0, 5).map((event) => (
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Perfil Rápido */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Meu Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <FreelancerProfile />
              </CardContent>
            </Card>

            {/* Próximos Eventos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Próximos Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((event) => (
                    <div key={event} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">Evento {event}</p>
                        <p className="text-xs text-gray-600">25 Jan, 14:00</p>
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
