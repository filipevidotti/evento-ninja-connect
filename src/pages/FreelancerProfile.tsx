
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Calendar, Share2, Camera, Edit, Award } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import VerificationBadge from '@/components/VerificationBadge';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import FreelancerHeader from '@/components/FreelancerHeader';
import ReputationBadge from '@/components/ReputationBadge';
import { useCourses } from '@/hooks/useCourses';

const FreelancerProfile = () => {
  const { user } = useAuth();
  const { getCompletedCourses } = useCourses();
  const [portfolio, setPortfolio] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);

  const completedCourses = getCompletedCourses();

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/freelancer/dashboard' },
    { label: 'Meu Perfil' }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && portfolio.length < 9) {
      // Simular upload de imagem
      const newImages = Array.from(files).slice(0, 9 - portfolio.length);
      setPortfolio(prev => [...prev, ...newImages.map(file => URL.createObjectURL(file))]);
    }
  };

  const shareProfile = () => {
    const profileUrl = `${window.location.origin}/freelancer/profile/public/${user?.id}`;
    navigator.clipboard.writeText(profileUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FreelancerHeader />
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-2xl">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-3xl font-bold">{user?.name}</h1>
                    <VerificationBadge />
                  </div>
                  <div className="flex items-center space-x-4 text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user?.city}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{user?.rating || 'Novo'} • 12 eventos</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant={isAvailable ? "default" : "secondary"}>
                      {isAvailable ? "Disponível" : "Ocupado"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAvailable(!isAvailable)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Alterar Status
                    </Button>
                  </div>
                  {/* Medalha de Reputação */}
                  <div className="mt-2">
                    <ReputationBadge 
                      level="gold" 
                      points={1250} 
                      size="md" 
                    />
                  </div>
                </div>
              </div>
              <Button onClick={shareProfile} variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar Perfil
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="about">Sobre</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
            <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sobre mim</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  {user?.description || "Adicione uma descrição sobre você..."}
                </p>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Descrição
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Especializações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user?.skills?.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Cursos Concluídos
                </CardTitle>
                <CardDescription>
                  Certificações e cursos que você completou ({completedCourses.length} cursos)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {completedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {completedCourses.map((course: any) => (
                      <div key={course.id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-green-900">{course.title}</h4>
                            <p className="text-sm text-green-700 mt-1">{course.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                                {course.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                                {course.duration_hours}h
                              </Badge>
                            </div>
                            {course.completed_at && (
                              <p className="text-xs text-green-600 mt-2">
                                Concluído em {new Date(course.completed_at).toLocaleDateString('pt-BR')}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center text-green-600 ml-4">
                            <Award className="w-6 h-6" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum curso concluído ainda.</p>
                    <p className="text-sm mt-1">Acesse a seção de Cursos para começar a aprender!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Portfólio de Fotos
                  <span className="text-sm text-gray-500">{portfolio.length}/9</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {portfolio.map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img src={image} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {portfolio.length < 9 && (
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-500">Adicionar Foto</span>
                      </div>
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Eventos</CardTitle>
                <CardDescription>Últimos 5 eventos trabalhados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((event) => (
                    <div key={event} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Evento {event}</h3>
                        <p className="text-sm text-gray-600">Produtor ABC • Garçom</p>
                        <p className="text-sm text-gray-500">15 de Janeiro, 2024</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">Concluído</Badge>
                        <p className="text-sm text-gray-600 mt-1">R$ 180,00</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Avaliações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>P{review}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">Produtor {review}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">
                        Excelente profissional, pontual e dedicado. Recomendo!
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Evento realizado em 20/01/2024</p>
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

export default FreelancerProfile;
