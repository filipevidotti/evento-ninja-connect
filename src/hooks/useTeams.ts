
import { useState, useEffect } from 'react';

export interface Team {
  id: string;
  name: string;
  description?: string;
  producerId: string;
  createdAt: Date;
}

// Mock teams data - in a real app this would come from a database
const mockTeams: Team[] = [];

export const useTeams = (producerId?: string) => {
  const [teams, setTeams] = useState<Team[]>(mockTeams);

  const getTeamsByProducer = (producerId: string) => {
    return teams.filter(team => team.producerId === producerId);
  };

  const createTeam = (teamData: Omit<Team, 'id' | 'createdAt'>) => {
    const newTeam: Team = {
      ...teamData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setTeams(prev => [...prev, newTeam]);
    return newTeam;
  };

  return {
    teams,
    getTeamsByProducer,
    createTeam
  };
};
