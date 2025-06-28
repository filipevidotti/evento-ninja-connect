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
import FreelancerProfileModal from '@/components/FreelancerProfileModal';
import InviteFreelancerModal from '@/components/InviteFreelancerModal';
import CompareFreelancersModal from '@/components/CompareFreelancersModal';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const ProducerSearchFreelancers = () => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();

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

  // Modal states
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState<any>(null);

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
    
    const action = favorites.includes(freelancerId) ? 'removido dos' : 'adicionado aos';
    toast({
      title: "Favoritos atualizado",
      description: `Freelancer ${action} favoritos.`
    });
  };

  const toggleSelection = (freelancerId: string) => {
    setSelectedFreelancers(prev => 
      prev.includes(freelancerId) 
        ? prev.filter(id => id !== freelancerId)
        : [...prev, freelancerId]
    );
  };

  const handleViewProfile = (freelancer: any) => {
    setSelectedFreelancer(freelancer);
    setProfileModalOpen(true);
  };

  const handleInvite = (freelancerId: string) => {
    const freelancer = mockFreelancers.find(f => f.id === freelancerId);
    if (freelancer) {
      setSelectedFreelancer(freelancer);
      setInviteModalOpen(true);
    }
  };

  const handleSendInvite = (inviteData: any) => {
    toast({
      title: "Convite enviado!",
      description: `Convite enviado para ${selectedFreelancer?.name} com sucesso.`
    });
  };

  const handleCompare = () => {
    const freelancersToCompare = mockFreelancers.filter(f => 
      selectedFreelancers.includes(f.id)
    );
    setSelectedFreelancer(freelancersToCompare);
    setCompareModalOpen(true);
  };

  const FiltersContent = () => (
    <div className="space-y-4">
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
          onCheckedChange={(checked) => setAvailability(checked === true)}
        />
        <label htmlFor="availability" className="text-sm">
          Apenas disponíveis agora
        </label>
      </div>

      <Button className="w-full">Aplicar Filtros</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ProducerHeader user={user} onLogout={logout} onCreateEvent={() => {}} />
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {isMobile ? (
          // Mobile Layout
          <div className="space-y-4">
            {/* Mobile Filters */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Freelancers Disponíveis</h2>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filtros de Busca</SheetTitle>
                    <SheetDescription>
                      Refine sua busca por freelancers
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FiltersContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Selected Freelancers Card */}
            {selectedFreelancers.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Comparar Selecionados</CardTitle>
                  <CardDescription>{selectedFreelancers.length}/3 freelancers</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    className="w-full" 
                    size="sm"
                    disabled={selectedFreelancers.length < 2}
                    onClick={handleCompare}
                  >
                    Comparar
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            <div className="space-y-3">
              {mockFreelancers.map((freelancer) => (
                <Card key={freelancer.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox 
                            checked={selectedFreelancers.includes(freelancer.id)}
                            onCheckedChange={(checked) => {
                              if (checked === true) {
                                toggleSelection(freelancer.id);
                              } else if (checked === false) {
                                toggleSelection(freelancer.id);
                              }
                            }}
                            disabled={!selectedFreelancers.includes(freelancer.id) && selectedFreelancers.length >= 3}
                          />
                          
                          <Avatar className="w-12 h-12">
                            <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-base truncate">{freelancer.name}</h3>
                              {freelancer.available && (
                                <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                                  Disponível
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-3 text-xs text-gray-600 mb-2">
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{freelancer.rating}</span>
                                <span>({freelancer.reviewCount})</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{freelancer.city}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(freelancer.id)}
                          className={favorites.includes(freelancer.id) ? 'text-red-600' : ''}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(freelancer.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        {freelancer.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{freelancer.priceRange}</span>
                        <span className="text-xs text-gray-500">
                          {freelancer.completedEvents} eventos
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleViewProfile(freelancer)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Perfil
                        </Button>
                        
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleInvite(freelancer.id)}
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Convidar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Desktop Layout
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
                <CardContent>
                  <FiltersContent />
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
                      onClick={handleCompare}
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
                                onCheckedChange={(checked) => {
                                  if (checked === true) {
                                    toggleSelection(freelancer.id);
                                  } else if (checked === false) {
                                    toggleSelection(freelancer.id);
                                  }
                                }}
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
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewProfile(freelancer)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Ver Perfil
                              </Button>
                              
                              <Button 
                                size="sm"
                                onClick={() => handleInvite(freelancer.id)}
                              >
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
        )}
      </div>

      {/* Modals */}
      <FreelancerProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        freelancer={selectedFreelancer}
        onInvite={handleInvite}
        onToggleFavorite={toggleFavorite}
        isFavorite={selectedFreelancer ? favorites.includes(selectedFreelancer.id) : false}
      />

      <InviteFreelancerModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        freelancerName={selectedFreelancer?.name || ''}
        onSendInvite={handleSendInvite}
      />

      <CompareFreelancersModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        freelancers={Array.isArray(selectedFreelancer) ? selectedFreelancer : []}
        onInvite={handleInvite}
      />
    </div>
  );
};

export default ProducerSearchFreelancers;
