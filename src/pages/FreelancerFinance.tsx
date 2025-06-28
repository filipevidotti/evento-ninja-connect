
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, Calendar, Download, CreditCard, DollarSign, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import FreelancerHeader from '@/components/FreelancerHeader';

const FreelancerFinance = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');

  const earningsData = [
    { month: 'Jan', earnings: 1200 },
    { month: 'Fev', earnings: 1800 },
    { month: 'Mar', earnings: 2100 },
    { month: 'Abr', earnings: 1600 },
    { month: 'Mai', earnings: 2400 },
    { month: 'Jun', earnings: 2800 },
  ];

  const transactions = [
    { id: 1, event: 'Rock in Rio 2024', date: '2024-06-20', amount: 1200, status: 'completed' },
    { id: 2, event: 'Casamento Fernanda & Ricardo', date: '2024-06-18', amount: 2500, status: 'pending' },
    { id: 3, event: 'Summit Tech Brasil 2024', date: '2024-06-15', amount: 320, status: 'completed' },
    { id: 4, event: 'Fashion Week São Paulo', date: '2024-06-12', amount: 1500, status: 'completed' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Pago</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const handleWithdrawRequest = () => {
    alert('Solicitação de saque enviada com sucesso!');
  };

  const chartConfig = {
    earnings: {
      label: "Ganhos",
      color: "#3b82f6",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FreelancerHeader />
      
      {/* Back Button - Mobile First */}
      <div className="px-4 py-3 bg-white border-b lg:hidden">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/freelancer/dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>
      
      <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Header melhorado - título e seleção de período separados */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-6">
          {/* Back Button - Desktop */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/freelancer/dashboard')}
            className="hidden lg:flex items-center gap-2 self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Financeiro</h1>
            <p className="text-gray-600">Gerencie seus ganhos e pagamentos</p>
          </div>
          
          {/* Seleção de período separada */}
          <div className="w-full lg:w-auto">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Selecionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">Este mês</SelectItem>
                <SelectItem value="last-month">Mês passado</SelectItem>
                <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
                <SelectItem value="this-year">Este ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-green-600">R$ 1.850</div>
              <p className="text-xs text-muted-foreground">Pronto para saque</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aguardando Liberação</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-orange-600">R$ 1.000</div>
              <p className="text-xs text-muted-foreground">Em processamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ganhos Este Mês</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">R$ 2.850</div>
              <p className="text-xs text-muted-foreground">+15% em relação ao mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">R$ 750</div>
              <p className="text-xs text-muted-foreground">2 pagamentos aguardando</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Ganhos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">R$ 18.450</div>
              <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximos Pagamentos</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold">R$ 1.200</div>
              <p className="text-xs text-muted-foreground">Previsão para próxima semana</p>
            </CardContent>
          </Card>
        </div>

        {/* Botão de Solicitação de Saque - Agora separado e destacado */}
        <div className="flex justify-center py-4">
          <Button 
            onClick={handleWithdrawRequest}
            className="bg-green-600 hover:bg-green-700 text-white px-6 lg:px-8 py-3 text-base lg:text-lg w-full sm:w-auto"
            size="lg"
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Solicitar Saque
          </Button>
        </div>

        {/* Tabs melhoradas - layout responsivo aprimorado */}
        <Tabs defaultValue="overview" className="w-full">
          <div className="w-full overflow-x-auto">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 min-w-fit">
              <TabsTrigger value="overview" className="text-xs lg:text-sm whitespace-nowrap px-2 lg:px-4">
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="transactions" className="text-xs lg:text-sm whitespace-nowrap px-2 lg:px-4">
                Transações
              </TabsTrigger>
              <TabsTrigger value="simulator" className="text-xs lg:text-sm whitespace-nowrap px-2 lg:px-4">
                Simulador
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs lg:text-sm whitespace-nowrap px-2 lg:px-4">
                Configurações
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ganhos Mensais</CardTitle>
                <CardDescription>Evolução dos seus ganhos nos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={earningsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#666', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#666', fontSize: 12 }}
                        tickFormatter={(value) => `R$ ${value}`}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value: any) => [`R$ ${value}`, 'Ganhos']}
                      />
                      <Bar 
                        dataKey="earnings" 
                        fill={chartConfig.earnings.color}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div>
                  <CardTitle>Histórico de Transações</CardTitle>
                  <CardDescription>Todas as suas transações financeiras</CardDescription>
                </div>
                <Button variant="outline" className="w-full lg:w-auto">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Relatório
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Evento</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.event}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>R$ {transaction.amount}</TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simulator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Simulador de Ganhos</CardTitle>
                <CardDescription>Estime seus ganhos com base em diferentes cenários</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-medium mb-2">Cenário Conservador</h3>
                    <p className="text-sm text-gray-600 mb-2">2 eventos/mês</p>
                    <p className="text-xl lg:text-2xl font-bold text-blue-600">R$ 1.200</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-medium mb-2">Cenário Moderado</h3>
                    <p className="text-sm text-gray-600 mb-2">4 eventos/mês</p>
                    <p className="text-xl lg:text-2xl font-bold text-green-600">R$ 2.400</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h3 className="font-medium mb-2">Cenário Otimista</h3>
                    <p className="text-sm text-gray-600 mb-2">6 eventos/mês</p>
                    <p className="text-xl lg:text-2xl font-bold text-purple-600">R$ 3.600</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados Bancários</CardTitle>
                <CardDescription>Configure suas informações para recebimento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Conta Corrente</h3>
                    <p className="text-sm text-gray-600">Banco: Banco do Brasil</p>
                    <p className="text-sm text-gray-600">Agência: 1234-5</p>
                    <p className="text-sm text-gray-600">Conta: 12345-6</p>
                  </div>
                  <Button variant="outline" className="w-full lg:w-auto">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Atualizar Dados Bancários
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FreelancerFinance;
