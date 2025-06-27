import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Search, Filter, Heart, Eye, UserPlus, Star, MapPin, Clock } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import ProducerHeader from '@/components/ProducerHeader';
import BreadcrumbNav from '@/components/BreadcrumbNav';

const ProducerSearchFreelancers = () => {
  const { user, logout } = useAuth();

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/producer/dashboard' },
    { label: 'Buscar Freelancers' }
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('');
  const [minRating, setMinRating] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [availability, setAvailability] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedFreelancers, setSelectedFreelancers] = useState<string[]>([]);

  const mockFreelancers = [
    {
      id: '1',
      name: 'João Silva',
      avatar: '',
      rating: 4.8,
      reviewCount: 45,
      skills: ['Garçom', 'Bartender'],
      city: 'São Paulo',
      lastActive: '2 horas atrás',
      priceRange: 'R$ 150-200/dia',
      available: true,
      completedEvents: 32
    },
    {
      id: '2',
      name: 'Maria Santos',
      avatar: '',
      rating: 4.9,
      reviewCount: 67,
      skills: ['Limpeza', 'Organização'],
      city: 'Rio de Janeiro',
      lastActive: '1 dia atrás',
      priceRange: 'R$ 120-180/dia',
      available: true,
      completedEvents: 58
    },
    {
      id: '3',
      name: 'Pedro Costa',
      avatar: '',
      rating: 4.6,
      reviewCount: 23,
      skills: ['Segurança', 'Recepção'],
      city: 'Belo Horizonte',
      lastActive: '3 horas atrás',
      priceRange: 'R$ 200-250/dia',
      available: false,
      completedEvents: 19
    }
  ];

  const toggleFavorite = (freelancerId: string) => {
    setFavorites(prev => 
      prev.includes(freelancerId) 
        ? prev.filter(id => id !== freelancerId)
        : [...prev, freelancerId]
    );
  };

  const toggleSelection = (freelancerId: string) => {
    setSelectedFreelancers(prev => 
      prev.includes(freelancerId) 
        ? prev.filter(id => id !== freelancerId)
        : [...prev, freelancerId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProducerHeader user={user} onLogout={logout} onCreateEvent={() => {}} />
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6">
          {/* Sidebar with Filters */}
          <div className="w-80 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filtros</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Buscar por nome</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input 
                      placeholder="Nome do freelancer..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium mb-2 block">Cidade</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sao-paulo">São Paulo</SelectItem>
                      <SelectItem value="rio-janeiro">Rio de Janeiro</SelectItem>
                      <SelectItem value="belo-horizonte">Belo Horizonte</SelectItem>
                      <SelectItem value="brasilia">Brasília</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Função</label>
                  <Select value={selectedFunction} onValueChange={setSelectedFunction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="garcom">Garçom</SelectItem>
                      <SelectItem value="limpeza">Limpeza</SelectItem>
                      <SelectItem value="seguranca">Segurança</SelectItem>
                      <SelectItem value="bartender">Bartender</SelectItem>
                      <SelectItem value="recepcao">Recepção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Avaliação mínima</label>
                  <Select value={minRating} onValueChange={setMinRating}>
                    <SelectTrigger>
                      <SelectValue placeholder="Qualquer avaliação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4.5">4.5+ estrelas</SelectItem>
                      <SelectItem value="4.0">4.0+ estrelas</SelectItem>
                      <SelectItem value="3.5">3.5+ estrelas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Faixa de preço (por dia)</label>
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                    />
                    <Input 
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="availability"
                    checked={availability}
                    onCheckedChange={setAvailability}
                  />
                  <label htmlFor="availability" className="text-sm">
                    Apenas disponíveis agora
                  </label>
                </div>

                <Button className="w-full">Aplicar Filtros</Button>
              </CardContent>
            </Card>

            {selectedFreelancers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Comparar Selecionados</CardTitle>
                  <CardDescription>{selectedFreelancers.length}/3 freelancers</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    disabled={selectedFreelancers.length < 2}
                  >
                    Comparar
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Freelancers Disponíveis</CardTitle>
                    <CardDescription>{mockFreelancers.length} freelancers encontrados</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Exportar Lista
                    </Button>
                    <Button variant="outline" size="sm">
                      Salvar Busca
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {mockFreelancers.map((freelancer) => (
                    <Card key={freelancer.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Checkbox 
                              checked={selectedFreelancers.includes(freelancer.id)}
                              onCheckedChange={() => toggleSelection(freelancer.id)}
                              disabled={!selectedFreelancers.includes(freelancer.id) && selectedFreelancers.length >= 3}
                            />
                            
                            <Avatar className="w-16 h-16">
                              <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-lg">{freelancer.name}</h3>
                                {freelancer.available && (
                                  <Badge variant="default" className="bg-green-100 text-green-800">
                                    Disponível
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span>{freelancer.rating}</span>
                                  <span>({freelancer.reviewCount})</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{freelancer.city}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{freelancer.lastActive}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2 mb-2">
                                {freelancer.skills.map((skill) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{freelancer.priceRange}</span>
                                <span className="text-xs text-gray-500">
                                  {freelancer.completedEvents} eventos concluídos
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(freelancer.id)}
                              className={favorites.includes(freelancer.id) ? 'text-red-600' : ''}
                            >
                              <Heart className={`w-4 h-4 ${favorites.includes(freelancer.id) ? 'fill-current' : ''}`} />
                            </Button>
                            
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Ver Perfil
                            </Button>
                            
                            <Button size="sm">
                              <UserPlus className="w-4 h-4 mr-1" />
                              Convidar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerSearchFreelancers;
