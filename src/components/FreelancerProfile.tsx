
import React from 'react';
import { useAuth } from '@/components/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Star } from 'lucide-react';

const FreelancerProfile = () => {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meu Perfil</CardTitle>
        <CardDescription>Gerencie suas informações profissionais</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <Input value={user?.name || ''} disabled />
          </div>
          <div>
            <label className="text-sm font-medium">E-mail</label>
            <Input value={user?.email || ''} disabled />
          </div>
          <div>
            <label className="text-sm font-medium">Cidade</label>
            <Input value={user?.city || ''} disabled />
          </div>
          <div>
            <label className="text-sm font-medium">Avaliação</label>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span>{user?.rating || 'Ainda não avaliado'}</span>
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Habilidades</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {user?.skills?.map(skill => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            )) || <span className="text-gray-500">Nenhuma habilidade cadastrada</span>}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Descrição</label>
          <p className="text-gray-600 mt-1">{user?.description || 'Nenhuma descrição cadastrada'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerProfile;
