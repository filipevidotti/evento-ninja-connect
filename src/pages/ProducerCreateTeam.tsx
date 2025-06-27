
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Users, Save } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useTeams } from '@/hooks/useTeams';
import ProducerHeader from '@/components/ProducerHeader';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
  const { createTeam } = useTeams();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  
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

  const handleSave = () => {
    if (!teamName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da equipe é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não encontrado.",
        variant: "destructive"
      });
      return;
    }

    // Validate that at least one function has role and hourly rate
    const validFunctions = teamFunctions.filter(func => func.role && func.hourlyRate > 0);
    if (validFunctions.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma função com cargo e valor por hora.",
        variant: "destructive"
      });
      return;
    }

    const newTeam = createTeam({
      name: teamName,
      description: teamDescription,
      producerId: user.id
    });

    console.log('Equipe criada:', {
      team: newTeam,
      functions: validFunctions
    });

    toast({
      title: "Equipe criada!",
      description: `A equipe "${teamName}" foi criada com sucesso.`
    });

    navigate('/producer/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProducerHeader user={user} onLogout={logout} onCreateEvent={() => {}} />
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Team Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Informações da Equipe</span>
            </CardTitle>
            <CardDescription>
              Defina o nome e descrição da sua equipe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="teamName">Nome da Equipe *</Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Ex: Equipe Premium, Bartenders Especializados"
              />
            </div>
            <div>
              <Label htmlFor="teamDescription">Descrição</Label>
              <Textarea
                id="teamDescription"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                placeholder="Descreva a especialidade da equipe, experiência, diferenciais..."
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
                  Defina as funções disponíveis e seus requisitos
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label>Função *</Label>
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
                      <Label>Valor/Hora (R$) *</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={func.hourlyRate}
                        onChange={(e) => updateFunction(func.id, 'hourlyRate', parseFloat(e.target.value) || 0)}
                      />
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
              <Users className="w-5 h-5" />
              <span>Resumo da Equipe</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {teamFunctions.reduce((total, func) => total + func.quantity, 0)}
                </div>
                <div className="text-sm text-gray-600">Total de Pessoas</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {teamFunctions.filter(func => func.role && func.hourlyRate > 0).length}
                </div>
                <div className="text-sm text-gray-600">Funções Definidas</div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <h4 className="font-medium">Funções da Equipe:</h4>
              {teamFunctions.filter(func => func.role).map((func, index) => (
                <div key={func.id} className="flex justify-between items-center text-sm">
                  <span>
                    {func.role} ({func.quantity}x)
                  </span>
                  <span className="font-medium">
                    R$ {func.hourlyRate.toFixed(2)}/hora
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
            <span>Criar Equipe</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProducerCreateTeam;
