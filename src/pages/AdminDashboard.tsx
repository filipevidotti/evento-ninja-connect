
import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/components/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  RefreshCw,
  Download,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';

interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  eventsThisMonth: number;
  totalRevenue: number;
  conversionRate: number;
  pendingDisputes: number;
  pendingVerifications: number;
}

interface ActivityLog {
  id: string;
  action: string;
  entity_type: string;
  created_at: string;
  details: any;
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { isAdmin, isSuperAdmin, isLoading } = useAdmin();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    eventsThisMonth: 0,
    totalRevenue: 0,
    conversionRate: 0,
    pendingDisputes: 0,
    pendingVerifications: 0
  });
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [eventsCategoryData, setEventsCategoryData] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      // Fetch user metrics
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('*');

      // Fetch events this month
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .gte('created_at', firstDayOfMonth.toISOString());

      // Fetch disputes
      const { data: disputes } = await supabase
        .from('disputes')
        .select('*')
        .eq('status', 'pending');

      // Fetch verifications
      const { data: verifications } = await supabase
        .from('verifications')
        .select('*')
        .eq('status', 'pendente');

      // Fetch activity logs
      const { data: logs } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      setMetrics({
        totalUsers: profiles?.length || 0,
        activeUsers: profiles?.filter(p => p.verificado)?.length || 0,
        eventsThisMonth: events?.length || 0,
        totalRevenue: 0, // This would need to be calculated from transactions
        conversionRate: 75.2, // This would be calculated from applications
        pendingDisputes: disputes?.length || 0,
        pendingVerifications: verifications?.length || 0
      });

      setActivityLogs(logs || []);

      // Generate mock data for charts (in real implementation, this would come from metrics table)
      const mockUserGrowth = Array.from({ length: 6 }, (_, i) => ({
        month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { month: 'short' }),
        users: Math.floor(Math.random() * 100) + 50 + i * 20
      }));

      const mockEventsCategory = [
        { category: 'Música', events: 45 },
        { category: 'Corporate', events: 32 },
        { category: 'Casamento', events: 28 },
        { category: 'Festival', events: 15 },
        { category: 'Teatro', events: 12 }
      ];

      setUserGrowthData(mockUserGrowth);
      setEventsCategoryData(mockEventsCategory);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
      
      // Auto refresh every 30 seconds
      const interval = setInterval(fetchDashboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, selectedPeriod]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const exportReport = () => {
    // In a real implementation, this would generate and download a PDF report
    console.log('Exporting report...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                EventConnect Admin
              </h1>
              <Badge variant="destructive">SUPER ADMIN</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchDashboardData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportReport}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback>{user?.name?.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-gray-600">Super Admin</p>
                </div>
              </div>
              <Button variant="outline" onClick={logout}>Sair</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Filter */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {[
              { value: '7', label: '7 dias' },
              { value: '30', label: '30 dias' },
              { value: '90', label: '3 meses' }
            ].map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period.value)}
              >
                {period.label}
              </Button>
            ))}
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
                {metrics.activeUsers} verificados
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
                +20% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {metrics.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% vs mês anterior
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
                Aplicações → Aprovações
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {(metrics.pendingDisputes > 0 || metrics.pendingVerifications > 0) && (
          <div className="mb-8">
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Alertas Urgentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {metrics.pendingDisputes > 0 && (
                    <p className="text-sm text-orange-700">
                      {metrics.pendingDisputes} disputas pendentes de resolução
                    </p>
                  )}
                  {metrics.pendingVerifications > 0 && (
                    <p className="text-sm text-orange-700">
                      {metrics.pendingVerifications} verificações pendentes de análise
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Events by Category Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Eventos por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventsCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="events" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLogs.length > 0 ? (
                activityLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-gray-600">{log.entity_type}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhuma atividade recente</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
