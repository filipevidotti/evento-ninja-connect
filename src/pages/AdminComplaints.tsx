
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Clock, CheckCircle, XCircle, Eye, Filter, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdminHeader from '@/components/AdminHeader';
import ReputationBadge from '@/components/ReputationBadge';

interface Complaint {
  id: string;
  producerName: string;
  freelancerName: string;
  freelancerId: string;
  eventTitle: string;
  type: string;
  severity: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  evidence: string[];
  freelancerReputation: {
    level: 'bronze' | 'silver' | 'gold' | 'diamond';
    points: number;
  };
}

const AdminComplaints = () => {
  const { toast } = useToast();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const complaints: Complaint[] = [
    {
      id: '1',
      producerName: 'João Silva',
      freelancerName: 'Ana Costa',
      freelancerId: '123',
      eventTitle: 'Festa de Casamento',
      type: 'Não compareceu ao evento',
      severity: 5,
      description: 'Freelancer não apareceu no evento e não respondeu mensagens.',
      status: 'pending',
      createdAt: '2024-01-16T10:30:00Z',
      evidence: ['foto1.jpg', 'mensagem.png'],
      freelancerReputation: { level: 'gold', points: 1245 }
    },
    {
      id: '2',
      producerName: 'Maria Santos',
      freelancerName: 'Carlos Oliveira',
      freelancerId: '124',
      eventTitle: 'Evento Corporativo',
      type: 'Comportamento inadequado',
      severity: 3,
      description: 'Freelancer teve comportamento inadequado com convidados.',
      status: 'approved',
      createdAt: '2024-01-15T14:20:00Z',
      evidence: ['video1.mp4'],
      freelancerReputation: { level: 'silver', points: 1100 }
    },
    {
      id: '3',
      producerName: 'Pedro Lima',
      freelancerName: 'Lucia Fernandes',
      freelancerId: '125',
      eventTitle: 'Aniversário Infantil',
      type: 'Qualidade do trabalho abaixo do esperado',
      severity: 2,
      description: 'Trabalho não atendeu as expectativas acordadas.',
      status: 'rejected',
      createdAt: '2024-01-14T09:15:00Z',
      evidence: [],
      freelancerReputation: { level: 'bronze', points: 950 }
    }
  ];

  const stats = {
    pending: complaints.filter(c => c.status === 'pending').length,
    resolved: complaints.filter(c => c.status !== 'pending').length,
    approvalRate: Math.round((complaints.filter(c => c.status === 'approved').length / complaints.length) * 100),
    freelancersUnderReview: new Set(complaints.filter(c => c.status === 'pending').map(c => c.freelancerId)).size
  };

  const handleDecision = (complaintId: string, decision: 'approved' | 'rejected', pointsDeducted?: number) => {
    console.log('Decision:', { complaintId, decision, pointsDeducted });
    
    toast({
      title: decision === 'approved' ? "Reclamação aprovada" : "Reclamação rejeitada",
      description: decision === 'approved' 
        ? `${pointsDeducted} pontos foram descontados do freelancer.`
        : "Reclamação considerada improcedente."
    });
    
    setSelectedComplaint(null);
  };

  const filteredComplaints = complaints.filter(complaint => {
    const statusMatch = statusFilter === 'all' || complaint.status === statusFilter;
    const typeMatch = typeFilter === 'all' || complaint.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return 'text-red-600 bg-red-50 border-red-200';
    if (severity >= 3) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Análise de Reclamações</h1>
          <p className="text-gray-600">Gerencie e analise reclamações contra freelancers</p>
        </div>

        {/* Dashboard de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Aguardando análise</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolvidas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">Esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Procedência</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.approvalRate}%</div>
              <p className="text-xs text-muted-foreground">Reclamações válidas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.freelancersUnderReview}</div>
              <p className="text-xs text-muted-foreground">Freelancers únicos</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="min-w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="approved">Aprovada</SelectItem>
                    <SelectItem value="rejected">Rejeitada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="min-w-48">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="Não compareceu ao evento">Não comparecimento</SelectItem>
                    <SelectItem value="Comportamento inadequado">Comportamento</SelectItem>
                    <SelectItem value="Qualidade do trabalho abaixo do esperado">Qualidade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Reclamações */}
        <Card>
          <CardHeader>
            <CardTitle>Reclamações ({filteredComplaints.length})</CardTitle>
            <CardDescription>Clique em uma reclamação para analisar em detalhes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <div key={complaint.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{complaint.freelancerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{complaint.freelancerName}</h3>
                          <p className="text-sm text-gray-600">
                            Reclamado por: {complaint.producerName}
                          </p>
                        </div>
                        <ReputationBadge 
                          level={complaint.freelancerReputation.level}
                          points={complaint.freelancerReputation.points}
                          size="sm"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm font-medium">Evento</p>
                          <p className="text-sm text-gray-600">{complaint.eventTitle}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Tipo</p>
                          <p className="text-sm text-gray-600">{complaint.type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Data</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(complaint.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">{complaint.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded border text-xs font-medium ${getSeverityColor(complaint.severity)}`}>
                        Nível {complaint.severity}
                      </div>
                      
                      <Badge variant={
                        complaint.status === 'pending' ? 'secondary' :
                        complaint.status === 'approved' ? 'default' : 'destructive'
                      } className="flex items-center gap-1">
                        {getStatusIcon(complaint.status)}
                        {complaint.status === 'pending' ? 'Pendente' :
                         complaint.status === 'approved' ? 'Aprovada' : 'Rejeitada'}
                      </Badge>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedComplaint(complaint)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Analisar
                          </Button>
                        </DialogTrigger>
                        
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Análise Detalhada da Reclamação</DialogTitle>
                            <DialogDescription>
                              Reclamação #{complaint.id} - {complaint.type}
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedComplaint && (
                            <div className="space-y-6">
                              {/* Informações Principais */}
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold mb-2">Produtor</h4>
                                  <p>{complaint.producerName}</p>
                                  <p className="text-sm text-gray-600">Evento: {complaint.eventTitle}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Freelancer</h4>
                                  <div className="flex items-center space-x-3">
                                    <Avatar>
                                      <AvatarFallback>{complaint.freelancerName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p>{complaint.freelancerName}</p>
                                      <ReputationBadge 
                                        level={complaint.freelancerReputation.level}
                                        points={complaint.freelancerReputation.points}
                                        size="sm"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Descrição */}
                              <div>
                                <h4 className="font-semibold mb-2">Descrição da Reclamação</h4>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                  <p className="text-sm">{complaint.description}</p>
                                </div>
                              </div>
                              
                              {/* Evidências */}
                              {complaint.evidence.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Evidências ({complaint.evidence.length})</h4>
                                  <div className="grid grid-cols-3 gap-2">
                                    {complaint.evidence.map((evidence, index) => (
                                      <div key={index} className="p-3 border rounded-lg text-center">
                                        <p className="text-sm">{evidence}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Histórico do Freelancer */}
                              <div>
                                <h4 className="font-semibold mb-2">Histórico do Freelancer</h4>
                                <div className="p-4 bg-blue-50 rounded-lg">
                                  <p className="text-sm">• Total de eventos: 45</p>
                                  <p className="text-sm">• Reclamações anteriores: 2</p>
                                  <p className="text-sm">• Taxa de comparecimento: 97.8%</p>
                                  <p className="text-sm">• Avaliação média: 4.7⭐</p>
                                </div>
                              </div>
                              
                              {/* Ações */}
                              {complaint.status === 'pending' && (
                                <div className="space-y-4">
                                  <h4 className="font-semibold">Decisão</h4>
                                  <div className="flex space-x-4">
                                    <Button 
                                      variant="destructive"
                                      onClick={() => handleDecision(complaint.id, 'approved', 30)}
                                    >
                                      Reclamação Procedente (-30 pontos)
                                    </Button>
                                    <Button 
                                      variant="outline"
                                      onClick={() => handleDecision(complaint.id, 'rejected')}
                                    >
                                      Reclamação Improcedente
                                    </Button>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium">Observações (opcional)</label>
                                    <Textarea 
                                      placeholder="Adicione observações sobre a decisão..."
                                      className="mt-1"
                                      rows={3}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminComplaints;
