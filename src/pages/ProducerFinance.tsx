
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Wallet, CreditCard, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useProducerFinance } from '@/hooks/useProducerFinance';
import ProducerHeader from '@/components/ProducerHeader';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { useToast } from '@/hooks/use-toast';

const ProducerFinance = () => {
  const { user, logout } = useAuth();
  const { wallet, transactions, checkouts, addDeposit, approveCheckout, rejectCheckout, payCheckout, getPendingCheckouts, getApprovedCheckouts } = useProducerFinance();
  const { toast } = useToast();
  
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDescription, setDepositDescription] = useState('');
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedCheckout, setSelectedCheckout] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState('');

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/producer/dashboard' },
    { label: 'Área Financeira' }
  ];

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido para depósito.",
        variant: "destructive"
      });
      return;
    }

    addDeposit(amount, depositDescription || 'Depósito');
    toast({
      title: "Depósito iniciado",
      description: "Seu depósito está sendo processado."
    });
    
    setDepositAmount('');
    setDepositDescription('');
    setShowDepositDialog(false);
  };

  const handleApproveCheckout = (checkoutId: string) => {
    approveCheckout(checkoutId);
    toast({
      title: "Checkout aprovado",
      description: "O pagamento foi aprovado e está pronto para ser processado."
    });
  };

  const handleRejectCheckout = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Motivo necessário",
        description: "Por favor, informe o motivo da rejeição.",
        variant: "destructive"
      });
      return;
    }

    rejectCheckout(selectedCheckout, rejectionReason);
    toast({
      title: "Checkout rejeitado",
      description: "O pagamento foi rejeitado."
    });
    
    setShowRejectDialog(false);
    setSelectedCheckout('');
    setRejectionReason('');
  };

  const handlePayCheckout = (checkoutId: string) => {
    payCheckout(checkoutId);
    toast({
      title: "Pagamento processado",
      description: "O pagamento foi realizado com sucesso."
    });
  };

  const handleCreateEvent = () => {
    // Placeholder function
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, label: 'Pendente', icon: Clock },
      completed: { variant: 'default' as const, label: 'Concluído', icon: CheckCircle },
      failed: { variant: 'destructive' as const, label: 'Falhou', icon: XCircle },
      approved: { variant: 'default' as const, label: 'Aprovado', icon: CheckCircle },
      rejected: { variant: 'destructive' as const, label: 'Rejeitado', icon: XCircle },
      paid: { variant: 'default' as const, label: 'Pago', icon: CheckCircle }
    };

    const config = variants[status as keyof typeof variants];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const pendingCheckouts = getPendingCheckouts();
  const approvedCheckouts = getApprovedCheckouts();

  return (
    <div className="min-h-screen bg-gray-50">
      <ProducerHeader user={user} onLogout={logout} onCreateEvent={handleCreateEvent} />
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Wallet className="w-8 h-8 mr-3 text-green-500" />
              Área Financeira
            </h1>
            <p className="text-gray-600 mt-1">Gerencie seu saldo e pagamentos</p>
          </div>
          
          <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <CreditCard className="w-4 h-4 mr-2" />
                Adicionar Saldo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Saldo</DialogTitle>
                <DialogDescription>
                  Adicione saldo à sua carteira para poder contratar freelancers
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Valor</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0,00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Input
                    id="description"
                    placeholder="Ex: Depósito via PIX"
                    value={depositDescription}
                    onChange={(e) => setDepositDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDepositDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleDeposit}>
                  Depositar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(wallet.balance)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Depositado</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(wallet.totalDeposited)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(wallet.totalSpent)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="checkouts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="checkouts">
              Aprovações de Pagamento ({pendingCheckouts.length})
            </TabsTrigger>
            <TabsTrigger value="transactions">
              Histórico de Transações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checkouts" className="space-y-6">
            {/* Pending Checkouts */}
            <Card>
              <CardHeader>
                <CardTitle>Pagamentos Pendentes de Aprovação</CardTitle>
                <CardDescription>
                  Freelancers que solicitaram pagamento pelos serviços prestados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingCheckouts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Nenhum pagamento pendente de aprovação</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Freelancer</TableHead>
                        <TableHead>Evento</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingCheckouts.map((checkout) => (
                        <TableRow key={checkout.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{checkout.freelancerName}</div>
                              <div className="text-sm text-gray-500">{checkout.description}</div>
                            </div>
                          </TableCell>
                          <TableCell>{checkout.eventTitle}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(checkout.amount)}
                          </TableCell>
                          <TableCell>{formatDate(checkout.checkoutDate)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveCheckout(checkout.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Aprovar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedCheckout(checkout.id);
                                  setShowRejectDialog(true);
                                }}
                              >
                                Rejeitar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Approved Checkouts */}
            {approvedCheckouts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pagamentos Aprovados</CardTitle>
                  <CardDescription>
                    Pagamentos aprovados prontos para serem processados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Freelancer</TableHead>
                        <TableHead>Evento</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Aprovado em</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedCheckouts.map((checkout) => (
                        <TableRow key={checkout.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{checkout.freelancerName}</div>
                              <div className="text-sm text-gray-500">{checkout.description}</div>
                            </div>
                          </TableCell>
                          <TableCell>{checkout.eventTitle}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(checkout.amount)}
                          </TableCell>
                          <TableCell>
                            {checkout.approvedDate && formatDate(checkout.approvedDate)}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => handlePayCheckout(checkout.id)}
                              disabled={wallet.balance < checkout.amount}
                            >
                              Pagar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Transações</CardTitle>
                <CardDescription>
                  Histórico completo de depósitos e pagamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <Badge variant={transaction.type === 'deposit' ? 'default' : 'secondary'}>
                            {transaction.type === 'deposit' ? 'Depósito' : 
                             transaction.type === 'payment' ? 'Pagamento' : 'Saque'}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className={transaction.amount > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {formatCurrency(Math.abs(transaction.amount))}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Pagamento</DialogTitle>
            <DialogDescription>
              Informe o motivo da rejeição deste pagamento
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Motivo da rejeição</Label>
              <Textarea
                id="reason"
                placeholder="Ex: Serviço não foi executado conforme acordado..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleRejectCheckout}>
              Rejeitar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProducerFinance;
