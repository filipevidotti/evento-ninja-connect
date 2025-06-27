
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  UserCheck,
  AlertTriangle,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface DashboardMetrics {
  totalUsers: number;
  eventsThisMonth: number;
  totalRevenue: number;
  conversionRate: number;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
}

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    eventsThisMonth: 0,
    totalRevenue: 0,
    conversionRate: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('30');
  const { toast } = useToast();

  // Sample chart data
  const userGrowthData = [
    { month: 'Jan', users: 120 },
    { month: 'Fev', users: 150 },
    { month: 'Mar', users: 180 },
    { month: 'Abr', users: 220 },
    { month: 'Mai', users: 280 },
    { month: 'Jun', users: 350 }
  ];

  const eventsCategoryData = [
    { category: 'Corporativo', events: 45 },
    { category: 'Social', events: 32 },
    { category: 'Casamento', events: 28 },
    { category: 'Festa', events: 22 },
    { category: 'Show', events: 18 }
  ];

  const chartConfig = {
    users: {
      label: "Usuários",
      color: "#3b82f6",
    },
    events: {
      label: "Eventos",
      color: "#10b981",
    },
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch total users
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('id', { count: 'exact' });

      if (usersError) throw usersError;

      // Fetch events this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id', { count: 'exact' })
        .gte('created_at', startOfMonth.toISOString());

      if (eventsError) throw eventsError;

      // Fetch recent activities (mock data for now)
      const recentActivities: Activity[] = [
        {
          id: '1',
          type: 'user_registration',
          description: 'Novo usuário registrado',
          timestamp: new Date().toISOString(),
          user: 'João Silva'
        },
        {
          id: '2',
          type: 'event_created',
          description: 'Evento "Festa de Ano Novo" criado',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: 'Maria Santos'
        },
        {
          id: '3',
          type: 'verification_pending',
          description: 'Verificação de identidade pendente',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          user: 'Pedro Costa'
        }
      ];

      setMetrics({
        totalUsers: usersData?.length || 0,
        eventsThisMonth: eventsData?.length || 0,
        totalRevenue: 15420.50, // Mock data
        conversionRate: 68.5 // Mock data
      });

      setActivities(recentActivities);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do dashboard.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Administrativo
            </h1>
            <p className="text-gray-600">
              Visão geral da plataforma EventConnect
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={fetchDashboardData}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +12% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos Este Mês</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.eventsThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                +8% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                +15% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Usuários</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="var(--color-users)" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eventos por Categoria</CardTitle>
              <CardDescription>Distribuição atual</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventsCategoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="events" 
                      fill="var(--color-events)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Activities and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>Últimas 10 ações na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {activity.user} • {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alertas Urgentes</CardTitle>
              <CardDescription>Ações que requerem atenção</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">3 verificações pendentes</p>
                    <p className="text-xs text-gray-600">Aguardando aprovação manual</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium">2 disputas ativas</p>
                    <p className="text-xs text-gray-600">Requerem mediação</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">15 novos usuários hoje</p>
                    <p className="text-xs text-gray-600">Aguardando ativação</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
