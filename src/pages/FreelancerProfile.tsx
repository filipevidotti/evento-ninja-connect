import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Calendar, Share2, Camera, Edit, Award, Save, X, Plus, Phone } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import VerificationBadge from '@/components/VerificationBadge';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import FreelancerHeader from '@/components/FreelancerHeader';
import ReputationBadge from '@/components/ReputationBadge';
import { useCourses } from '@/hooks/useCourses';
import { useToast } from '@/hooks/use-toast';

const FreelancerProfile = () => {
  const { user, updateUser } = useAuth();
  const { getCompletedCourses } = useCourses();
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState<string[]>([
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
  ]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || 'João Silva',
    description: user?.description || 'Profissional experiente em eventos com mais de 5 anos de experiência. Especializado em atendimento ao cliente e organização de eventos corporativos.',
    skills: user?.skills || ['Atendimento ao Cliente', 'Organização', 'Comunicação', 'Pontualidade'],
    phone: user?.phone || '',
    whatsapp: user?.whatsapp || '',
    referencePhone: user?.referencePhone || ''
  });
  const [newSkill, setNewSkill] = useState('');

  const completedCourses = getCompletedCourses();

  const predefinedSkills = [
    'Garçom', 'Limpeza', 'Segurança', 'Word', 'Treinamento em defesa pessoal',
    'Excel', 'PowerPoint', 'Atendimento ao Cliente', 'Bartender', 'Cozinheiro',
    'Recepcionista', 'Vendas', 'Marketing', 'Fotografia', 'DJ', 'Organização',
    'Comunicação', 'Pontualidade', 'Trabalho em Equipe'
  ];

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/freelancer/dashboard' },
    { label: 'Meu Perfil' }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && portfolio.length < 9) {
      const newImages = Array.from(files).slice(0, 9 - portfolio.length);
      setPortfolio(prev => [...prev, ...newImages.map(file => URL.createObjectURL(file))]);
    }
  };

  const shareProfile = () => {
    const profileUrl = `${window.location.origin}/freelancer/profile/public/${user?.id}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link copiado!",
      description: "O link do seu perfil foi copiado para a área de transferência."
    });
  };

  const handleSaveAbout = async () => {
    const success = await updateUser({
      name: editedUser.name,
      description: editedUser.description
    });
    if (success) {
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso."
      });
      setIsEditingAbout(false);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive"
      });
    }
  };

  const handleSaveSkills = async () => {
    const success = await updateUser({
      skills: editedUser.skills
    });
    if (success) {
      toast({
        title: "Habilidades atualizadas!",
        description: "Suas habilidades foram salvas com sucesso."
      });
      setIsEditingSkills(false);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as habilidades.",
        variant: "destructive"
      });
    }
  };

  const handleSaveContact = async () => {
    const success = await updateUser({
      phone: editedUser.phone,
      whatsapp: editedUser.whatsapp,
      referencePhone: editedUser.referencePhone
    });
    if (success) {
      toast({
        title: "Contato atualizado!",
        description: "Suas informações de contato foram salvas com sucesso."
      });
      setIsEditingContact(false);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as informações de contato.",
        variant: "destructive"
      });
    }
  };

  const handleCancelAbout = () => {
    setEditedUser({
      ...editedUser,
      name: user?.name || 'João Silva',
      description: user?.description || 'Profissional experiente em eventos com mais de 5 anos de experiência.'
    });
    setIsEditingAbout(false);
  };

  const handleCancelSkills = () => {
    setEditedUser({
      ...editedUser,
      skills: user?.skills || ['Atendimento ao Cliente', 'Organização', 'Comunicação', 'Pontualidade']
    });
    setIsEditingSkills(false);
    setNewSkill('');
  };

  const handleCancelContact = () => {
    setEditedUser({
      ...editedUser,
      phone: user?.phone || '',
      whatsapp: user?.whatsapp || '',
      referencePhone: user?.referencePhone || ''
    });
    setIsEditingContact(false);
  };

  const addSkill = (skill: string) => {
    if (!editedUser.skills.includes(skill)) {
      setEditedUser({
        ...editedUser,
        skills: [...editedUser.skills, skill]
      });
    }
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    setEditedUser({
      ...editedUser,
      skills: editedUser.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const addCustomSkill = () => {
    if (newSkill.trim() && !editedUser.skills.includes(newSkill.trim())) {
      addSkill(newSkill.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FreelancerHeader />
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="max-w-6xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Header - Mobile Responsive */}
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <Avatar className="w-20 h-20 lg:w-24 lg:h-24">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-xl lg:text-2xl">
                      {(user?.name || 'João Silva')?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
                      <h1 className="text-2xl lg:text-3xl font-bold">{user?.name || 'João Silva'}</h1>
                      <div className="flex justify-center sm:justify-start mt-1 sm:mt-0">
                        <VerificationBadge />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-600 mb-2">
                      <div className="flex items-center justify-center sm:justify-start space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{user?.city || 'São Paulo'}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{user?.rating || '4.8'} • 12 eventos</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button onClick={shareProfile} variant="outline" className="w-full sm:w-auto">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar Perfil
                </Button>
              </div>
              
              {/* Status and Actions - Separate row for mobile */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
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
                  <div className="flex justify-center sm:justify-start">
                    <ReputationBadge 
                      level="gold" 
                      points={1250} 
                      size="md" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="about" className="text-xs lg:text-sm">Sobre</TabsTrigger>
            <TabsTrigger value="contact" className="text-xs lg:text-sm">Contato</TabsTrigger>
            <TabsTrigger value="courses" className="text-xs lg:text-sm">Cursos</TabsTrigger>
            <TabsTrigger value="portfolio" className="text-xs lg:text-sm">Portfólio</TabsTrigger>
            <TabsTrigger value="history" className="text-xs lg:text-sm hidden lg:inline-flex">Histórico</TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs lg:text-sm hidden lg:inline-flex">Avaliações</TabsTrigger>
          </TabsList>

          {/* Mobile extra tabs */}
          <div className="lg:hidden">
            <TabsList className="grid w-full grid-cols-2 mt-2">
              <TabsTrigger value="history" className="text-xs">Histórico</TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs">Avaliações</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Sobre mim</CardTitle>
                  {!isEditingAbout ? (
                    <Button onClick={() => setIsEditingAbout(true)} variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleCancelAbout} variant="outline" size="sm">
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveAbout} size="sm">
                        <Save className="w-4 h-4 mr-1" />
                        Salvar
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditingAbout ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome</label>
                      <Input
                        value={editedUser.name}
                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Descrição</label>
                      <Textarea
                        value={editedUser.description}
                        onChange={(e) => setEditedUser({ ...editedUser, description: e.target.value })}
                        placeholder="Conte um pouco sobre você..."
                        rows={4}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-700">
                        {editedUser.description || "Adicione uma descrição sobre você..."}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Especializações</CardTitle>
                  {!isEditingSkills ? (
                    <Button onClick={() => setIsEditingSkills(true)} variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleCancelSkills} variant="outline" size="sm">
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveSkills} size="sm">
                        <Save className="w-4 h-4 mr-1" />
                        Salvar
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditingSkills && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Adicionar nova habilidade"
                        onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                      />
                      <Button onClick={addCustomSkill} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Habilidades sugeridas:</p>
                      <div className="flex flex-wrap gap-1">
                        {predefinedSkills
                          .filter(skill => !editedUser.skills.includes(skill))
                          .map(skill => (
                            <Button
                              key={skill}
                              variant="outline"
                              size="sm"
                              onClick={() => addSkill(skill)}
                              className="text-xs h-7"
                            >
                              + {skill}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {editedUser.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      {isEditingSkills && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Informações de Contato
                  </CardTitle>
                  {!isEditingContact ? (
                    <Button onClick={() => setIsEditingContact(true)} variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleCancelContact} variant="outline" size="sm">
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveContact} size="sm">
                        <Save className="w-4 h-4 mr-1" />
                        Salvar
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditingContact ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Telefone</label>
                        <Input
                          value={editedUser.phone}
                          onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">WhatsApp</label>
                        <Input
                          value={editedUser.whatsapp}
                          onChange={(e) => setEditedUser({ ...editedUser, whatsapp: e.target.value })}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Telefone de Referência</label>
                      <Input
                        value={editedUser.referencePhone}
                        onChange={(e) => setEditedUser({ ...editedUser, referencePhone: e.target.value })}
                        placeholder="(11) 99999-9999 - Contato de emergência"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Telefone</label>
                        <p className="text-sm py-2">{editedUser.phone || 'Não informado'}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">WhatsApp</label>
                        <p className="text-sm py-2">{editedUser.whatsapp || 'Não informado'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Telefone de Referência</label>
                      <p className="text-sm py-2">{editedUser.referencePhone || 'Não informado'}</p>
                    </div>
                  </div>
                )}
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
                  {[
                    { id: 1, name: 'Casamento dos Santos', producer: 'Eventos Premium', role: 'Garçom', date: '15 de Janeiro, 2024', status: 'Concluído', payment: 'R$ 180,00' },
                    { id: 2, name: 'Festa Corporativa', producer: 'Business Events', role: 'Recepcionista', date: '22 de Janeiro, 2024', status: 'Concluído', payment: 'R$ 150,00' },
                    { id: 3, name: 'Aniversário de Empresa', producer: 'Mega Eventos', role: 'Limpeza', date: '28 de Janeiro, 2024', status: 'Concluído', payment: 'R$ 120,00' },
                    { id: 4, name: 'Formatura UNESP', producer: 'Formaturas SP', role: 'Segurança', date: '05 de Fevereiro, 2024', status: 'Concluído', payment: 'R$ 200,00' },
                    { id: 5, name: 'Workshop de Marketing', producer: 'Eventos Tech', role: 'Suporte Técnico', date: '12 de Fevereiro, 2024', status: 'Concluído', payment: 'R$ 160,00' }
                  ].map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{event.name}</h3>
                        <p className="text-sm text-gray-600">{event.producer} • {event.role}</p>
                        <p className="text-sm text-gray-500">{event.date}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{event.status}</Badge>
                        <p className="text-sm text-gray-600 mt-1">{event.payment}</p>
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
                  {[
                    { id: 1, producer: 'Eventos Premium', rating: 5, comment: 'Excelente profissional, pontual e dedicado. Recomendo!', date: '20/01/2024' },
                    { id: 2, producer: 'Business Events', rating: 5, comment: 'Muito atencioso e prestativo. Trabalho impecável!', date: '25/01/2024' },
                    { id: 3, producer: 'Mega Eventos', rating: 4, comment: 'Bom trabalho, chegou no horário e cumpriu todas as tarefas.', date: '30/01/2024' }
                  ].map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{review.producer.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{review.producer}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                      <p className="text-xs text-gray-500 mt-1">Evento realizado em {review.date}</p>
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
