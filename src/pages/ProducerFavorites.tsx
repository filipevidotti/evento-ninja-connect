
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Heart, Users, Star, MapPin, Search, UserPlus } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useTeams } from '@/hooks/useTeams';
import ProducerHeader from '@/components/ProducerHeader';
import BreadcrumbNav from '@/components/BreadcrumbNav';

const ProducerFavorites = () => {
  const { user, logout } = useAuth();
  const { teams, favoriteFreelancers, getTeamsByProducer, getFavoritesByTeam, getUnassignedFavorites, assignFreelancerToTeam } = useTeams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/producer/dashboard' },
    { label: 'Freelancers Favoritos' }
  ];

  const userTeams = user ? getTeamsByProducer(user.id) : [];
  const unassignedFavorites = getUnassignedFavorites();

  const getFilteredFavorites = () => {
    let filtered = favoriteFreelancers;

    if (selectedTeamFilter === 'unassigned') {
      filtered = unassignedFavorites;
    } else if (selectedTeamFilter !== 'all') {
      filtered = getFavoritesByTeam(selectedTeamFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(freelancer =>
        freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freelancer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const handleAssignToTeam = (freelancerId: string, teamId?: string) => {
    assignFreelancerToTeam(freelancerId, teamId);
  };

  const handleCreateEvent = () => {
    // Placeholder function
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProducerHeader user={user} onLogout={logout} onCreateEvent={handleCreateEvent} />
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Heart className="w-8 h-8 mr-3 text-red-500" />
              Freelancers Favoritos
            </h1>
            <p className="text-gray-600 mt-1">Gerencie seus freelancers favoritos e organize por equipes</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {favoriteFreelancers.length} favoritos
          </Badge>
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome ou habilidade..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedTeamFilter} onValueChange={setSelectedTeamFilter}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Filtrar por equipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os favoritos</SelectItem>
                  <SelectItem value="unassigned">Sem equipe</SelectItem>
                  {userTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Freelancers não atribuídos */}
        {selectedTeamFilter === 'all' && unassignedFavorites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Sem Equipe ({unassignedFavorites.length})
              </CardTitle>
              <CardDescription>Freelancers favoritos que ainda não foram atribuídos a uma equipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unassignedFavorites.map((freelancer) => (
                  <Card key={freelancer.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900">{freelancer.name}</h3>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{freelancer.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{freelancer.city}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {freelancer.skills.slice(0, 2).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <Select onValueChange={(teamId) => handleAssignToTeam(freelancer.id, teamId)}>
                            <SelectTrigger className="w-full mt-3" size="sm">
                              <SelectValue placeholder="Atribuir à equipe" />
                            </SelectTrigger>
                            <SelectContent>
                              {userTeams.map((team) => (
                                <SelectItem key={team.id} value={team.id}>
                                  {team.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Freelancers por Equipe */}
        {userTeams.map((team) => {
          const teamMembers = getFavoritesByTeam(team.id);
          
          if (selectedTeamFilter !== 'all' && selectedTeamFilter !== team.id) return null;
          if (teamMembers.length === 0 && selectedTeamFilter === 'all') return null;

          return (
            <Card key={team.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    {team.name} ({teamMembers.length})
                  </div>
                  <Button variant="outline" size="sm">
                    Gerenciar Equipe
                  </Button>
                </CardTitle>
                {team.description && (
                  <CardDescription>{team.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {teamMembers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Nenhum freelancer atribuído a esta equipe</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamMembers.map((freelancer) => (
                      <Card key={freelancer.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <Avatar>
                              <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900">{freelancer.name}</h3>
                              <div className="flex items-center space-x-1 mt-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">{freelancer.rating}</span>
                              </div>
                              <div className="flex items-center space-x-1 mt-1">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{freelancer.city}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {freelancer.skills.slice(0, 2).map((skill) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex space-x-2 mt-3">
                                <Button variant="outline" size="sm" className="flex-1">
                                  Contatar
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleAssignToTeam(freelancer.id, undefined)}
                                >
                                  Remover
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Todos os Favoritos quando filtro está em "all" */}
        {selectedTeamFilter === 'all' && (
          <Card>
            <CardHeader>
              <CardTitle>Todos os Freelancers Favoritos</CardTitle>
              <CardDescription>Lista completa de seus freelancers favoritos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredFavorites().map((freelancer) => (
                  <Card key={freelancer.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900">{freelancer.name}</h3>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{freelancer.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{freelancer.city}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {freelancer.skills.slice(0, 2).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          {freelancer.teamId && (
                            <Badge className="mt-2 text-xs">
                              {userTeams.find(t => t.id === freelancer.teamId)?.name || 'Equipe'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProducerFavorites;
