
import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useEvents, Event, EventFunction } from '@/components/EventContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar,
  MapPin,
  Plus,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Briefcase,
  Star
} from 'lucide-react';

const ProducerDashboard = () => {
  const { user, logout } = useAuth();
  const { events, applications, createEvent, updateApplicationStatus, getEventsByProducer, getApplicationsByEvent } = useEvents();
  const { toast } = useToast();
  
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    city: '',
    functions: [] as EventFunction[]
  });
  const [newFunction, setNewFunction] = useState({
    role: '',
    quantity: 1,
    salary: 0,
    requirements: ''
  });

  const userEvents = user ? getEventsByProducer(user.id) : [];

  const handleCreateEvent = () => {
    if (!user) return;
    
    if (!newEvent.title || !newEvent.date || !newEvent.location || newEvent.functions.length === 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios e adicione pelo menos uma função.",
        variant: "destructive"
      });
      return;
    }

    createEvent({
      ...newEvent,
      producerId: user.id,
      producerName: user.name,
      status: 'open'
    });

    toast({
      title: "Evento criado!",
      description: "Seu evento foi publicado com sucesso."
    });

    setNewEvent({
      title: '',
      description: '',
      date: '',
      location: '',
      city: '',
      functions: []
    });
    setShowCreateEvent(false);
  };

  const addFunction = () => {
    if (!newFunction.role || !newFunction.salary) {
      toast({
        title: "Erro",
        description: "Preencha pelo menos o cargo e salário.",
        variant: "destructive"
      });
      return;
    }

    const functionWithId = {
      ...newFunction,
      id: Math.random().toString(36).substr(2, 9)
    };

    setNewEvent({
      ...newEvent,
      functions: [...newEvent.functions, functionWithId]
    });

    setNewFunction({
      role: '',
      quantity: 1,
      salary: 0,
      requirements: ''
    });

    toast({
      title: "Função adicionada!",
      description: `${functionWithId.role} foi adicionado ao evento.`
    });
  };

  const removeFunction = (index: number) => {
    setNewEvent({
      ...newEvent,
      functions: newEvent.functions.filter((_, i) => i !== index)
    });
  };

  const handleApplicationAction = (applicationId: string, action: 'approved' | 'rejected') => {
    updateApplicationStatus(applicationId, action);
    toast({
      title: action === 'approved' ? "Candidato aprovado!" : "Candidato recusado",
      description: `A candidatura foi ${action === 'approved' ? 'aprovada' : 'recusada'} com sucesso.`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                EventConnect
              </h1>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">Produtor</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.city}</p>
                </div>
              </div>
              <Button variant="outline" onClick={logout}>Sair</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="events" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid grid-cols-3 max-w-md">
              <TabsTrigger value="events">Meus Eventos</TabsTrigger>
              <TabsTrigger value="applications">Candidaturas</TabsTrigger>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
            </TabsList>
            
            <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Evento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Novo Evento</DialogTitle>
                  <DialogDescription>
                    Preencha as informações do seu evento e adicione as funções necessárias.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome do Evento *</label>
                      <Input
                        placeholder="Ex: Festa Corporativa 2025"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data *</label>
                      <Input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descrição</label>
                    <Textarea
                      placeholder="Descreva seu evento..."
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Local *</label>
                      <Input
                        placeholder="Ex: Centro de Convenções"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cidade *</label>
                      <Input
                        placeholder="Ex: São Paulo"
                        value={newEvent.city}
                        onChange={(e) => setNewEvent({ ...newEvent, city: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  {/* Add Function Section */}
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-4">Adicionar Função</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Cargo *</label>
                        <Input
                          placeholder="Ex: Garçom"
                          value={newFunction.role}
                          onChange={(e) => setNewFunction({ ...newFunction, role: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Quantidade *</label>
                        <Input
                          type="number"
                          min="1"
                          value={newFunction.quantity}
                          onChange={(e) => setNewFunction({ ...newFunction, quantity: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Salário (R$) *</label>
                        <Input
                          type="number"
                          min="0"
                          value={newFunction.salary}
                          onChange={(e) => setNewFunction({ ...newFunction, salary: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Requisitos</label>
                        <Input
                          placeholder="Ex: Experiência mínima"
                          value={newFunction.requirements}
                          onChange={(e) => setNewFunction({ ...newFunction, requirements: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button type="button" variant="outline" onClick={addFunction} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Função
                    </Button>
                  </div>
                  
                  {/* Functions List */}
                  {newEvent.functions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Funções Adicionadas:</h4>
                      {newEvent.functions.map((func, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium">{func.role}</span>
                            <span className="text-sm text-gray-600 ml-2">
                              ({func.quantity}x) - R$ {func.salary}
                            </span>
                            {func.requirements && (
                              <p className="text-xs text-gray-500">{func.requirements}</p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFunction(index)}
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowCreateEvent(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateEvent} className="flex-1">
                      Criar Evento
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="events" className="space-y-6">
            {userEvents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento criado</h3>
                  <p className="text-gray-500 mb-4">Comece criando seu primeiro evento.</p>
                  <Button onClick={() => setShowCreateEvent(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Evento
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userEvents.map(event => {
                  const eventApplications = getApplicationsByEvent(event.id);
                  const totalApplications = eventApplications.length;
                  const approvedApplications = eventApplications.filter(app => app.status === 'approved').length;
                  
                  return (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <Badge variant={event.status === 'open' ? 'default' : 'secondary'}>
                            {event.status === 'open' ? 'Aberto' : event.status === 'closed' ? 'Fechado' : 'Concluído'}
                          </Badge>
                        </div>
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
                            <Users className="w-4 h-4" />
                            {totalApplications} candidaturas ({approvedApplications} aprovadas)
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Funções:</h4>
                          {event.functions.map(func => (
                            <div key={func.id} className="flex items-center justify-between text-sm">
                              <span>{func.role} ({func.quantity}x)</span>
                              <span className="text-green-600 font-medium">R$ {func.salary}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Candidaturas</CardTitle>
                <CardDescription>
                  Aprove ou recuse candidatos para seus eventos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Crie eventos para receber candidaturas.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userEvents.map(event => {
                      const eventApplications = getApplicationsByEvent(event.id);
                      
                      if (eventApplications.length === 0) return null;
                      
                      return (
                        <div key={event.id} className="border rounded-lg p-4">
                          <h3 className="font-medium text-lg mb-4">{event.title}</h3>
                          <div className="space-y-3">
                            {eventApplications.map(application => {
                              const eventFunction = event.functions.find(f => f.id === application.functionId);
                              
                              return (
                                <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <Avatar>
                                      <AvatarFallback>{application.userName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">{application.userName}</p>
                                      <p className="text-sm text-gray-600">{application.userEmail}</p>
                                      <p className="text-sm text-gray-600">
                                        <strong>Função:</strong> {eventFunction?.role}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Candidatou-se em {new Date(application.appliedAt).toLocaleDateString('pt-BR')}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {application.status === 'pending' ? (
                                      <>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleApplicationAction(application.id, 'rejected')}
                                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                          <XCircle className="w-4 h-4 mr-1" />
                                          Recusar
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={() => handleApplicationAction(application.id, 'approved')}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          <CheckCircle className="w-4 h-4 mr-1" />
                                          Aprovar
                                        </Button>
                                      </>
                                    ) : (
                                      <Badge 
                                        className={application.status === 'approved' ? 
                                          'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                      >
                                        {application.status === 'approved' ? (
                                          <><CheckCircle className="w-3 h-3 mr-1" />Aprovado</>
                                        ) : (
                                          <><XCircle className="w-3 h-3 mr-1" />Recusado</>
                                        )}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
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
                <CardDescription>Informações da sua conta como produtor</CardDescription>
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
                    <label className="text-sm font-medium">Tipo de Conta</label>
                    <div className="flex items-center gap-2 mt-2">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                      <span>Produtor de Eventos</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Estatísticas</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{userEvents.length}</div>
                      <div className="text-sm text-gray-600">Eventos Criados</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {userEvents.filter(e => e.status === 'open').length}
                      </div>
                      <div className="text-sm text-gray-600">Eventos Ativos</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {userEvents.reduce((total, event) => {
                          return total + getApplicationsByEvent(event.id).length;
                        }, 0)}
                      </div>
                      <div className="text-sm text-gray-600">Candidaturas</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {userEvents.reduce((total, event) => {
                          return total + getApplicationsByEvent(event.id).filter(app => app.status === 'approved').length;
                        }, 0)}
                      </div>
                      <div className="text-sm text-gray-600">Aprovações</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProducerDashboard;
