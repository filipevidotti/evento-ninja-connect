
import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useEvents } from '@/components/EventContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  User, 
  Star, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Users
} from 'lucide-react';

const FreelancerDashboard = () => {
  const { user, logout } = useAuth();
  const { events, applications, applyToEvent, getApplicationsByUser } = useEvents();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EventConnect
              </h1>
              <Badge variant="secondary">Freelancer</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{user?.rating || 'Novo'}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={logout}>Sair</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="applications">Candidaturas</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Buscar Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Buscar</label>
                    <Input
                      placeholder="Nome do evento ou local..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Função</label>
                    <Select value={filterRole} onValueChange={setFilterRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas as funções" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as funções</SelectItem>
                        <SelectItem value="garçom">Garçom</SelectItem>
                        <SelectItem value="caixa">Operador de Caixa</SelectItem>
                        <SelectItem value="segurança">Segurança</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cidade</label>
                    <Select value={filterCity} onValueChange={setFilterCity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas as cidades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as cidades</SelectItem>
                        <SelectItem value="São Paulo">São Paulo</SelectItem>
                        <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.location}, {event.city}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {event.producerName}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Vagas Disponíveis:</h4>
                      {event.functions.map(func => {
                        const applicationStatus = getApplicationStatus(event.id, func.id);
                        return (
                          <div key={func.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{func.role}</span>
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {func.quantity}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1 text-green-600 font-medium mt-1">
                                <DollarSign className="w-4 h-4" />
                                R$ {func.salary}
                              </div>
                              {func.requirements && (
                                <p className="text-xs text-gray-500 mt-1">{func.requirements}</p>
                              )}
                            </div>
                            <div className="ml-4">
                              {applicationStatus ? (
                                <Badge className={`${getStatusColor(applicationStatus)} flex items-center gap-1`}>
                                  {getStatusIcon(applicationStatus)}
                                  {applicationStatus === 'approved' ? 'Aprovado' : 
                                   applicationStatus === 'rejected' ? 'Recusado' : 'Pendente'}
                                </Badge>
                              ) : (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleApply(event.id, func.id)}
                                >
                                  Candidatar
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
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
                  <p className="text-gray-500">Tente ajustar os filtros de busca.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Minhas Candidaturas</CardTitle>
                <CardDescription>
                  Acompanhe o status das suas candidaturas enviadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Você ainda não se candidatou a nenhum evento.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userApplications.map(application => {
                      const event = events.find(e => e.id === application.eventId);
                      const eventFunction = event?.functions.find(f => f.id === application.functionId);
                      
                      return (
                        <div key={application.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{event?.title}</h3>
                            <Badge className={`${getStatusColor(application.status)} flex items-center gap-1`}>
                              {getStatusIcon(application.status)}
                              {application.status === 'approved' ? 'Aprovado' : 
                               application.status === 'rejected' ? 'Recusado' : 'Pendente'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Função:</strong> {eventFunction?.role}</p>
                            <p><strong>Data:</strong> {event?.date ? new Date(event.date).toLocaleDateString('pt-BR') : 'N/A'}</p>
                            <p><strong>Local:</strong> {event?.location}</p>
                            <p><strong>Salário:</strong> R$ {eventFunction?.salary}</p>
                            <p><strong>Candidatura enviada:</strong> {new Date(application.appliedAt).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meu Perfil</CardTitle>
                <CardDescription>Gerencie suas informações profissionais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nome</label>
                    <Input value={user?.name || ''} disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium">E-mail</label>
                    <Input value={user?.email || ''} disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Cidade</label>
                    <Input value={user?.city || ''} disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Avaliação</label>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span>{user?.rating || 'Ainda não avaliado'}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Habilidades</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user?.skills?.map(skill => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    )) || <span className="text-gray-500">Nenhuma habilidade cadastrada</span>}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <p className="text-gray-600 mt-1">{user?.description || 'Nenhuma descrição cadastrada'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
