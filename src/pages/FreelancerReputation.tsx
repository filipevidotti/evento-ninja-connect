
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Star, AlertTriangle, Calendar, CheckCircle } from 'lucide-react';
import FreelancerHeader from '@/components/FreelancerHeader';
import ReputationBadge from '@/components/ReputationBadge';
import { useReputation } from '@/hooks/useReputation';

const FreelancerReputation = () => {
  const { reputationData, getNextLevel, getLevelRequirements } = useReputation();
  const nextLevel = getNextLevel(reputationData.level, reputationData.points);
  const currentRequirements = getLevelRequirements(reputationData.level);

  return (
    <div className="min-h-screen bg-gray-50">
      <FreelancerHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Minha Reputação</h1>
          <p className="text-gray-600">Acompanhe sua performance e medalhas conquistadas</p>
        </div>

        {/* Header com Medalha Atual */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <ReputationBadge 
                  level={reputationData.level} 
                  points={reputationData.points}
                  size="lg"
                />
                <div>
                  <h2 className="text-2xl font-bold">{reputationData.points} pontos</h2>
                  <p className="text-gray-600">Nível {reputationData.level.charAt(0).toUpperCase() + reputationData.level.slice(1)}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-2">Próximo nível: {nextLevel.level}</p>
                <div className="w-48 mb-2">
                  <Progress value={Math.max(0, 100 - (nextLevel.pointsNeeded / 10))} />
                </div>
                <p className="text-xs text-gray-500">
                  Faltam {nextLevel.pointsNeeded > 0 ? nextLevel.pointsNeeded : 0} pontos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Métricas Principais */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{reputationData.completionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.floor(reputationData.totalEvents * reputationData.completionRate / 100)}/{reputationData.totalEvents} eventos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Comparecimento</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{reputationData.attendanceRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.floor(reputationData.totalEvents * reputationData.attendanceRate / 100)}/{reputationData.totalEvents} eventos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{reputationData.averageRating}⭐</div>
                  <p className="text-xs text-muted-foreground">Baseado em {reputationData.totalEvents - 5} avaliações</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reclamações</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{reputationData.complaints.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {reputationData.complaints.valid} procedentes, {reputationData.complaints.invalid} improcedentes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de Evolução */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Evolução da Reputação
                </CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reputationData.monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="points" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Histórico Detalhado */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico Recente</CardTitle>
                <CardDescription>Últimas alterações na reputação</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reputationData.recentChanges.map((change, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{change.reason}</p>
                          <p className="text-sm text-gray-600">{change.date}</p>
                        </div>
                      </div>
                      <Badge variant={change.change > 0 ? "default" : "destructive"}>
                        {change.change > 0 ? '+' : ''}{change.change} pontos
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Requisitos do Nível */}
            <Card>
              <CardHeader>
                <CardTitle>Requisitos - Nível {reputationData.level.charAt(0).toUpperCase() + reputationData.level.slice(1)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p><strong>Eventos mínimos:</strong> {currentRequirements.minEvents}</p>
                  <p><strong>Pontuação:</strong> {currentRequirements.pointsRange}</p>
                  <p><strong>Taxa desistência:</strong> ≤{currentRequirements.maxQuitRate}%</p>
                  <p><strong>Taxa no-show:</strong> ≤{currentRequirements.maxNoShowRate}%</p>
                  {currentRequirements.minRating > 0 && (
                    <p><strong>Avaliação mín:</strong> {currentRequirements.minRating}</p>
                  )}
                </div>
                <div className="pt-3 border-t">
                  <p className="font-medium text-sm mb-2">Benefícios:</p>
                  <ul className="text-sm space-y-1">
                    {currentRequirements.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Dicas para Melhorar */}
            <Card>
              <CardHeader>
                <CardTitle>Dicas para Melhorar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Próximo Objetivo</p>
                  <p className="text-sm text-blue-700">Complete mais {nextLevel.pointsNeeded > 0 ? Math.ceil(nextLevel.pointsNeeded / 10) : 0} eventos para subir de nível</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Sugestões:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Mantenha 100% de comparecimento</li>
                    <li>• Busque sempre avaliações 5 estrelas</li>
                    <li>• Evite cancelamentos de última hora</li>
                    <li>• Seja proativo na comunicação</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Simulador */}
            <Card>
              <CardHeader>
                <CardTitle>Simulador de Impacto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full text-left justify-start">
                    Se cancelar um evento: -15 pontos
                  </Button>
                  <Button variant="outline" className="w-full text-left justify-start">
                    Se receber 5⭐: +15 pontos
                  </Button>
                  <Button variant="outline" className="w-full text-left justify-start">
                    10 eventos seguidos: +50 pontos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerReputation;
