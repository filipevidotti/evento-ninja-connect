
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Users, Save, Calendar, MapPin, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import ProducerHeader from '@/components/ProducerHeader';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { useNavigate } from 'react-router-dom';

interface TeamFunction {
  id: string;
  role: string;
  quantity: number;
  hourlyRate: number;
  requirements: string;
  description: string;
}

const ProducerCreateTeam = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDuration, setEventDuration] = useState('');
  
  const [teamFunctions, setTeamFunctions] = useState<TeamFunction[]>([
    {
      id: '1',
      role: '',
      quantity: 1,
      hourlyRate: 0,
      requirements: '',
      description: ''
    }
  ]);

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/producer/dashboard' },
    { label: 'Criar Equipe' }
  ];

  const commonRoles = [
    'Garçom',
    'Bartender',
    'Limpeza',
    'Segurança',
    'Recepção',
    'Cozinheiro',
    'DJ',
    'Fotógrafo',
    'Decorador',
    'Coordenador'
  ];

  const addFunction = () => {
    const newFunction: TeamFunction = {
      id: Date.now().toString(),
      role: '',
      quantity: 1,
      hourlyRate: 0,
      requirements: '',
      description: ''
    };
    setTeamFunctions([...teamFunctions, newFunction]);
  };

  const removeFunction = (id: string) => {
    if (teamFunctions.length > 1) {
      setTeamFunctions(teamFunctions.filter(func => func.id !== id));
    }
  };

  const updateFunction = (id: string, field: keyof TeamFunction, value: string | number) => {
    setTeamFunctions(teamFunctions.map(func => 
      func.id === id ? { ...func, [field]: value } : func
    ));
  };

  const calculateTotalCost = () => {
    const duration = parseFloat(eventDuration) || 0;
    return teamFunctions.reduce((total, func) => {
      return total + (func.quantity * func.hourlyRate * duration);
    }, 0);
  };

  const handleSave = () => {
    console.log('Salvando equipe:', {
      event: { eventName, eventDate, eventTime, eventLocation, eventDescription, eventDuration },
      team: teamFunctions
    });
    // Aqui você implementaria a lógica de salvamento
    navigate('/producer/team-management');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProducerHeader user={user} onLogout={logout} onCreateEvent={() => {}} />
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Event Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Informações do Evento</span>
            </CardTitle>
            <CardDescription>
              Defina os detalhes básicos do seu evento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventName">Nome do Evento</Label>
                <Input
                  id="eventName"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Ex: Casamento Silva"
                />
              </div>
              <div>
                <Label htmlFor="eventDate">Data</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="eventTime">Horário</Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="eventDuration">Duração (horas)</Label>
                <Input
                  id="eventDuration"
                  type="number"
                  value={eventDuration}
                  onChange={(e) => setEventDuration(e.target.value)}
                  placeholder="Ex: 8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="eventLocation">Local</Label>
              <Input
                id="eventLocation"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="Endereço completo do evento"
              />
            </div>
            <div>
              <Label htmlFor="eventDescription">Descrição</Label>
              <Textarea
                id="eventDescription"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Descreva o tipo de evento, estilo, expectativas..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Team Functions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Funções da Equipe</span>
                </CardTitle>
                <CardDescription>
                  Defina as funções necessárias e seus requisitos
                </CardDescription>
              </div>
              <Button onClick={addFunction} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Adicionar Função</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {teamFunctions.map((func, index) => (
              <Card key={func.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Função {index + 1}</h4>
                    {teamFunctions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFunction(func.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label>Função</Label>
                      <Select
                        value={func.role}
                        onValueChange={(value) => updateFunction(func.id, 'role', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar função" />
                        </SelectTrigger>
                        <SelectContent>
                          {commonRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">Personalizar...</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Quantidade</Label>
                      <Input
                        type="number"
                        min="1"
                        value={func.quantity}
                        onChange={(e) => updateFunction(func.id, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    
                    <div>
                      <Label>Valor/Hora (R$)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={func.hourlyRate}
                        onChange={(e) => updateFunction(func.id, 'hourlyRate', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div>
                      <Label>Total</Label>
                      <div className="h-10 flex items-center px-3 bg-gray-50 border rounded-md">
                        R$ {(func.quantity * func.hourlyRate * (parseFloat(eventDuration) || 0)).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label>Requisitos</Label>
                      <Input
                        value={func.requirements}
                        onChange={(e) => updateFunction(func.id, 'requirements', e.target.value)}
                        placeholder="Ex: Experiência mínima de 2 anos"
                      />
                    </div>
                    
                    <div>
                      <Label>Descrição das Atividades</Label>
                      <Textarea
                        value={func.description}
                        onChange={(e) => updateFunction(func.id, 'description', e.target.value)}
                        placeholder="Descreva as responsabilidades e atividades específicas..."
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Resumo do Orçamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {teamFunctions.reduce((total, func) => total + func.quantity, 0)}
                </div>
                <div className="text-sm text-gray-600">Total de Pessoas</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {eventDuration || 0}h
                </div>
                <div className="text-sm text-gray-600">Duração do Evento</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  R$ {calculateTotalCost().toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Custo Total Estimado</div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <h4 className="font-medium">Detalhamento por Função:</h4>
              {teamFunctions.map((func, index) => (
                <div key={func.id} className="flex justify-between items-center text-sm">
                  <span>
                    {func.role || `Função ${index + 1}`} ({func.quantity}x)
                  </span>
                  <span className="font-medium">
                    R$ {(func.quantity * func.hourlyRate * (parseFloat(eventDuration) || 0)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => navigate('/producer/dashboard')}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Salvar e Publicar</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProducerCreateTeam;
