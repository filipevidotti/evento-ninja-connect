
import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, MapPin, Clock, Heart, UserPlus, Eye, Filter, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProducerHeader from '@/components/ProducerHeader';

interface Freelancer {
  id: string;
  name: string;
  city: string;
  rating: number;
  specializations: string[];
  price: string;
  lastActivity: string;
  avatar?: string;
  available: boolean;
}

const mockFreelancers: Freelancer[] = [
  {
    id: '1',
    name: 'Ana Silva',
    city: 'São Paulo',
    rating: 4.8,
    specializations: ['Fotografia', 'Edição'],
    price: 'R$ 300-500/dia',
    lastActivity: '2 horas atrás',
    available: true
  },
  {
    id: '2',
    name: 'Carlos Santos',
    city: 'Rio de Janeiro',
    rating: 4.6,
    specializations: ['Som', 'Iluminação'],
    price: 'R$ 400-600/dia',
    lastActivity: '1 dia atrás',
    available: true
  },
  {
    id: '3',
    name: 'Marina Costa',
    city: 'Belo Horizonte',
    rating: 4.9,
    specializations: ['Coordenação', 'Produção'],
    price: 'R$ 500-800/dia',
    lastActivity: '3 horas atrás',
    available: false
  }
];

const ProducerSearchFreelancers = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    specialization: '',
    minRating: '',
    priceRange: '',
    availability: ''
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<{[key: string]: string}>({});

  const handleInvite = (freelancerId: string) => {
    toast({
      title: "Convite enviado!",
      description: "O freelancer foi convidado para seu evento."
    });
  };

  const handleFavorite = (freelancerId: string, team?: string) => {
    const favoriteKey = team ? `${freelancerId}_${team}` : freelancerId;
    setFavorites(prev => 
      prev.includes(favoriteKey) 
        ? prev.filter(id => id !== favoriteKey)
        : [...prev, favoriteKey]
    );
    
    if (team) {
      setSelectedTeam(prev => ({ ...prev, [freelancerId]: team }));
    }
    
    toast({
      title: team ? `Adicionado à equipe ${team}!` : "Adicionado aos favoritos!",
      description: "Freelancer salvo com sucesso."
    });
  };

  const filteredFreelancers = mockFreelancers.filter(freelancer => {
    const matchesSearch = freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         freelancer.specializations.some(spec => 
                           spec.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCity = !filters.city || freelancer.city === filters.city;
    const matchesSpecialization = !filters.specialization || 
                                 freelancer.specializations.includes(filters.specialization);
    const matchesRating = !filters.minRating || freelancer.rating >= parseFloat(filters.minRating);
    const matchesAvailability = !filters.availability || 
                               (filters.availability === 'available' && freelancer.available) ||
                               (filters.availability === 'unavailable' && !freelancer.available);
    
    return matchesSearch && matchesCity && matchesSpecialization && matchesRating && matchesAvailability;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <ProducerHeader 
        user={user} 
        onLogout={logout} 
        onCreateEvent={() => {}} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Buscar Freelancers</h1>
          <p className="text-gray-600">Encontre os melhores profissionais para seu evento</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filtros Laterais */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="search">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Nome ou especialização..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <Label>Cidade</Label>
                  <Select value={filters.city} onValueChange={(value) => setFilters({...filters, city: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as cidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as cidades</SelectItem>
                      <SelectItem value="São Paulo">São Paulo</SelectItem>
                      <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                      <SelectItem value="Belo Horizonte">Belo Horizonte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Especialização</Label>
                  <Select value={filters.specialization} onValueChange={(value) => setFilters({...filters, specialization: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as funções" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as funções</SelectItem>
                      <SelectItem value="Fotografia">Fotografia</SelectItem>
                      <SelectItem value="Som">Som</SelectItem>
                      <SelectItem value="Iluminação">Iluminação</SelectItem>
                      <SelectItem value="Coordenação">Coordenação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Avaliação Mínima</Label>
                  <Select value={filters.minRating} onValueChange={(value) => setFilters({...filters, minRating: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Qualquer avaliação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Qualquer avaliação</SelectItem>
                      <SelectItem value="4">4+ estrelas</SelectItem>
                      <SelectItem value="4.5">4.5+ estrelas</SelectItem>
                      <SelectItem value="4.8">4.8+ estrelas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Disponibilidade</Label>
                  <Select value={filters.availability} onValueChange={(value) => setFilters({...filters, availability: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="available">Disponível</SelectItem>
                      <SelectItem value="unavailable">Indisponível</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="w-full">
                  Salvar Filtros
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Resultados */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">{filteredFreelancers.length} freelancers encontrados</p>
              <Button variant="outline">
                Exportar Lista
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredFreelancers.map((freelancer) => (
                <Card key={freelancer.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{freelancer.name}</h3>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{freelancer.city}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{freelancer.rating}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {freelancer.specializations.map((spec) => (
                          <Badge key={spec} variant="secondary">{spec}</Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{freelancer.price}</p>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{freelancer.lastActivity}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Perfil
                        </Button>
                        <Button size="sm" onClick={() => handleInvite(freelancer.id)}>
                          <UserPlus className="w-4 h-4 mr-1" />
                          Convidar
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Select 
                          value={selectedTeam[freelancer.id] || ""} 
                          onValueChange={(value) => handleFavorite(freelancer.id, value)}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue placeholder="Equipe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="limpeza">Limpeza</SelectItem>
                            <SelectItem value="caixas">Caixas</SelectItem>
                            <SelectItem value="bar">Bar</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleFavorite(freelancer.id)}
                          className={favorites.includes(freelancer.id) ? "text-red-500" : ""}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(freelancer.id) ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerSearchFreelancers;
