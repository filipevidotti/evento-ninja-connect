
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, Users, CheckCircle, Clock, Search, QrCode, Key } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useEvents } from '@/components/EventContext';
import ProducerHeader from '@/components/ProducerHeader';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { toast } from '@/hooks/use-toast';

const ProducerCheckIn = () => {
  const { user, logout } = useAuth();
  const { events, getEventsByProducer } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/producer/dashboard' },
    { label: 'Check-in Eventos' }
  ];

  // Eventos de teste para demonstração
  const mockEvents = [
    {
      id: 'test-1',
      name: 'Casamento Silva & Santos',
      produtor_id: user?.id || 'test-producer',
      data: '2024-02-15T18:00:00Z',
      local: 'Buffet Elegance - Salão Principal',
      descricao: 'Cerimônia de casamento com 200 convidados',
      status: 'open' as const,
      checkin_pin: '1234',
      producer_name: 'Test Producer',
      created_at: '2024-01-01T00:00:00Z',
      functions: [
        { id: 'f1', cargo: 'Garçom', quantidade: 8, valor: 150.00, requirements: 'Experiência mínima de 1 ano' }
      ],
      checkins: [
        { id: 'c1', user_name: 'João Silva', function: 'Garçom', time: '2024-02-15T17:30:00Z' },
        { id: 'c2', user_name: 'Maria Santos', function: 'Recepcionista', time: '2024-02-15T17:45:00Z' }
      ]
    },
    {
      id: 'test-2',
      name: 'Evento Corporativo TechCorp',
      produtor_id: user?.id || 'test-producer',
      data: '2024-02-20T14:00:00Z',
      local: 'Centro de Convenções - Auditório A',
      descricao: 'Convenção anual da empresa',
      status: 'open' as const,
      checkin_pin: '5678',
      producer_name: 'Test Producer',
      created_at: '2024-01-01T00:00:00Z',
      functions: [
        { id: 'f4', cargo: 'Hostess', quantidade: 4, valor: 130.00, requirements: 'Inglês fluente' }
      ],
      checkins: [
        { id: 'c3', user_name: 'Pedro Costa', function: 'Hostess', time: '2024-02-20T13:30:00Z' }
      ]
    }
  ];

  const userEvents = user ? getEventsByProducer(user.id) : [];
  const displayEvents = userEvents.length > 0 ? userEvents : mockEvents;

  const filteredEvents = displayEvents.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.local.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEvent = () => {
    // Placeholder function
  };

  const handleGenerateQR = (eventId: string) => {
    toast({
      title: "QR Code Gerado!",
      description: "QR Code para check-in foi gerado com sucesso."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProducerHeader user={user} onLogout={logout} onCreateEvent={handleCreateEvent} />
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Check-in de Eventos
              </h1>
            </div>
            <Badge variant="secondary" className="text-sm sm:text-lg px-3 py-1 sm:px-4 sm:py-2 self-start sm:self-center">
              {displayEvents.length} eventos
            </Badge>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            Gerencie o check-in dos freelancers em seus eventos
          </p>
        </div>

        {/* Busca */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar eventos por nome ou local..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Eventos */}
        <div className="space-y-6">
          {filteredEvents.map(event => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{event.name}</CardTitle>
                    <CardDescription>{event.descricao}</CardDescription>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.data).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.local}
                      </div>
                    </div>
                  </div>
                  <Badge variant={event.status === 'open' ? 'default' : 'secondary'}>
                    {event.status === 'open' ? 'Ativo' : 'Fechado'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="checkin" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="checkin">Check-in</TabsTrigger>
                    <TabsTrigger value="settings">Configurações</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="checkin" className="space-y-4">
                    {/* Status de Check-ins */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold">8</div>
                          <div className="text-sm text-gray-600">Esperados</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{event.checkins?.length || 0}</div>
                          <div className="text-sm text-gray-600">Check-in Feito</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold">{8 - (event.checkins?.length || 0)}</div>
                          <div className="text-sm text-gray-600">Pendentes</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Lista de Check-ins */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Check-ins Realizados</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {event.checkins && event.checkins.length > 0 ? (
                          <div className="space-y-3">
                            {event.checkins.map(checkin => (
                              <div key={checkin.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarFallback>{checkin.user_name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{checkin.user_name}</p>
                                    <p className="text-sm text-gray-600">{checkin.function}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Check-in Feito
                                  </Badge>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(checkin.time).toLocaleTimeString('pt-BR')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Nenhum check-in realizado ainda</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4">
                    {/* PIN de Check-in */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Key className="w-5 h-5 mr-2" />
                          PIN de Check-in
                        </CardTitle>
                        <CardDescription>
                          Compartilhe este PIN com os freelancers para que possam fazer check-in
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 p-4 bg-gray-50 rounded-lg text-center">
                            <div className="text-3xl font-mono font-bold text-blue-600">
                              {event.checkin_pin}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => handleGenerateQR(event.id)}
                          >
                            <QrCode className="w-4 h-4 mr-2" />
                            Gerar QR
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Funções do Evento */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Funções do Evento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {event.functions.map(func => (
                            <div key={func.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <span className="font-medium">{func.cargo}</span>
                                <span className="text-gray-600 ml-2">({func.quantidade} vagas)</span>
                              </div>
                              <span className="text-green-600 font-medium">R$ {func.valor}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Tente ajustar sua busca' : 'Crie eventos para gerenciar check-ins'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProducerCheckIn;
