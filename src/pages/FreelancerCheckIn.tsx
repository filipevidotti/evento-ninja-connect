
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Camera, 
  Users, 
  ArrowLeft,
  AlertCircle,
  Key,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FreelancerHeader from '@/components/FreelancerHeader';
import CheckinPinDialog from '@/components/CheckinPinDialog';
import { useCheckin } from '@/hooks/useCheckin';

const FreelancerCheckIn = () => {
  const navigate = useNavigate();
  const [selectedEventForCheckin, setSelectedEventForCheckin] = useState<string | null>(null);
  const { hasCheckedIn, getCheckinTime } = useCheckin();

  // Mock data for events the freelancer is confirmed for
  const confirmedEvents = [
    {
      id: '1',
      title: 'Festival de Música 2024',
      date: '2024-12-31',
      startTime: '20:00',
      endTime: '02:00',
      location: 'Parque Ibirapuera, São Paulo - SP',
      producer: 'João Silva',
      role: 'Fotógrafo',
      payment: 500,
      status: 'confirmed',
      pinCode: '1234', // Visível para demonstração
      coordinates: { lat: -23.5505, lng: -46.6433 }
    },
    {
      id: '2',
      title: 'Casamento Maria & Pedro',
      date: '2024-07-15',
      startTime: '16:00',
      endTime: '23:00',
      location: 'Salão de Festas Premium, Rio de Janeiro - RJ',
      producer: 'Maria Silva',
      role: 'Garçom',
      payment: 250,
      status: 'confirmed',
      pinCode: '5678',
      coordinates: { lat: -22.9068, lng: -43.1729 }
    },
    {
      id: '3',
      title: 'Evento Corporativo XYZ',
      date: '2024-08-20',
      startTime: '08:00',
      endTime: '18:00',
      location: 'Centro de Convenções, Belo Horizonte - MG',
      producer: 'Ana Costa',
      role: 'Recepcionista',
      payment: 200,
      status: 'confirmed',
      pinCode: '9012',
      coordinates: { lat: -19.9191, lng: -43.9386 }
    }
  ];

  const handleCheckinClick = (eventId: string) => {
    setSelectedEventForCheckin(eventId);
  };

  const getEventStatus = (eventId: string) => {
    if (hasCheckedIn(eventId)) return 'checked-in';
    return 'pending';
  };

  const getStatusBadge = (eventId: string) => {
    const status = getEventStatus(eventId);
    switch (status) {
      case 'checked-in':
        return <Badge className="bg-green-500">Check-in Realizado</Badge>;
      case 'pending':
        return <Badge className="bg-gray-500">Aguardando Check-in</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('pt-BR');
  };

  const selectedEvent = confirmedEvents.find(e => e.id === selectedEventForCheckin);

  return (
    <div className="min-h-screen bg-gray-50">
      <FreelancerHeader />
      
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Mobile-friendly header */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/freelancer/dashboard')}
            className="flex items-center space-x-2 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Check-in nos Eventos</h1>
              <p className="text-gray-600">Registre sua presença usando o PIN do evento</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-600">Hoje: {getCurrentDate()}</p>
              <p className="text-lg font-medium">{getCurrentTime()}</p>
            </div>
          </div>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Para fazer check-in, você precisará do PIN único fornecido pelo organizador do evento. 
            Este PIN garante que apenas pessoas autorizadas possam registrar presença.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {confirmedEvents.map((event) => {
            const checkedIn = hasCheckedIn(event.id);
            const checkinTime = getCheckinTime(event.id);

            return (
              <Card key={event.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg sm:text-xl">{event.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Produtor: {event.producer}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(event.id)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Event Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:col-span-2 lg:col-span-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Função: </span>
                        <span className="font-medium">{event.role}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Pagamento: </span>
                        <span className="font-medium text-green-600">R$ {event.payment}</span>
                      </div>
                    </div>

                    {/* PIN Code Display (for demo purposes) */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Key className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">PIN do Evento (Demo)</span>
                      </div>
                      <div className="font-mono text-2xl font-bold text-blue-700 tracking-widest">
                        {event.pinCode}
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        Use este PIN para fazer check-in
                      </p>
                    </div>

                    {/* Check-in Status */}
                    {checkedIn && checkinTime && (
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-900">Check-in Realizado</span>
                        </div>
                        <p className="text-sm text-green-700">
                          Horário: {new Date(checkinTime).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    )}

                    {/* Check-in Action */}
                    <div className="border-t pt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-2">
                          {checkedIn ? (
                            <div className="flex items-center space-x-2 text-sm text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>Presença registrada</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>Aguardando check-in</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          {!checkedIn ? (
                            <Button
                              onClick={() => handleCheckinClick(event.id)}
                              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                            >
                              <Key className="w-4 h-4 mr-2" />
                              Fazer Check-in
                            </Button>
                          ) : (
                            <Button variant="outline" disabled className="w-full sm:w-auto">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Check-in Concluído
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Additional Actions for checked-in events */}
                    {checkedIn && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Ações Disponíveis</h4>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" className="flex-1 min-w-0 sm:flex-none">
                            <Camera className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Tirar Foto</span>
                            <span className="sm:hidden">Foto</span>
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 min-w-0 sm:flex-none">
                            <Users className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Ver Equipe</span>
                            <span className="sm:hidden">Equipe</span>
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 min-w-0 sm:flex-none">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Ver Localização</span>
                            <span className="sm:hidden">Local</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {confirmedEvents.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento confirmado</h3>
              <p className="text-gray-500 mb-4">Você não possui eventos confirmados no momento.</p>
              <Button onClick={() => navigate('/freelancer/search-events')}>
                Buscar Eventos
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Check-in PIN Dialog */}
      {selectedEvent && (
        <CheckinPinDialog
          open={!!selectedEventForCheckin}
          onOpenChange={(open) => !open && setSelectedEventForCheckin(null)}
          eventId={selectedEvent.id}
          eventName={selectedEvent.title}
        />
      )}
    </div>
  );
};

export default FreelancerCheckIn;
