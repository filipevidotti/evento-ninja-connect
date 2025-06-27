
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Award, BookOpen, TrendingUp } from 'lucide-react';
import { User } from '@/components/AuthContext';
import { Event } from '@/components/EventContext';
import EditableProfile from './EditableProfile';

interface ProducerProfileProps {
  user: User | null;
  events: Event[];
  getApplicationsByEvent: (eventId: string) => any[];
}

const ProducerProfile: React.FC<ProducerProfileProps> = ({ user, events, getApplicationsByEvent }) => {
  const totalApplications = events.reduce((total, event) => {
    return total + getApplicationsByEvent(event.id).length;
  }, 0);

  const totalApprovals = events.reduce((total, event) => {
    return total + getApplicationsByEvent(event.id).filter(app => app.status === 'aprovado').length;
  }, 0);

  // Cursos recomendados para produtores
  const recommendedCourses = [
    {
      id: 'course-1',
      title: 'Gestão de Eventos Corporativos',
      description: 'Aprenda a organizar eventos corporativos de alta qualidade',
      duration: '4 horas',
      level: 'Intermediário',
      category: 'Gestão',
      completed: false
    },
    {
      id: 'course-2',
      title: 'Protocolo e Etiqueta em Eventos',
      description: 'Domine as regras de protocolo para eventos formais',
      duration: '3 horas',
      level: 'Básico',
      category: 'Protocolo',
      completed: true
    },
    {
      id: 'course-3',
      title: 'Orçamento e Precificação de Eventos',
      description: 'Como calcular custos e definir preços competitivos',
      duration: '2 horas',
      level: 'Avançado',
      category: 'Financeiro',
      completed: false
    },
    {
      id: 'course-4',
      title: 'Marketing Digital para Produtores',
      description: 'Estratégias de marketing para divulgar seus eventos',
      duration: '5 horas',
      level: 'Intermediário',
      category: 'Marketing',
      completed: false
    }
  ];

  const completedCourses = recommendedCourses.filter(course => course.completed);
  const availableCourses = recommendedCourses.filter(course => !course.completed);

  return (
    <div className="space-y-6">
      <EditableProfile />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Estatísticas do Organizador
          </CardTitle>
          <CardDescription>Resumo da sua atividade na plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{events.length}</div>
              <div className="text-sm text-gray-600">Eventos Criados</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.status === 'open').length}
              </div>
              <div className="text-sm text-gray-600">Eventos Ativos</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {totalApplications}
              </div>
              <div className="text-sm text-gray-600">Candidaturas</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {totalApprovals}
              </div>
              <div className="text-sm text-gray-600">Aprovações</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Cursos Concluídos */}
      {completedCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              Cursos Concluídos
            </CardTitle>
            <CardDescription>Certificações e cursos que você já completou</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedCourses.map(course => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <h4 className="font-medium text-green-900">{course.title}</h4>
                    <p className="text-sm text-green-700">{course.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-green-100">
                        {course.duration}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-green-100">
                        {course.level}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seção de Cursos Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Cursos Recomendados
          </CardTitle>
          <CardDescription>Aprimore suas habilidades como organizador de eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableCourses.map(course => (
              <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{course.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {course.duration}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {course.level}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                      {course.category}
                    </Badge>
                  </div>
                </div>
                <div className="ml-4">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Iniciar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProducerProfile;
