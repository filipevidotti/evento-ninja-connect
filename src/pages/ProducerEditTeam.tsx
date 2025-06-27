
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users, Edit, Save, Trash2, ArrowLeft, UserMinus } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useTeams } from '@/hooks/useTeams';
import ProducerHeader from '@/components/ProducerHeader';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import { useToast } from '@/hooks/use-toast';

const ProducerEditTeam = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { teams, updateTeam, deleteTeam, getFavoritesByTeam, assignFreelancerToTeam } = useTeams();
  const { toast } = useToast();

  const team = teams.find(t => t.id === teamId);
  const teamMembers = teamId ? getFavoritesByTeam(teamId) : [];

  const [teamName, setTeamName] = useState(team?.name || '');
  const [teamDescription, setTeamDescription] = useState(team?.description || '');
  const [isEditing, setIsEditing] = useState(false);

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/producer/dashboard' },
    { label: 'Criar Equipe', path: '/producer/create-team' },
    { label: team?.name || 'Editar Equipe' }
  ];

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProducerHeader user={user} onLogout={logout} onCreateEvent={() => {}} />
        <div className="max-w-7xl mx-auto p-6">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Equipe não encontrada</h2>
              <p className="text-gray-600 mb-4">A equipe que você está procurando não existe.</p>
              <Button onClick={() => navigate('/producer/create-team')}>
                Voltar para Equipes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleSaveChanges = () => {
    if (!teamName.trim()) {
      toast({
        title: "Erro",
        description: "O nome da equipe é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    updateTeam(team.id, {
      name: teamName.trim(),
      description: teamDescription.trim()
    });

    toast({
      title: "Equipe atualizada!",
      description: "As informações da equipe foram salvas com sucesso."
    });

    setIsEditing(false);
  };

  const handleDeleteTeam = () => {
    deleteTeam(team.id);
    toast({
      title: "Equipe excluída!",
      description: "A equipe foi removida com sucesso."
    });
    navigate('/producer/create-team');
  };

  const handleRemoveMember = (freelancerId: string) => {
    assignFreelancerToTeam(freelancerId, undefined);
    toast({
      title: "Membro removido!",
      description: "O freelancer foi removido da equipe."
    });
  };

  const handleCreateEvent = () => {
    // Placeholder function
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProducerHeader user={user} onLogout={logout} onCreateEvent={handleCreateEvent} />
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/producer/create-team')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Users className="w-8 h-8 mr-3 text-blue-600" />
                {isEditing ? 'Editando Equipe' : team.name}
              </h1>
              <p className="text-gray-600 mt-1">
                {teamMembers.length} membro{teamMembers.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Equipe</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir a equipe "{team.name}"? 
                        Esta ação não pode ser desfeita. Os freelancers da equipe não serão excluídos, 
                        apenas removidos da equipe.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteTeam} className="bg-red-600 hover:bg-red-700">
                        Excluir Equipe
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setTeamName(team.name);
                  setTeamDescription(team.description || '');
                }}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveChanges}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Informações da Equipe */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Equipe</CardTitle>
            <CardDescription>
              {isEditing ? 'Edite as informações básicas da equipe' : 'Informações básicas da equipe'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="team-name">Nome da Equipe</Label>
              <Input
                id="team-name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                disabled={!isEditing}
                placeholder="Digite o nome da equipe"
              />
            </div>
            <div>
              <Label htmlFor="team-description">Descrição</Label>
              <Textarea
                id="team-description"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                disabled={!isEditing}
                placeholder="Descreva o propósito ou características desta equipe"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Criada em: {team.createdAt.toLocaleDateString('pt-BR')}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>ID: {team.id}</span>
            </div>
          </CardContent>
        </Card>

        {/* Membros da Equipe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Membros da Equipe ({teamMembers.length})</span>
              <Button variant="outline" onClick={() => navigate('/producer/favorites')}>
                Gerenciar Favoritos
              </Button>
            </CardTitle>
            <CardDescription>
              Freelancers atribuídos a esta equipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            {teamMembers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <h3 className="font-medium text-gray-900 mb-2">Nenhum membro na equipe</h3>
                <p className="mb-4">Adicione freelancers favoritos a esta equipe para começar.</p>
                <Button variant="outline" onClick={() => navigate('/producer/favorites')}>
                  Adicionar Membros
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.city}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {member.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Ver Perfil
                      </Button>
                      <Button variant="outline" size="sm">
                        Contatar
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover Membro</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover {member.name} desta equipe? 
                              O freelancer continuará na sua lista de favoritos.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemoveMember(member.id)}>
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProducerEditTeam;
