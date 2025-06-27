
import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useEvents } from '@/components/EventContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User,
  Calendar,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProducerHeader from '@/components/ProducerHeader';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'presente' | 'ausente' | 'atrasado';
  checkIn?: string;
  checkOut?: string;
  avatar?: string;
}

interface EventTeam {
  eventId: string;
  eventName: string;
  roles: {
    name: string;
    filled: number;
    total: number;
    members: TeamMember[];
  }[];
}

const mockTeams: EventTeam[] = [
  {
    eventId: '1',
    eventName: 'Festival de Música 2024',
    roles: [
      {
        name: 'Coordenação',
        filled: 2,
        total: 2,
        members: [
          {
            id: '1',
            name: 'Marina Costa',
            role: 'Coordenadora Geral',
            status: 'presente',
            checkIn: '08:00',
            checkOut: '18:00'
          },
          {
            id: '2',
            name: 'Carlos Silva',
            role: 'Coordenador de Produção',
            status: 'presente',
            checkIn: '08:30'
          }
        ]
      },
      {
        name: 'Som e Iluminação',
        filled: 3,
        total: 4,
        members: [
          {
            id: '3',
            name: 'João Santos',
            role: 'Técnico de Som',
            status: 'presente',
            checkIn: '07:00'
          },
          {
            id: '4',
            name: 'Ana Rodrigues',
            role: 'Técnica de Iluminação',
            status: 'atrasado',
            checkIn: '09:15'
          },
          {
            id: '5',
            name: 'Pedro Lima',
            role: 'Auxiliar Técnico',
            status: 'ausente'
          }
        ]
      },
      {
        name: 'Limpeza',
        filled: 2,
        total: 3,
        members: [
          {
            id: '6',
            name: 'Maria Oliveira',
            role: 'Supervisora de Limpeza',
            status: 'presente',
            checkIn: '06:00'
          },
          {
            id: '7',
            name: 'José Costa',
            role: 'Auxiliar de Limpeza',
            status: 'presente',
            checkIn: '06:30'
          }
        ]
      }
    ]
  }
];

const ProducerTeamManagement = () => {
  const { user, logout } = useAuth();
  const { events } = useEvents();
  const { toast } = useToast();
  
  const [selectedEvent, setSelectedEvent] = useState<string>('1');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', user: 'Marina Costa', message: 'Equipe, todos prontos para o evento?', time: '08:00' },
    { id: '2', user: 'João Santos', message: 'Som checado e funcionando!', time: '08:15' },
    { id: '3', user: 'Ana Rodrigues', message: 'Luzes testadas, tudo ok!', time: '08:20' }
  ]);

  const selectedTeam = mockTeams.find(team => team.eventId === selectedEvent);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'presente': return 'bg-green-100 text-green-800';
      case 'ausente': return 'bg-red-100 text-red-800';
      case 'atrasado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'presente': return <CheckCircle className="w-4 h-4" />;
      case 'ausente': return <XCircle className="w-4 h-4" />;
      case 'atrasado': return <Clock className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      user: user?.name || 'Você',
      message: chatMessage,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <ProducerHeader 
        user={user} 
        onLogout={logout} 
        onCreateEvent={() => {}} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Equipes</h1>
          <p className="text-gray-600">Organize e monitore suas equipes por evento</p>
        </div>

        {/* Seletor de Evento */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Selecionar Evento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-full md:w-96">
                <SelectValue placeholder="Escolha um evento" />
              </SelectTrigger>
              <SelectContent>
                {mockTeams.map((team) => (
                  <SelectItem key={team.eventId} value={team.eventId}>
                    {team.eventName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedTeam && (
          <Tabs defaultValue="team" className="space-y-6">
            <TabsList className="grid grid-cols-3 max-w-md">
              <TabsTrigger value="team">Equipe</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>

            <TabsContent value="team" className="space-y-6">
              {/* Organograma da Equipe */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedTeam.roles.map((role, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{role.name}</span>
                        <Badge variant={role.filled === role.total ? "default" : "secondary"}>
                          {role.filled}/{role.total}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {role.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-gray-600">{member.role}</p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(member.status)} flex items-center gap-1`}>
                            {getStatusIcon(member.status)}
                            {member.status}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Chat da Equipe - {selectedTeam.eventName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{msg.user}</span>
                            <span className="text-xs text-gray-500">{msg.time}</span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{msg.message}</p>
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
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo de Presença</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Presentes:</span>
                        <span className="font-medium text-green-600">5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Atrasados:</span>
                        <span className="font-medium text-yellow-600">1</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ausentes:</span>
                        <span className="font-medium text-red-600">1</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pontualidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>No horário:</span>
                        <span className="font-medium">71%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Até 15 min:</span>
                        <span className="font-medium">14%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mais de 15 min:</span>
                        <span className="font-medium">15%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Horas Trabalhadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total planejado:</span>
                        <span className="font-medium">80h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total trabalhado:</span>
                        <span className="font-medium">72h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Eficiência:</span>
                        <span className="font-medium text-green-600">90%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ProducerTeamManagement;
