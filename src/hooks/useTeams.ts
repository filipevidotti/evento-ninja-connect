
import { useState, useEffect } from 'react';

export interface Team {
  id: string;
  name: string;
  description?: string;
  producerId: string;
  createdAt: Date;
  members?: string[]; // IDs dos freelancers na equipe
}

export interface FavoriteFreelancer {
  id: string;
  name: string;
  skills: string[];
  rating: number;
  city: string;
  avatar?: string;
  teamId?: string; // ID da equipe a qual pertence
}

// Mock teams data - in a real app this would come from a database
const mockTeams: Team[] = [];

// Mock favorite freelancers data
const mockFavorites: FavoriteFreelancer[] = [
  {
    id: '1',
    name: 'João Silva',
    skills: ['Garçom', 'Bartender'],
    rating: 4.8,
    city: 'São Paulo',
    teamId: undefined
  },
  {
    id: '2',
    name: 'Maria Santos',
    skills: ['Limpeza', 'Organização'],
    rating: 4.9,
    city: 'Rio de Janeiro',
    teamId: undefined
  },
  {
    id: '3',
    name: 'Pedro Costa',
    skills: ['Segurança', 'Portaria'],
    rating: 4.7,
    city: 'Belo Horizonte',
    teamId: undefined
  }
];

export const useTeams = (producerId?: string) => {
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [favoriteFreelancers, setFavoriteFreelancers] = useState<FavoriteFreelancer[]>(mockFavorites);

  const getTeamsByProducer = (producerId: string) => {
    return teams.filter(team => team.producerId === producerId);
  };

  const createTeam = (teamData: Omit<Team, 'id' | 'createdAt'>) => {
    const newTeam: Team = {
      ...teamData,
      id: Date.now().toString(),
      createdAt: new Date(),
      members: []
    };
    setTeams(prev => [...prev, newTeam]);
    return newTeam;
  };

  const updateTeam = (teamId: string, teamData: Partial<Team>) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId ? { ...team, ...teamData } : team
    ));
  };

  const deleteTeam = (teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
    // Remove team assignment from favorites
    setFavoriteFreelancers(prev => prev.map(freelancer => 
      freelancer.teamId === teamId ? { ...freelancer, teamId: undefined } : freelancer
    ));
  };

  const assignFreelancerToTeam = (freelancerId: string, teamId?: string) => {
    setFavoriteFreelancers(prev => prev.map(freelancer => 
      freelancer.id === freelancerId ? { ...freelancer, teamId } : freelancer
    ));
  };

  const getFavoritesByTeam = (teamId?: string) => {
    return favoriteFreelancers.filter(freelancer => freelancer.teamId === teamId);
  };

  const getUnassignedFavorites = () => {
    return favoriteFreelancers.filter(freelancer => !freelancer.teamId);
  };

  return {
    teams,
    favoriteFreelancers,
    getTeamsByProducer,
    createTeam,
    updateTeam,
    deleteTeam,
    assignFreelancerToTeam,
    getFavoritesByTeam,
    getUnassignedFavorites
  };
};
