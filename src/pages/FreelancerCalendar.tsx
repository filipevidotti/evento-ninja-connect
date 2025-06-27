
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Clock, MapPin, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FreelancerHeader from '@/components/FreelancerHeader';

const FreelancerCalendar = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availability, setAvailability] = useState<{ [key: string]: string }>({});

  const upcomingEvents = [
    {
      id: 1,
      title: 'Evento Corporativo',
      date: '2024-01-25',
      time: '14:00',
      location: 'Centro de Convenções',
      producer: 'Empresa ABC',
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Festa de Casamento',
      date: '2024-01-28',
      time: '18:00',
      location: 'Salão de Festas',
      producer: 'Maria Silva',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Evento Social',
      date: '2024-02-02',
      time: '19:00',
      location: 'Clube Recreativo',
      producer: 'João Santos',
      status: 'confirmed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-yellow-400';
      case 'pending':
        return 'bg-blue-400';
      case 'unavailable':
        return 'bg-red-400';
      default:
        return 'bg-green-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-yellow-500">Confirmado</Badge>;
      case 'pending':
        return <Badge className="bg-blue-500">Pendente</Badge>;
      default:
        return <Badge variant="outline">Disponível</Badge>;
    }
  };

  const handleAvailabilityChange = (date: string, status: string) => {
    setAvailability(prev => ({
      ...prev,
      [date]: status
    }));
  };

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
              <h1 className="text-2xl sm:text-3xl font-bold">Calendário de Disponibilidade</h1>
              <p className="text-gray-600">Gerencie sua agenda e disponibilidade</p>
            </div>
            <Button className="w-full sm:w-auto">
              <CalendarDays className="w-4 h-4 mr-2" />
              Sincronizar com Google
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendário Principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Calendário</CardTitle>
                <CardDescription>Clique em um dia para alterar sua disponibilidade</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                
                {/* Legenda */}
                <div className="mt-4 space-y-2">
                  <h3 className="font-medium">Legenda:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm">Disponível</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-sm">Evento Confirmado</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span className="text-sm">Evento Pendente</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <span className="text-sm">Indisponível</span>
                    </div>
                  </div>
                </div>

                {/* Modal de Disponibilidade */}
                {selectedDate && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="mt-4 w-full" variant="outline">
                        Alterar Disponibilidade - {selectedDate.toLocaleDateString()}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Disponibilidade para {selectedDate.toLocaleDateString()}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Select
                          value={availability[selectedDate.toISOString().split('T')[0]] || 'available'}
                          onValueChange={(value) => 
                            handleAvailabilityChange(selectedDate.toISOString().split('T')[0], value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Disponível</SelectItem>
                            <SelectItem value="unavailable">Indisponível</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button className="w-full">Salvar</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Eventos Próximos */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Eventos Próximos</CardTitle>
                <CardDescription>Seus próximos compromissos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-sm sm:text-base">{event.title}</h3>
                        {getStatusBadge(event.status)}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <CalendarDays className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span className="break-words">{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{event.producer}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas do Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Dias Disponíveis:</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Eventos Confirmados:</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Eventos Pendentes:</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Taxa de Ocupação:</span>
                    <span className="font-medium">38%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerCalendar;
