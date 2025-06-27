import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Users, MessageCircle, Clock, CheckCircle, AlertCircle, BarChart3, Send } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import ProducerHeader from '@/components/ProducerHeader';
import BreadcrumbNav from '@/components/BreadcrumbNav';

const ProducerTeamManagement = () => {
  const { user, logout } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState('');
  const [chatMessage, setChatMessage] = useState('');

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/producer/dashboard' },
    { label: 'Gestão de Equipes' }
  ];

  const mockEvents = [
    { id: '1', name: 'Casamento Silva - 15/02', date: '2024-02-15' },
    { id: '2', name: 'Evento Corporativo XYZ - 20/02', date: '2024-02-20' },
    { id: '3', name: 'Festa de Aniversário - 25/02', date: '2024-02-25' }
  ];

  const mockTeamStructure = [
    {
      function: 'Garçons',
      required: 8,
      confirmed: 6,
      members: [
        { id: '1', name: 'João Silva', status: 'confirmed', checkedIn: false },
        { id: '2', name: 'Maria Santos', status: 'confirmed', checkedIn: true },
        { id: '3', name: 'Pedro Costa', status: 'pending', checkedIn: false },
        { id: '4', name: 'Ana Oliveira', status: 'confirmed', checkedIn: true },
        { id: '5', name: 'Carlos Lima', status: 'confirmed', checkedIn: false },
        { id: '6', name: 'Lucia Ferreira', status: 'confirmed', checkedIn: true }
      ]
    },
    {
      function: 'Limpeza',
      required: 4,
      confirmed: 4,
      members: [
        { id: '7', name: 'Roberto Dias', status: 'confirmed', checkedIn: true },
        { id: '8', name: 'Sandra Moura', status: 'confirmed', checkedIn: true },
        { id: '9', name: 'Felipe Rocha', status: 'confirmed', checkedIn: false },
        { id: '10', name: 'Carla Neves', status: 'confirmed', checkedIn: false }
      ]
    },
    {
      function: 'Segurança',
      required: 2,
      confirmed: 1,
      members: [
        { id: '11', name: 'Marcos Pereira', status: 'confirmed', checkedIn: false }
      ]
    }
  ];

  const mockChatMessages = [
    { id: '1', user: 'João Silva', message: 'Pessoal, chegando em 30 minutos!', time: '14:30', type: 'freelancer' },
    { id: '2', user: 'Você', message: 'Perfeito! Lembrem-se do uniforme padrão.', time: '14:32', type: 'producer' },
    { id: '3', user: 'Maria Santos', message: 'Já estou aqui. Onde fica o vestiário?', time: '14:45', type: 'freelancer' },
    { id: '4', user: 'Você', message: 'Segundo andar, porta à direita.', time: '14:46', type: 'producer' }
  ];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log('Enviando mensagem:', chatMessage);
      setChatMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProducerHeader user={user} onLogout={logout} onCreateEvent={() => {}} />
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Event Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Escolha um evento para gerenciar" />
              </SelectTrigger>
              <SelectContent>
                {mockEvents.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedEvent && (
          <Tabs defaultValue="team" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="team">Equipe</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="checkin">Check-in</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>

            <TabsContent value="team" className="space-y-6">
              <div className="grid gap-6">
                {mockTeamStructure.map((group) => (
                  <Card key={group.function}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <Users className="w-5 h-5" />
                          <span>{group.function}</span>
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant={group.confirmed >= group.required ? "default" : "destructive"}>
                            {group.confirmed}/{group.required} confirmados
                          </Badge>
                          {group.confirmed < group.required && (
                            <Button size="sm" variant="outline">
                              Buscar +{group.required - group.confirmed}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {group.members.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <div className="flex items-center space-x-2">
                                  <Badge 
                                    variant={member.status === 'confirmed' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {member.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                                  </Badge>
                                  {member.checkedIn && (
                                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                      ✓ Check-in
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Contatar
                              </Button>
                              <Button variant="ghost" size="sm">
                                Ver Perfil
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat da Equipe</span>
                  </CardTitle>
                  <CardDescription>Comunicação em tempo real com toda a equipe</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
                    {mockChatMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.type === 'producer' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.type === 'producer' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white shadow-sm'
                        }`}>
                          <p className="text-sm font-medium mb-1">{msg.user}</p>
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${msg.type === 'producer' ? 'text-blue-100' : 'text-gray-500'}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="checkin" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Controle de Presença</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {mockTeamStructure.flatMap(group => 
                      group.members.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-gray-600">
                                {mockTeamStructure.find(g => g.members.includes(member))?.function}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {member.checkedIn ? (
                              <div className="flex items-center space-x-2 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">Presente - 14:30</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2 text-gray-500">
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm">Aguardando</span>
                              </div>
                            )}
                            <Button 
                              variant={member.checkedIn ? "outline" : "default"}
                              size="sm"
                            >
                              {member.checkedIn ? 'Check-out' : 'Check-in'}
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">18</p>
                        <p className="text-sm text-gray-600">Total de Freelancers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">11</p>
                        <p className="text-sm text-gray-600">Presentes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-8 h-8 text-yellow-600" />
                      <div>
                        <p className="text-2xl font-bold">94%</p>
                        <p className="text-sm text-gray-600">Pontualidade</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Relatório de Pontualidade</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">No horário (até 15 min atraso)</span>
                      <Badge className="bg-green-100 text-green-800">17 pessoas</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium">Atraso moderado (15-30 min)</span>
                      <Badge className="bg-yellow-100 text-yellow-800">1 pessoa</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium">Atraso significativo (+30 min)</span>
                      <Badge className="bg-red-100 text-red-800">0 pessoas</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ProducerTeamManagement;
