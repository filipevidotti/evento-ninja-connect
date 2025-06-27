import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { DollarSign, TrendingUp, Clock, AlertCircle, Download, Settings } from 'lucide-react';

interface Transaction {
  id: string;
  event_id?: string;
  user_id: string;
  type: string;
  amount: number;
  commission_rate?: number;
  commission_amount?: number;
  net_amount?: number;
  status: string;
  payment_method?: string;
  stripe_payment_id?: string;
  description?: string;
  processed_at?: string;
  created_at: string;
  user_name?: string;
  event_name?: string;
}

interface PlatformSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description?: string;
}

interface FinancialSummary {
  totalRevenue: number;
  totalCommissions: number;
  pendingPayments: number;
  disputedTransactions: number;
}

const AdminFinance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<PlatformSetting[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalRevenue: 0,
    totalCommissions: 0,
    pendingPayments: 0,
    disputedTransactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('30');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newCommissionRate, setNewCommissionRate] = useState('');
  const [selectedSetting, setSelectedSetting] = useState<PlatformSetting | null>(null);

  useEffect(() => {
    fetchFinancialData();
    fetchSettings();
  }, [dateFilter, statusFilter]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      
      // Mock data - no database dependencies
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          event_id: 'event1',
          user_id: 'user1',
          type: 'payment',
          amount: 1000,
          commission_rate: 0.1,
          commission_amount: 100,
          net_amount: 900,
          status: 'completed',
          payment_method: 'credit_card',
          created_at: new Date().toISOString(),
          user_name: 'João Silva',
          event_name: 'Casamento Silva'
        },
        {
          id: '2',
          event_id: 'event2',
          user_id: 'user2',
          type: 'payment',
          amount: 500,
          commission_rate: 0.1,
          commission_amount: 50,
          net_amount: 450,
          status: 'pending',
          payment_method: 'pix',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          user_name: 'Maria Santos',
          event_name: 'Evento Corporativo'
        }
      ];
      
      setTransactions(mockTransactions);

      // Calculate summary
      const totalRevenue = mockTransactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalCommissions = mockTransactions
        .filter(t => t.status === 'completed' && t.commission_amount)
        .reduce((sum, t) => sum + (t.commission_amount || 0), 0);

      const pendingPayments = mockTransactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0);

      const disputedTransactions = mockTransactions
        .filter(t => t.status === 'disputed').length;

      setSummary({
        totalRevenue,
        totalCommissions,
        pendingPayments,
        disputedTransactions
      });

    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados financeiros',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      // Mock settings data
      const mockSettings: PlatformSetting[] = [
        {
          id: '1',
          setting_key: 'commission_rate_freelancer',
          setting_value: '10',
          description: 'Taxa de comissão para freelancers'
        },
        {
          id: '2',
          setting_key: 'commission_rate_producer',
          setting_value: '5',
          description: 'Taxa de comissão para produtores'
        }
      ];
      
      setSettings(mockSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateTransaction = async (transactionId: string, status: string) => {
    try {
      // Mock update
      await new Promise(resolve => setTimeout(resolve, 500));

      fetchFinancialData();
      toast({
        title: 'Sucesso',
        description: 'Status da transação atualizado'
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar transação',
        variant: 'destructive'
      });
    }
  };

  const updateSetting = async (settingId: string, newValue: string) => {
    try {
      // Mock update
      await new Promise(resolve => setTimeout(resolve, 500));

      fetchSettings();
      setSelectedSetting(null);
      setNewCommissionRate('');
      
      toast({
        title: 'Sucesso',
        description: 'Configuração atualizada'
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar configuração',
        variant: 'destructive'
      });
    }
  };

  const exportTransactions = () => {
    const csvContent = [
      ['ID', 'Data', 'Usuário', 'Evento', 'Tipo', 'Valor', 'Comissão', 'Status'].join(','),
      ...transactions.map(t => [
        t.id,
        new Date(t.created_at).toLocaleDateString('pt-BR'),
        t.user_name,
        t.event_name,
        t.type,
        t.amount.toFixed(2),
        (t.commission_amount || 0).toFixed(2),
        t.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transacoes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, label: 'Pendente' },
      completed: { variant: 'default' as const, label: 'Concluída' },
      failed: { variant: 'destructive' as const, label: 'Falhou' },
      disputed: { variant: 'outline' as const, label: 'Em Disputa' }
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeLabel = (type: string) => {
    const types = {
      payment: 'Pagamento',
      commission: 'Comissão',
      refund: 'Reembolso'
    };
    return types[type as keyof typeof types] || type;
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão Financeira</h1>
          <p className="text-gray-600">Controle de transações e comissões da plataforma</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {summary.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Comissões</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {summary.totalCommissions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {summary.pendingPayments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Disputas</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.disputedTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Transações
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Últimos 7 dias</SelectItem>
                        <SelectItem value="30">Últimos 30 dias</SelectItem>
                        <SelectItem value="90">Últimos 90 dias</SelectItem>
                        <SelectItem value="365">Último ano</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os status</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="completed">Concluída</SelectItem>
                        <SelectItem value="failed">Falhou</SelectItem>
                        <SelectItem value="disputed">Em Disputa</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button onClick={exportTransactions} variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Evento</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Comissão</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {new Date(transaction.created_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>{transaction.user_name}</TableCell>
                        <TableCell>{transaction.event_name}</TableCell>
                        <TableCell>{getTypeLabel(transaction.type)}</TableCell>
                        <TableCell>
                          R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          R$ {(transaction.commission_amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>
                          {transaction.status === 'pending' && (
                            <div className="space-x-2">
                              <Button 
                                size="sm" 
                                onClick={() => updateTransaction(transaction.id, 'completed')}
                              >
                                Aprovar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateTransaction(transaction.id, 'failed')}
                              >
                                Rejeitar
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {transactions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhuma transação encontrada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configurações de Comissão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{setting.description}</h3>
                        <p className="text-sm text-gray-600">
                          Chave: {setting.setting_key}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold">
                          {setting.setting_value}%
                        </span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedSetting(setting);
                                setNewCommissionRate(setting.setting_value);
                              }}
                            >
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Taxa de Comissão</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Descrição</Label>
                                <p className="text-sm text-gray-600">{selectedSetting?.description}</p>
                              </div>
                              <div>
                                <Label htmlFor="commission-rate">Nova Taxa (%)</Label>
                                <Input
                                  id="commission-rate"
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="100"
                                  value={newCommissionRate}
                                  onChange={(e) => setNewCommissionRate(e.target.value)}
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setSelectedSetting(null)}
                                >
                                  Cancelar
                                </Button>
                                <Button 
                                  onClick={() => selectedSetting && updateSetting(selectedSetting.id, newCommissionRate)}
                                  disabled={!newCommissionRate || parseFloat(newCommissionRate) < 0}
                                >
                                  Salvar
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminFinance;
