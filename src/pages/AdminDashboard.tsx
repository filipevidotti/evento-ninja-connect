import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, AlertTriangle, DollarSign, BarChart3, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface DashboardStats {
  totalUsers: number;
  pendingVerifications: number;
  activeDisputes: number;
  monthlyRevenue: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingVerifications: 0,
    activeDisputes: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch total users
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('count', { count: 'exact' });

      if (usersError) throw usersError;

      // Fetch pending verifications
      const { data: verificationsData, error: verificationsError } = await supabase
        .from('verifications')
        .select('count', { count: 'exact' })
        .eq('status', 'pending');

      if (verificationsError) throw verificationsError;

      // Fetch active disputes
      const { data: disputesData, error: disputesError } = await supabase
        .from('disputes')
        .select('count', { count: 'exact' })
        .neq('status', 'resolved')
        .neq('status', 'closed');

      if (disputesError) throw disputesError;

      // Fetch monthly revenue (example: sum of transactions in the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: revenueData, error: revenueError } = await supabase
        .from('transactions')
        .select('amount')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (revenueError) throw revenueError;

      const monthlyRevenue = revenueData?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;

      setStats({
        totalUsers: usersData ? usersData[0]?.count || 0 : 0,
        pendingVerifications: verificationsData ? verificationsData[0]?.count || 0 : 0,
        activeDisputes: disputesData ? disputesData[0]?.count || 0 : 0,
        monthlyRevenue: monthlyRevenue,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados do painel',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Gerencie usuários, verificações e atividades da plataforma</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/users')}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Usuários</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/verifications')}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Verificações</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingVerifications}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/disputes')}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Disputas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeDisputes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/finance')}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Financeiro</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {stats.monthlyRevenue.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gestão de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Visualize e gerencie todos os usuários da plataforma, incluindo freelancers e produtores.
              </p>
              <Button onClick={() => navigate('/admin/users')} className="w-full">
                Acessar
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verificações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Aprove ou rejeite solicitações de verificação de identidade dos usuários.
              </p>
              <Button onClick={() => navigate('/admin/verifications')} className="w-full">
                Acessar
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Centro de Disputas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Gerencie disputas entre usuários, mediate conflitos e tome decisões.
              </p>
              <Button onClick={() => navigate('/admin/disputes')} className="w-full">
                Acessar
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Gestão Financeira
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Monitore transações, configure comissões e gere relatórios financeiros.
              </p>
              <Button onClick={() => navigate('/admin/finance')} className="w-full">
                Acessar
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Relatórios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Acesse relatórios detalhados sobre atividades da plataforma.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Em Breve
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configure parâmetros da plataforma e preferências do sistema.
              </p>
              <Button variant="outline" className="w-full" disabled>
                Em Breve
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Em breve, você poderá visualizar as atividades mais recentes da plataforma aqui.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

import { Clock } from 'lucide-react';
