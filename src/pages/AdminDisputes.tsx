
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Clock, FileText, AlertTriangle, CheckCircle, XCircle, Upload } from 'lucide-react';

interface Dispute {
  id: string;
  event_id: string;
  complainant_id: string;
  defendant_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  admin_id?: string;
  resolution?: string;
  resolution_date?: string;
  created_at: string;
  updated_at: string;
  event_name?: string;
  complainant_name?: string;
  defendant_name?: string;
}

interface DisputeMessage {
  id: string;
  dispute_id: string;
  sender_id: string;
  sender_type: string;
  message: string;
  message_type: string;
  attachments?: string[];
  created_at: string;
  sender_name?: string;
}

const AdminDisputes = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [messages, setMessages] = useState<DisputeMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [resolution, setResolution] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisputes();
  }, []);

  useEffect(() => {
    if (selectedDispute) {
      fetchMessages(selectedDispute.id);
    }
  }, [selectedDispute]);

  const fetchDisputes = async () => {
    try {
      const { data, error } = await supabase
        .from('disputes')
        .select(`
          *,
          events(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enrich with user names
      const enrichedDisputes = await Promise.all(
        (data || []).map(async (dispute) => {
          const [complainantData, defendantData] = await Promise.all([
            supabase.from('user_profiles').select('name').eq('id', dispute.complainant_id).single(),
            supabase.from('user_profiles').select('name').eq('id', dispute.defendant_id).single()
          ]);

          return {
            ...dispute,
            event_name: dispute.events?.name || 'Evento não encontrado',
            complainant_name: complainantData.data?.name || 'Usuário não encontrado',
            defendant_name: defendantData.data?.name || 'Usuário não encontrado'
          };
        })
      );

      setDisputes(enrichedDisputes);
    } catch (error) {
      console.error('Error fetching disputes:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar disputas',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (disputeId: string) => {
    try {
      const { data, error } = await supabase
        .from('dispute_messages')
        .select('*')
        .eq('dispute_id', disputeId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Enrich with sender names
      const enrichedMessages = await Promise.all(
        (data || []).map(async (message) => {
          if (message.sender_type === 'admin') {
            return { ...message, sender_name: 'Administrador' };
          }

          const { data: userData } = await supabase
            .from('user_profiles')
            .select('name')
            .eq('id', message.sender_id)
            .single();

          return {
            ...message,
            sender_name: userData?.name || 'Usuário'
          };
        })
      );

      setMessages(enrichedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedDispute) return;

    try {
      const { error } = await supabase
        .from('dispute_messages')
        .insert({
          dispute_id: selectedDispute.id,
          sender_id: 'admin-user', // This should be the actual admin user ID
          sender_type: 'admin',
          message: newMessage,
          message_type: 'text'
        });

      if (error) throw error;

      setNewMessage('');
      fetchMessages(selectedDispute.id);
      
      toast({
        title: 'Sucesso',
        description: 'Mensagem enviada'
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao enviar mensagem',
        variant: 'destructive'
      });
    }
  };

  const updateDisputeStatus = async (status: string) => {
    if (!selectedDispute) return;

    try {
      const { error } = await supabase
        .from('disputes')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
          ...(status === 'resolved' && resolution ? { 
            resolution,
            resolution_date: new Date().toISOString()
          } : {})
        })
        .eq('id', selectedDispute.id);

      if (error) throw error;

      if (status === 'resolved' && resolution) {
        await supabase
          .from('dispute_messages')
          .insert({
            dispute_id: selectedDispute.id,
            sender_id: 'admin-user',
            sender_type: 'admin',
            message: `Disputa resolvida: ${resolution}`,
            message_type: 'resolution'
          });
      }

      fetchDisputes();
      setSelectedDispute(null);
      setResolution('');
      
      toast({
        title: 'Sucesso',
        description: 'Status da disputa atualizado'
      });
    } catch (error) {
      console.error('Error updating dispute:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar disputa',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, icon: Clock, label: 'Pendente' },
      in_progress: { variant: 'default' as const, icon: MessageSquare, label: 'Em Andamento' },
      resolved: { variant: 'default' as const, icon: CheckCircle, label: 'Resolvida' },
      closed: { variant: 'outline' as const, icon: XCircle, label: 'Fechada' }
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: { variant: 'outline' as const, className: 'text-green-600' },
      medium: { variant: 'secondary' as const, className: 'text-yellow-600' },
      high: { variant: 'destructive' as const, className: 'text-red-600' }
    };
    
    const config = variants[priority as keyof typeof variants] || variants.medium;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Centro de Disputas</h1>
          <p className="text-gray-600">Gerencie disputas e mediações entre usuários</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {disputes.filter(d => d.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {disputes.filter(d => d.status === 'in_progress').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resolvidas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {disputes.filter(d => d.status === 'resolved').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{disputes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Disputes List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Disputas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {disputes.map((dispute) => (
                <div key={dispute.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{dispute.title}</h3>
                        {getStatusBadge(dispute.status)}
                        {getPriorityBadge(dispute.priority)}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{dispute.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Evento:</span> {dispute.event_name}
                        </div>
                        <div>
                          <span className="font-medium">Requerente:</span> {dispute.complainant_name}
                        </div>
                        <div>
                          <span className="font-medium">Requerido:</span> {dispute.defendant_name}
                        </div>
                        <div>
                          <span className="font-medium">Criada em:</span> {new Date(dispute.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedDispute(dispute)}
                        >
                          Ver Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle>Detalhes da Disputa</DialogTitle>
                        </DialogHeader>
                        
                        {selectedDispute && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Dispute Info */}
                            <div className="space-y-4">
                              <div>
                                <Label>Título</Label>
                                <p className="font-medium">{selectedDispute.title}</p>
                              </div>
                              
                              <div>
                                <Label>Descrição</Label>
                                <p className="text-gray-600">{selectedDispute.description}</p>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Status</Label>
                                  <div className="mt-1">{getStatusBadge(selectedDispute.status)}</div>
                                </div>
                                <div>
                                  <Label>Prioridade</Label>
                                  <div className="mt-1">{getPriorityBadge(selectedDispute.priority)}</div>
                                </div>
                              </div>

                              {selectedDispute.status !== 'resolved' && (
                                <div className="space-y-3">
                                  <Label>Ações</Label>
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => updateDisputeStatus('in_progress')}
                                    >
                                      Iniciar Mediação
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => updateDisputeStatus('closed')}
                                    >
                                      Fechar
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {selectedDispute.status !== 'resolved' && (
                                <div className="space-y-3">
                                  <Label>Resolução</Label>
                                  <Textarea
                                    placeholder="Digite a resolução da disputa..."
                                    value={resolution}
                                    onChange={(e) => setResolution(e.target.value)}
                                  />
                                  <Button 
                                    onClick={() => updateDisputeStatus('resolved')}
                                    disabled={!resolution.trim()}
                                  >
                                    Resolver Disputa
                                  </Button>
                                </div>
                              )}
                            </div>

                            {/* Chat/Messages */}
                            <div className="space-y-4">
                              <Label>Timeline de Mensagens</Label>
                              <ScrollArea className="h-64 border rounded-md p-3">
                                <div className="space-y-3">
                                  {messages.map((message) => (
                                    <div key={message.id} className="flex flex-col">
                                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                        <span className="font-medium">{message.sender_name}</span>
                                        <span>•</span>
                                        <span>{new Date(message.created_at).toLocaleString('pt-BR')}</span>
                                        {message.message_type === 'resolution' && (
                                          <Badge variant="default" className="text-xs">Resolução</Badge>
                                        )}
                                      </div>
                                      <div className={`rounded-lg p-2 text-sm ${
                                        message.sender_type === 'admin' 
                                          ? 'bg-blue-50 text-blue-900 ml-0' 
                                          : 'bg-gray-50 text-gray-900'
                                      }`}>
                                        {message.message}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>

                              {selectedDispute.status !== 'resolved' && selectedDispute.status !== 'closed' && (
                                <div className="space-y-2">
                                  <Textarea
                                    placeholder="Digite sua mensagem..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                  />
                                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                                    Enviar Mensagem
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}

              {disputes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma disputa encontrada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDisputes;
