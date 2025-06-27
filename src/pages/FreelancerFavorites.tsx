
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Star, MapPin, Calendar, Building, Search, Filter, Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FreelancerHeader from '@/components/FreelancerHeader';

const FreelancerFavorites = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('all');

  const favoriteProducers = [
    {
      id: 1,
      name: 'Maria Silva',
      company: 'Eventos Premium',
      rating: 4.8,
      totalEvents: 12,
      lastEvent: '2024-01-15',
      avatar: null
    },
    {
      id: 2,
      name: 'João Santos',
      company: 'Santos Produções',
      rating: 4.9,
      totalEvents: 8,
      lastEvent: '2024-01-10',
      avatar: null
    },
    {
      id: 3,
      name: 'Ana Costa',
      company: 'Costa Events',
      rating: 4.7,
      totalEvents: 15,
      lastEvent: '2024-01-08',
      avatar: null
    }
  ];

  const savedEvents = [
    {
      id: 1,
      title: 'Festival de Música 2024',
      date: '2024-12-31',
      location: 'São Paulo - SP',
      producer: 'João Silva',
      role: 'Fotógrafo',
      payment: 500,
      status: 'open',
      applicants: 8,
      maxApplicants: 15
    },
    {
      id: 2,
      title: 'Casamento Maria & Pedro',
      date: '2024-07-15',
      location: 'Rio de Janeiro - RJ',
      producer: 'Maria Silva',
      role: 'Garçom',
      payment: 250,
      status: 'few-spots',
      applicants: 12,
      maxApplicants: 15
    },
    {
      id: 3,
      title: 'Evento Corporativo XYZ',
      date: '2024-08-20',
      location: 'Belo Horizonte - MG',
      producer: 'Ana Costa',
      role: 'Recepcionista',
      payment: 200,
      status: 'open',
      applicants: 3,
      maxApplicants: 20
    },
    {
      id: 4,
      title: 'Festa de Aniversário 50 Anos',
      date: '2024-09-10',
      location: 'Brasília - DF',
      producer: 'João Santos',
      role: 'DJ',
      payment: 800,
      status: 'closed',
      applicants: 20,
      maxApplicants: 20
    }
  ];

  const getEventStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-500">Aberto</Badge>;
      case 'few-spots':
        return <Badge className="bg-yellow-500">Poucas Vagas</Badge>;
      case 'closed':
        return <Badge className="bg-red-500">Fechado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const toggleFavorite = (producerId: number) => {
    console.log('Toggle favorite for producer:', producerId);
  };

  const applyToEvent = (eventId: number) => {
    console.log('Apply to event:', eventId);
  };

  const filteredEvents = savedEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.producer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = eventFilter === 'all' || event.status === eventFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <FreelancerHeader />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
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
          
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Favoritos e Histórico</h1>
              <p className="text-gray-600">Gerencie seus produtores favoritos e eventos salvos</p>
            </div>
            <Button onClick={() => navigate('/freelancer/search-events')} className="w-full sm:w-auto">
              <Search className="w-4 h-4 mr-2" />
              Buscar Eventos
            </Button>
          </div>
        </div>

        <Tabs defaultValue="producers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="producers">Produtores Favoritos</TabsTrigger>
            <TabsTrigger value="events">Eventos Salvos</TabsTrigger>
          </TabsList>

          <TabsContent value="producers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Produtores Favoritos</CardTitle>
                <CardDescription>
                  Seus produtores preferidos e histórico de trabalho
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteProducers.map((producer) => (
                    <Card key={producer.id} className="relative">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {producer.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium truncate">{producer.name}</h3>
                              <p className="text-sm text-gray-600 flex items-center">
                                <Building className="w-3 h-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{producer.company}</span>
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(producer.id)}
                            className="flex-shrink-0"
                          >
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                          </Button>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Avaliação:</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{producer.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Eventos Trabalhados:</span>
                            <span className="font-medium">{producer.totalEvents}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Último Evento:</span>
                            <span className="font-medium">{producer.lastEvent}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Button variant="outline" className="w-full" size="sm">
                            Ver Perfil
                          </Button>
                          <Button variant="outline" className="w-full" size="sm">
                            <Send className="w-4 h-4 mr-2" />
                            Enviar Mensagem
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            {/* Filtros - Mobile responsive */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar eventos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="w-full">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="open">Aberto</SelectItem>
                      <SelectItem value="few-spots">Poucas Vagas</SelectItem>
                      <SelectItem value="closed">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Eventos Salvos */}
            <Card>
              <CardHeader>
                <CardTitle>Eventos Salvos</CardTitle>
                <CardDescription>
                  Eventos que você salvou para acompanhar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <Card key={event.id} className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-lg break-words">{event.title}</h3>
                          <p className="text-gray-600 text-sm">{event.producer}</p>
                        </div>
                        <div className="flex items-center space-x-2 sm:flex-shrink-0">
                          {getEventStatusBadge(event.status)}
                          <Button variant="ghost" size="sm">
                            <Heart className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="break-words">{event.location}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Função: </span>
                          <span className="font-medium">{event.role}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Pagamento: </span>
                          <span className="font-medium text-green-600">R$ {event.payment}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="text-sm text-gray-600">
                          <span>Candidatos: {event.applicants}/{event.maxApplicants}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            Ver Detalhes
                          </Button>
                          {event.status !== 'closed' && (
                            <Button 
                              size="sm"
                              onClick={() => applyToEvent(event.id)}
                              className="w-full sm:w-auto"
                            >
                              Aplicar Agora
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FreelancerFavorites;
