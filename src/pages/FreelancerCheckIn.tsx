
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  PlayCircle,
  StopCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FreelancerHeader from '@/components/FreelancerHeader';

const FreelancerCheckIn = () => {
  const navigate = useNavigate();
  const [checkedInEvents, setCheckedInEvents] = useState<string[]>([]);
  const [checkedOutEvents, setCheckedOutEvents] = useState<string[]>([]);

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
      checkinRequired: true,
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
      checkinRequired: true,
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
      checkinRequired: true,
      coordinates: { lat: -19.9191, lng: -43.9386 }
    }
  ];

  const handleCheckIn = (eventId: string) => {
    setCheckedInEvents(prev => [...prev, eventId]);
    console.log('Check-in realizado para evento:', eventId);
  };

  const handleCheckOut = (eventId: string) => {
    setCheckedOutEvents(prev => [...prev, eventId]);
    console.log('Check-out realizado para evento:', eventId);
  };

  const isCheckedIn = (eventId: string) => checkedInEvents.includes(eventId);
  const isCheckedOut = (eventId: string) => checkedOutEvents.includes(eventId);

  const getEventStatus = (event: any) => {
    if (isCheckedOut(event.id)) return 'completed';
    if (isCheckedIn(event.id)) return 'in-progress';
    return 'pending';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Concluído</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">Em Andamento</Badge>;
      case 'pending':
        return <Badge className="bg-gray-500">Pendente</Badge>;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <FreelancerHeader />
      
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/freelancer/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Check-in / Check-out</h1>
              <p className="text-gray-600">Registre sua presença nos eventos</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Hoje: {getCurrentDate()}</p>
            <p className="text-lg font-medium">{getCurrentTime()}</p>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Faça check-in ao chegar no local do evento e check-out ao finalizar suas atividades. 
            Isso garante o controle de presença e o pagamento correto.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {confirmedEvents.map((event) => {
            const status = getEventStatus(event);
            const checkedIn = isCheckedIn(event.id);
            const checkedOut = isCheckedOut(event.id);

            return (
              <Card key={event.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Produtor: {event.producer}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Event Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Função: </span>
                        <span className="font-medium">{event.role}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Pagamento: </span>
                        <span className="font-medium text-green-600">R$ {event.payment}</span>
                      </div>
                    </div>

                    {/* Check-in/Check-out Actions */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {checkedIn && (
                            <div className="flex items-center space-x-2 text-sm text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>Check-in realizado</span>
                            </div>
                          )}
                          {checkedOut && (
                            <div className="flex items-center space-x-2 text-sm text-blue-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>Check-out realizado</span>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          {!checkedIn && !checkedOut && (
                            <Button
                              onClick={() => handleCheckIn(event.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Fazer Check-in
                            </Button>
                          )}

                          {checkedIn && !checkedOut && (
                            <Button
                              onClick={() => handleCheckOut(event.id)}
                              variant="outline"
                              className="border-blue-600 text-blue-600 hover:bg-blue-50"
                            >
                              <StopCircle className="w-4 h-4 mr-2" />
                              Fazer Check-out
                            </Button>
                          )}

                          {checkedOut && (
                            <Button variant="outline" disabled>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Evento Concluído
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Additional Actions */}
                    {(checkedIn || checkedOut) && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Ações Adicionais</h4>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">
                            <Camera className="w-4 h-4 mr-2" />
                            Tirar Foto
                          </Button>
                          <Button variant="outline" size="sm">
                            <Users className="w-4 h-4 mr-2" />
                            Ver Equipe
                          </Button>
                          <Button variant="outline" size="sm">
                            <MapPin className="w-4 h-4 mr-2" />
                            Ver Localização
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
    </div>
  );
};

export default FreelancerCheckIn;
