
import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Edit2, Save, Cancel } from 'lucide-react';
import { toast } from 'sonner';

const AVAILABLE_SKILLS = [
  'Garçom',
  'Limpeza', 
  'Segurança',
  'Operador de Caixa',
  'Recepcionista',
  'Word',
  'Excel',
  'PowerPoint',
  'Treinamento em defesa pessoal',
  'Primeiros socorros',
  'Barista',
  'Cozinheiro',
  'DJ',
  'Fotografia',
  'Decoração'
];

const EditableProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    city: user?.city || '',
    phone: user?.phone || '',
    description: user?.description || '',
    skills: user?.skills || []
  });
  const [newSkill, setNewSkill] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const success = await updateUser(editData);
    
    if (success) {
      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } else {
      toast.error('Erro ao atualizar perfil');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      city: user?.city || '',
      phone: user?.phone || '',
      description: user?.description || '',
      skills: user?.skills || []
    });
    setIsEditing(false);
  };

  const addSkill = (skill: string) => {
    if (skill && !editData.skills.includes(skill)) {
      setEditData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
    setNewSkill('');
    setCustomSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Meu Perfil</CardTitle>
          <CardDescription>
            {isEditing ? 'Edite suas informações profissionais' : 'Suas informações profissionais'}
          </CardDescription>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            <Edit2 className="w-4 h-4 mr-2" />
            Editar
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <Cancel className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            {isEditing ? (
              <Input
                id="name"
                value={editData.name}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Seu nome completo"
              />
            ) : (
              <Input value={user?.name || ''} disabled />
            )}
          </div>
          
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input value={user?.email || ''} disabled />
          </div>
          
          <div>
            <Label htmlFor="city">Cidade</Label>
            {isEditing ? (
              <Input
                id="city"
                value={editData.city}
                onChange={(e) => setEditData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Sua cidade"
              />
            ) : (
              <Input value={user?.city || ''} disabled />
            )}
          </div>
          
          <div>
            <Label htmlFor="phone">Telefone</Label>
            {isEditing ? (
              <Input
                id="phone"
                value={editData.phone}
                onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            ) : (
              <Input value={user?.phone || ''} disabled />
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          {isEditing ? (
            <Textarea
              id="description"
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Conte um pouco sobre sua experiência profissional..."
              rows={3}
            />
          ) : (
            <Textarea value={user?.description || 'Nenhuma descrição cadastrada'} disabled rows={3} />
          )}
        </div>

        <div>
          <Label>Habilidades</Label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {editData.skills.map(skill => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  {isEditing && (
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeSkill(skill)}
                    />
                  )}
                </Badge>
              ))}
              {editData.skills.length === 0 && (
                <span className="text-gray-500 text-sm">Nenhuma habilidade cadastrada</span>
              )}
            </div>
            
            {isEditing && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Select value={newSkill} onValueChange={setNewSkill}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecione uma habilidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_SKILLS.filter(skill => !editData.skills.includes(skill)).map(skill => (
                        <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => addSkill(newSkill)} 
                    disabled={!newSkill}
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    placeholder="Ou digite uma habilidade personalizada"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSkill(customSkill);
                      }
                    }}
                  />
                  <Button 
                    onClick={() => addSkill(customSkill)} 
                    disabled={!customSkill}
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {user?.type === 'freelancer' && user?.rating !== undefined && (
          <div>
            <Label>Avaliação</Label>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    className={`text-lg ${star <= user.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {user.rating.toFixed(1)} ({user.rating > 0 ? 'Avaliado' : 'Ainda não avaliado'})
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EditableProfile;
