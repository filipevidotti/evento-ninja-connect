
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Calendar, Users, DollarSign, Heart } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useNavigate } from 'react-router-dom';
import FreelancerHeader from '@/components/FreelancerHeader';
import { useEvents } from '@/components/EventContext';

const FreelancerSearchEvents = () => {
  const { user } = useAuth();
  const { events, getApplicationsByUser, applyToEvent } = useEvents();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const userApplications = user ? getApplicationsByUser(user.id) : [];

  // Function to get application status
  const getApplicationStatus = (functionId: string) => {
    const application = userApplications.find(app => app.function_id === functionId);
    return application?.status;
  };

  // Function to handle applications
  const handleApply = async (eventId: string, functionId: string) => {
    if (!user) return;
    
    const success = await applyToEvent(functionId);
    if (success) {
      console.log('Applied successfully!');
    }
  };

  // Filter and sort events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    const hasRoleMatch = filterRole === 'all' || 
                        event.functions.some(func => func.cargo.toLowerCase().includes(filterRole.toLowerCase()));
    
    const matchesCity = filterCity === 'all' || 
                       event.local.toLowerCase().includes(filterCity.toLowerCase());
    
    return matchesSearch && hasRoleMatch && matchesCity && event.status === 'open';
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.data).getTime() - new Date(b.data).getTime();
      case 'payment':
        const maxPaymentA = Math.max(...a.functions.map(f => f.valor));
        const maxPaymentB = Math.max(...b.functions.map(f => f.valor));
        return maxPaymentB - maxPaymentA;
      case 'recent':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  // Get unique cities and roles for filters
  const cities = [...new Set(events.map(event => event.local.split(' - ')[1] || event.local))];
  const roles = [...new Set(events.flatMap(event => event.functions.map(func => func.cargo)))];

  return (
    <div className="min-h-screen bg-gray-50">
      <FreelancerHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Buscar Eventos</h1>
            <p className="text-gray-600">Encontre oportunidades perfeitas para você</p>
          </div>
          <Button onClick={() => navigate('/freelancer/favorites')} variant="outline">
            <Heart className="w-4 h-4 mr-2" />
            Meus Favoritos
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtros de Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Funções</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role} value={role.toLowerCase()}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterCity} onValueChange={setFilterCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Cidades</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Data do Evento</SelectItem>
                  <SelectItem value="payment">Maior Pagamento</SelectItem>
                  <SelectItem value="recent">Mais Recentes</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterRole('all');
                  setFilterCity('all');
                  setSortBy('date');
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{event.name}</CardTitle>
                    <CardDescription className="mt-1">{event.descricao}</CardDescription>
                  </div>
                  <Badge variant="secondary">{event.status === 'open' ? 'Aberto' : 'Fechado'}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(event.data).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{event.local}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Funções Disponíveis:</h4>
                    <div className="space-y-2">
                      {event.functions.map((func) => {
                        const applicationStatus = getApplicationStatus(func.id);
                        
                        return (
                          <div key={func.id} className="border rounded-lg p-3 bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{func.cargo}</h5>
                              <div className="flex items-center space-x-2">
                                <span className="text-green-600 font-medium">R$ {func.valor}</span>
                                {applicationStatus && (
                                  <Badge 
                                    variant={
                                      applicationStatus === 'aprovado' ? 'default' :
                                      applicationStatus === 'pendente' ? 'secondary' : 'destructive'
                                    }
                                  >
                                    {applicationStatus === 'aprovado' ? 'Aprovado' :
                                     applicationStatus === 'pendente' ? 'Pendente' : 'Recusado'}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <Users className="w-3 h-3" />
                                  <span>{func.quantidade} vaga{func.quantidade !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="w-3 h-3" />
                                  <span>R$ {func.valor}</span>
                                </div>
                              </div>
                              {!applicationStatus ? (
                                <Button 
                                  size="sm"
                                  onClick={() => handleApply(event.id, func.id)}
                                >
                                  Candidatar-se
                                </Button>
                              ) : (
                                <span className="text-xs text-gray-500">Já aplicado</span>
                              )}
                            </div>
                            {func.requirements && (
                              <p className="text-xs text-gray-600 mt-2">
                                <strong>Requisitos:</strong> {func.requirements}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
              <p className="text-gray-500 mb-4">Tente ajustar seus filtros ou buscar por outros termos.</p>
              <Button onClick={() => {
                setSearchTerm('');
                setFilterRole('all');
                setFilterCity('all');
              }}>
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FreelancerSearchEvents;
