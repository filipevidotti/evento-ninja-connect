
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Clock, Award, Play, CheckCircle, Filter } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import FreelancerHeader from '@/components/FreelancerHeader';
import BreadcrumbNav from '@/components/BreadcrumbNav';

const FreelancerCourses = () => {
  const { courses, userProgress, getCourseProgress, startCourse } = useCourses();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/freelancer/dashboard' },
    { label: 'Cursos' }
  ];

  const categories = ['all', ...new Set(courses.map(course => course.category))];
  
  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const availableCourses = filteredCourses.filter(course => {
    const progress = getCourseProgress(course.id);
    return !progress || progress.status !== 'concluido';
  });

  const inProgressCourses = filteredCourses.filter(course => {
    const progress = getCourseProgress(course.id);
    return progress && progress.status === 'em_andamento';
  });

  const completedCourses = filteredCourses.filter(course => {
    const progress = getCourseProgress(course.id);
    return progress && progress.status === 'concluido';
  });

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'iniciante': return 'bg-green-100 text-green-800';
      case 'intermediario': return 'bg-yellow-100 text-yellow-800';
      case 'avancado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartCourse = async (courseId: string) => {
    await startCourse(courseId);
    // Aqui você poderia navegar para a página do curso ou atualizar o estado
  };

  const renderCourseCard = (course: any, showProgress = false) => {
    const progress = getCourseProgress(course.id);
    
    return (
      <Card key={course.id} className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <CardDescription className="mt-2">{course.description}</CardDescription>
            </div>
            <Badge className={getDifficultyColor(course.difficulty_level)}>
              {course.difficulty_level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration_hours}h</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{course.content.modules.length} módulos</span>
              </div>
              <Badge variant="secondary">{course.category}</Badge>
            </div>

            {showProgress && progress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progresso</span>
                  <span>{progress.progress_percentage}%</span>
                </div>
                <Progress value={progress.progress_percentage} className="h-2" />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {course.content.modules.reduce((total: number, module: any) => total + module.lessons, 0)} aulas
              </div>
              
              {progress?.status === 'concluido' ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Concluído
                </Badge>
              ) : progress?.status === 'em_andamento' ? (
                <Button size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Continuar
                </Button>
              ) : (
                <Button size="sm" onClick={() => handleStartCourse(course.id)}>
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FreelancerHeader />
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Cursos</h1>
            <p className="text-gray-600">Desenvolva suas habilidades profissionais</p>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Todas as categorias</option>
              {categories.filter(cat => cat !== 'all').map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{courses.length}</p>
                  <p className="text-sm text-gray-600">Cursos Disponíveis</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Play className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{inProgressCourses.length}</p>
                  <p className="text-sm text-gray-600">Em Andamento</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Award className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{completedCourses.length}</p>
                  <p className="text-sm text-gray-600">Concluídos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">Disponíveis</TabsTrigger>
            <TabsTrigger value="in-progress">Em Andamento</TabsTrigger>
            <TabsTrigger value="completed">Concluídos</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            {availableCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableCourses.map(course => renderCourseCard(course))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum curso disponível
                  </h3>
                  <p className="text-gray-600">
                    Todos os cursos desta categoria foram iniciados ou concluídos.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-6">
            {inProgressCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inProgressCourses.map(course => renderCourseCard(course, true))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum curso em andamento
                  </h3>
                  <p className="text-gray-600">
                    Inicie um curso para começar seu desenvolvimento profissional.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedCourses.map(course => renderCourseCard(course))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum curso concluído
                  </h3>
                  <p className="text-gray-600">
                    Complete seus primeiros cursos para ganhar certificações.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FreelancerCourses;
