import React from 'react';
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

  const stats = [
    { label: 'Eventos Aplicados', value: 12, trend: '+2 desde a última semana' },
    { label: 'Eventos Confirmados', value: 5, trend: '+1 desde ontem' },
    { label: 'Próximos Eventos', value: 3, trend: 'Nos próximos 7 dias' },
    { label: 'Ganhos Este Mês', value: 'R$ 2.850', trend: '+15% vs mês anterior' },
  ];

  const data = [
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Fev', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Abr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Mai', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <FreelancerHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Bem-vindo de volta, {user?.name}!</p>
          </div>
          <div className="flex space-x-4">
            <Button onClick={() => navigate('/freelancer/profile')} variant="outline">
              <User className="w-4 h-4 mr-2" />
              Meu Perfil
            </Button>
            <Button onClick={() => navigate('/freelancer/calendar')} variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Calendário
            </Button>
            <Button onClick={() => navigate('/freelancer/finance')} variant="outline">
              <Wallet className="w-4 h-4 mr-2" />
              Financeiro
            </Button>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Eventos Disponíveis */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Eventos Disponíveis</CardTitle>
                  <CardDescription>Novos eventos em sua área</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/freelancer/favorites')}
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    Favoritos
                  </Button>
                  <EventFilters />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.slice(0, 5).map((event) => (
                    <EventCard key={event.id} event={event} />
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
                <CardTitle>Meu Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <FreelancerProfile />
              </CardContent>
            </Card>

            {/* Próximos Eventos */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((event) => (
                    <div key={event} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Evento {event}</p>
                        <p className="text-xs text-gray-600">25 Jan, 14:00</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/freelancer/calendar')}
                >
                  Ver Calendário Completo
                </Button>
              </CardContent>
            </Card>

            {/* Minhas Aplicações */}
            <Card>
              <CardHeader>
                <CardTitle>Minhas Aplicações</CardTitle>
              </CardHeader>
              <CardContent>
                <ApplicationsList />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
