
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  User, 
  Users,
  Search,
  ArrowLeft,
  Filter
} from 'lucide-react';

const PublicEvents = () => {
  const navigate = useNavigate();
  const { city, role } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState(city || '');
  const [selectedRole, setSelectedRole] = useState(role || '');

  // Mock data - em uma aplicação real, isso viria de uma API
  const mockEvents = [
    {
      id: 1,
      title: 'Festa Corporativa Tech Summit',
      description: 'Grande evento corporativo com mais de 500 participantes',
      location: 'Centro de Convenções Anhembi',
      city: 'sao-paulo',
      cityName: 'São Paulo',
      date: '2025-07-15',
      producerName: 'Empresa Tech',
      functions: [
        { id: 1, role: 'Garçom', quantity: 10, salary: '180' },
        { id: 2, role: 'Operador de Caixa', quantity: 3, salary: '200' },
        { id: 3, role: 'Segurança', quantity: 5, salary: '220' }
      ]
    },
    {
      id: 2,
      title: 'Casamento Marina & Carlos',
      description: 'Cerimônia e festa de casamento elegante',
      location: 'Villa Bisutti',
      city: 'belo-horizonte',
      cityName: 'Belo Horizonte',
      date: '2025-08-22',
      producerName: 'Marina Silva',
      functions: [
        { id: 1, role: 'Garçom', quantity: 8, salary: '160' },
        { id: 2, role: 'Churrasqueiro', quantity: 2, salary: '250' },
        { id: 3, role: 'Segurança', quantity: 2, salary: '180' }
      ]
    },
    {
      id: 3,
      title: 'Festival de Música Verão',
      description: 'Festival ao ar livre com múltiplos artistas',
      location: 'Parque Ibirapuera',
      city: 'sao-paulo',
      cityName: 'São Paulo',
      date: '2025-09-10',
      producerName: 'Produtora Musical',
      functions: [
        { id: 1, role: 'Segurança', quantity: 15, salary: '200' },
        { id: 2, role: 'Operador de Caixa', quantity: 8, salary: '180' },
        { id: 3, role: 'Churrasqueiro', quantity: 4, salary: '220' }
      ]
    },
    {
      id: 4,
      title: 'Churrasco Corporativo',
      description: 'Evento corporativo com churrasco premium',
      location: 'Clube Country',
      city: 'belo-horizonte',
      cityName: 'Belo Horizonte',
      date: '2025-07-30',
      producerName: 'Empresa BH',
      functions: [
        { id: 1, role: 'Churrasqueiro', quantity: 3, salary: '280' },
        { id: 2, role: 'Garçom', quantity: 6, salary: '170' }
      ]
    }
  ];

  const cities = [
    { value: 'sao-paulo', label: 'São Paulo' },
    { value: 'belo-horizonte', label: 'Belo Horizonte' },
    { value: 'rio-de-janeiro', label: 'Rio de Janeiro' },
    { value: 'brasilia', label: 'Brasília' }
  ];

  const roles = [
    { value: 'garcom', label: 'Garçom' },
    { value: 'churrasqueiro', label: 'Churrasqueiro' },
    { value: 'seguranca', label: 'Segurança' },
    { value: 'operador-de-caixa', label: 'Operador de Caixa' }
  ];

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || event.city === selectedCity;
    const matchesRole = !selectedRole || event.functions.some(func => 
      func.role.toLowerCase().replace(/\s+/g, '-') === selectedRole
    );
    
    return matchesSearch && matchesCity && matchesRole;
  });

  const getPageTitle = () => {
    if (city && role) {
      const cityName = cities.find(c => c.value === city)?.label || city;
      const roleName = roles.find(r => r.value === role)?.label || role;
      return `Vagas de ${roleName} em ${cityName}`;
    } else if (city) {
      const cityName = cities.find(c => c.value === city)?.label || city;
      return `Eventos para Freelancers em ${cityName}`;
    } else if (role) {
      const roleName = roles.find(r => r.value === role)?.label || role;
      return `Vagas de ${roleName}`;
    }
    return 'Todos os Eventos Disponíveis';
  };

  const getPageDescription = () => {
    if (city && role) {
      const cityName = cities.find(c => c.value === city)?.label || city;
      const roleName = roles.find(r => r.value === role)?.label || role;
      return `Encontre as melhores oportunidades de trabalho como ${roleName} em ${cityName}. Cadastre-se gratuitamente e candidate-se já!`;
    } else if (city) {
      const cityName = cities.find(c => c.value === city)?.label || city;
      return `Descubra oportunidades de trabalho freelancer em eventos em ${cityName}. Vagas disponíveis para garçons, seguranças, churrasqueiros e mais!`;
    }
    return 'Encontre as melhores oportunidades de trabalho freelancer em eventos pelo Brasil. Cadastre-se gratuitamente!';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar para Home</span>
              </Button>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EventConnect
              </div>
            </div>
            <Button onClick={() => navigate('/login')}>
              Entrar / Cadastrar
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {getPageDescription()}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              <strong>Quer se candidatar?</strong> Faça seu cadastro gratuito no EventConnect e tenha acesso a centenas de oportunidades!
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros de Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar eventos</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Digite o nome do evento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cidade</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as cidades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as cidades</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city.value} value={city.value}>
                        {city.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Função</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as funções" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as funções</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.location}, {event.cityName}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {event.producerName}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Vagas Disponíveis:</h4>
                  {event.functions.map((func) => (
                    <div key={func.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{func.role}</span>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {func.quantity}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 font-medium mt-1">
                          <DollarSign className="w-4 h-4" />
                          R$ {func.salary}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Candidatar-se às Vagas
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nenhum evento encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros de busca ou volte mais tarde para ver novos eventos.
            </p>
            <Button onClick={() => navigate('/login')}>
              Cadastre-se para ser notificado
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Pronto para começar sua jornada como freelancer?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Cadastre-se gratuitamente e tenha acesso a centenas de oportunidades de trabalho em eventos!
          </p>
          <Button 
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => navigate('/login')}
          >
            Cadastrar Gratuitamente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublicEvents;
