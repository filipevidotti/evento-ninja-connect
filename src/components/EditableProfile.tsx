
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Edit, Save, X, Plus, Award, Phone } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCourses } from '@/hooks/useCourses';

const EditableProfile = () => {
  const { user, updateUser } = useAuth();
  const { getCompletedCourses } = useCourses();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    city: user?.city || '',
    phone: user?.phone || '',
    whatsapp: user?.whatsapp || '',
    referencePhone: user?.referencePhone || '',
    description: user?.description || '',
    skills: user?.skills || []
  });
  const [newSkill, setNewSkill] = useState('');

  const completedCourses = getCompletedCourses();

  const predefinedSkills = [
    'Garçom', 'Limpeza', 'Segurança', 'Word', 'Treinamento em defesa pessoal',
    'Excel', 'PowerPoint', 'Atendimento ao Cliente', 'Bartender', 'Cozinheiro',
    'Recepcionista', 'Vendas', 'Marketing', 'Fotografia', 'DJ'
  ];

  const handleSave = async () => {
    const success = await updateUser(editedUser);
    if (success) {
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso."
      });
      setIsEditing(false);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || '',
      city: user?.city || '',
      phone: user?.phone || '',
      whatsapp: user?.whatsapp || '',
      referencePhone: user?.referencePhone || '',
      description: user?.description || '',
      skills: user?.skills || []
    });
    setIsEditing(false);
    setNewSkill('');
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-lg">
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Meu Perfil
                  <Badge variant="secondary">{user?.type === 'freelancer' ? 'Freelancer' : 'Produtor'}</Badge>
                </CardTitle>
                <CardDescription>Gerencie suas informações pessoais</CardDescription>
              </div>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
                <Button onClick={handleSave} size="sm">
                  <Save className="w-4 h-4 mr-1" />
                  Salvar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              {isEditing ? (
                <Input
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  placeholder="Seu nome completo"
                />
              ) : (
                <p className="text-sm py-2">{user?.name || 'Não informado'}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Cidade</label>
              {isEditing ? (
                <Input
                  value={editedUser.city}
                  onChange={(e) => setEditedUser({ ...editedUser, city: e.target.value })}
                  placeholder="Sua cidade"
                />
              ) : (
                <p className="text-sm py-2">{user?.city || 'Não informado'}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            {isEditing ? (
              <Textarea
                value={editedUser.description}
                onChange={(e) => setEditedUser({ ...editedUser, description: e.target.value })}
                placeholder="Conte um pouco sobre você..."
                rows={3}
              />
            ) : (
              <p className="text-sm py-2">{user?.description || 'Nenhuma descrição adicionada'}</p>
            )}
          </div>

          {user?.type === 'freelancer' && (
            <div className="space-y-4">
              <label className="text-sm font-medium">Habilidades</label>
              
              {isEditing && (
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
                {(isEditing ? editedUser.skills : user?.skills || []).map(skill => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    {isEditing && (
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seção de Contato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Informações de Contato
          </CardTitle>
          <CardDescription>Seus dados de contato para comunicação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Telefone</label>
              {isEditing ? (
                <Input
                  value={editedUser.phone}
                  onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              ) : (
                <p className="text-sm py-2">{user?.phone || 'Não informado'}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">WhatsApp</label>
              {isEditing ? (
                <Input
                  value={editedUser.whatsapp}
                  onChange={(e) => setEditedUser({ ...editedUser, whatsapp: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              ) : (
                <p className="text-sm py-2">{user?.whatsapp || 'Não informado'}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Telefone de Referência</label>
            {isEditing ? (
              <Input
                value={editedUser.referencePhone}
                onChange={(e) => setEditedUser({ ...editedUser, referencePhone: e.target.value })}
                placeholder="(11) 99999-9999 - Contato de emergência"
              />
            ) : (
              <p className="text-sm py-2">{user?.referencePhone || 'Não informado'}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cursos Concluídos */}
      {user?.type === 'freelancer' && completedCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Cursos Concluídos
            </CardTitle>
            <CardDescription>Certificações e cursos que você completou</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedCourses.map((course: any) => (
                <div key={course.id} className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{course.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{course.category}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Concluído em {new Date(course.completed_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      Certificado
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EditableProfile;
