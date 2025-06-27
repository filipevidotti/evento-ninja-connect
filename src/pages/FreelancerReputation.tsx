import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, AlertTriangle, CheckCircle, Clock, Star } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useReputation } from '@/hooks/useReputation';
import ReputationBadge from '@/components/ReputationBadge';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import FreelancerHeader from '@/components/FreelancerHeader';

const FreelancerReputation = () => {
  const { user } = useAuth();
  const { reputation, reputationHistory, metrics, tips } = useReputation(user?.id || '');

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/freelancer/dashboard' },
    { label: 'Reputação' }
  ];

  const nextLevel = reputation.level === 'bronze' ? 'silver' : 
                   reputation.level === 'silver' ? 'gold' : 
                   reputation.level === 'gold' ? 'diamond' : null;

  const nextLevelPoints = {
    bronze: 1000,
    silver: 1200,
    gold: 1500,
    diamond: 2000
  };

  const progressToNext = nextLevel ? 
    ((reputation.points - (reputation.level === 'bronze' ? 800 : reputation.level === 'silver' ? 1000 : 1200)) / 
     (nextLevelPoints[nextLevel] - (reputation.level === 'bronze' ? 800 : reputation.level === 'silver' ? 1000 : 1200))) * 100 : 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <FreelancerHeader />
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header with Current Badge */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <ReputationBadge 
                  level={reputation.level} 
                  points={reputation.points} 
                  size="lg" 
                />
                <div>
                  <h1 className="text-3xl font-bold mb-2">Sua Reputação</h1>
                  <p className="text-gray-600">
                    {reputation.points} pontos • Nível {reputation.level === 'bronze' ? 'Bronze' : 
                                                      reputation.level === 'silver' ? 'Prata' : 
                                                      reputation.level === 'gold' ? 'Ouro' : 'Diamante'}
                  </p>
                  {nextLevel && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          Progresso para {nextLevel === 'silver' ? 'Prata' : 
                                        nextLevel === 'gold' ? 'Ouro' : 'Diamante'}
                        </span>
                        <span className="text-sm font-medium">
                          {Math.round(progressToNext)}%
                        </span>
                      </div>
                      <Progress value={progressToNext} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{metrics.completionRate}%</p>
                  <p className="text-sm text-gray-600">Taxa de Conclusão</p>
                  <p className="text-xs text-gray-500">{metrics.completedEvents}/{metrics.totalEvents} eventos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{metrics.attendanceRate}%</p>
                  <p className="text-sm text-gray-600">Taxa de Comparecimento</p>
                  <p className="text-xs text-gray-500">{metrics.attendedEvents}/{metrics.totalEvents} eventos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{metrics.averageRating}⭐</p>
                  <p className="text-sm text-gray-600">Avaliação Média</p>
                  <p className="text-xs text-gray-500">Baseado em {metrics.totalReviews} avaliações</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{metrics.complaints}</p>
                  <p className="text-sm text-gray-600">Reclamações</p>
                  <p className="text-xs text-gray-500">{metrics.validComplaints} procedente(s)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evolution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Evolução da Reputação</span>
            </CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reputationHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="points" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Changes and Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Alterações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Evento concluído', points: '+10', date: '2 dias atrás', type: 'positive' },
                  { action: 'Avaliação 5 estrelas', points: '+5', date: '2 dias atrás', type: 'positive' },
                  { action: 'Evento concluído', points: '+10', date: '1 semana atrás', type: 'positive' },
                  { action: 'Desistência (24h+)', points: '-5', date: '2 semanas atrás', type: 'negative' }
                ].map((change, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{change.action}</p>
                      <p className="text-sm text-gray-600">{change.date}</p>
                    </div>
                    <Badge variant={change.type === 'positive' ? 'default' : 'destructive'}>
                      {change.points} pontos
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dicas para Melhorar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tips.map((tip, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Award className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">{tip.title}</p>
                        <p className="text-sm text-blue-700">{tip.description}</p>
                        <p className="text-xs text-blue-600 mt-1">Potencial: {tip.points}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FreelancerReputation;
