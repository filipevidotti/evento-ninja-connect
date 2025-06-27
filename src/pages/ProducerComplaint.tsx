
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertTriangle, Upload, ArrowLeft, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProducerHeader from '@/components/ProducerHeader';
import ReputationBadge from '@/components/ReputationBadge';
import { useAuth } from '@/components/AuthContext';

const ProducerComplaint = () => {
  const { freelancerId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [complaintData, setComplaintData] = useState({
    type: '',
    description: '',
    severity: 1,
    eventId: 'evt_123',
    evidence: []
  });

  // Mock freelancer data
  const freelancer = {
    id: freelancerId,
    name: 'Ana Silva',
    avatar: '',
    rating: 4.7,
    reputation: {
      level: 'gold' as const,
      points: 1245
    },
    totalEvents: 45,
    complaints: 2
  };

  // Mock event data
  const event = {
    id: 'evt_123',
    title: 'Festa de Casamento',
    date: '2024-01-15',
    location: 'São Paulo'
  };

  const complaintTypes = [
    'Não compareceu ao evento',
    'Comportamento inadequado',
    'Qualidade do trabalho abaixo do esperado',
    'Abandono durante o evento',
    'Atraso excessivo',
    'Não seguiu instruções',
    'Outros'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!complaintData.type || !complaintData.description.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Reclamação enviada!",
      description: "Sua reclamação será analisada em até 48 horas úteis."
    });

    navigate('/producer/dashboard');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log('Files uploaded:', files);
    toast({
      title: "Arquivos anexados",
      description: `${files.length} arquivo(s) anexado(s) com sucesso.`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProducerHeader 
        user={user} 
        onLogout={logout} 
        onCreateEvent={() => {}} 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrar Reclamação</h1>
          <p className="text-gray-600">Relate problemas com o freelancer para análise da plataforma</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Detalhes da Reclamação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="complaint-type">Tipo de Reclamação *</Label>
                    <Select 
                      value={complaintData.type} 
                      onValueChange={(value) => setComplaintData({...complaintData, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de problema" />
                      </SelectTrigger>
                      <SelectContent>
                        {complaintTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição Detalhada *</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva em detalhes o que aconteceu..."
                      rows={6}
                      value={complaintData.description}
                      onChange={(e) => setComplaintData({...complaintData, description: e.target.value})}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Mínimo 50 caracteres. Seja específico e objetivo.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="severity">Gravidade (1-5)</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setComplaintData({...complaintData, severity: level})}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                            complaintData.severity >= level 
                              ? 'bg-red-500 text-white border-red-500' 
                              : 'border-gray-300 text-gray-500 hover:border-red-300'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      1 = Leve, 5 = Muito grave
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="evidence">Evidências (Fotos/Vídeos)</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Arraste arquivos aqui ou clique para selecionar
                      </p>
                      <Input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span>Selecionar Arquivos</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Aviso Legal */}
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-800 text-lg">⚠️ Aviso Importante</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-orange-700 space-y-2">
                  <p>
                    <strong>Consequências de reclamação falsa:</strong> Reclamações comprovadamente falsas podem resultar em suspensão da sua conta.
                  </p>
                  <p>
                    <strong>Processo de análise:</strong> Nossa equipe analisará todas as evidências em até 48 horas úteis. Ambas as partes serão notificadas da decisão.
                  </p>
                  <p>
                    <strong>Contato direto:</strong> Recomendamos tentar resolver primeiro com o freelancer antes de registrar a reclamação.
                  </p>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Enviar Reclamação
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar com Informações */}
          <div className="space-y-6">
            {/* Dados do Freelancer */}
            <Card>
              <CardHeader>
                <CardTitle>Freelancer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{freelancer.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{freelancer.rating}</span>
                    </div>
                  </div>
                </div>
                
                <ReputationBadge 
                  level={freelancer.reputation.level}
                  points={freelancer.reputation.points}
                  size="sm"
                />
                
                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <p>Total de eventos: {freelancer.totalEvents}</p>
                  <p>Reclamações anteriores: {freelancer.complaints}</p>
                </div>
              </CardContent>
            </Card>

            {/* Dados do Evento */}
            <Card>
              <CardHeader>
                <CardTitle>Evento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">Data: {event.date}</p>
                  <p className="text-sm text-gray-600">Local: {event.location}</p>
                  <Badge variant="secondary">Concluído</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Histórico de Interações */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Contratado em:</span>
                    <span>10/01/2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span>15/01 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span>15/01 22:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pagamento:</span>
                    <Badge variant="outline" className="text-xs">Processado</Badge>
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

export default ProducerComplaint;
