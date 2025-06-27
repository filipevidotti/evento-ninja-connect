
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
  Users,
  Search,
  ArrowLeft,
  Filter,
  Star,
  Clock
} from 'lucide-react';

const PublicEvents = () => {
  const navigate = useNavigate();
  const { city, role } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState(city || 'todas');
  const [selectedRole, setSelectedRole] = useState(role || 'todas');

  // Mock data otimizado para SEO - sem dados do contratante
  const mockEvents = [
    {
      id: 1,
      title: 'Festa Corporativa Tech Summit 2025',
      description: 'Grande evento corporativo com mais de 500 participantes no setor de tecnologia',
      location: 'Centro de Convenções Anhembi',
      city: 'sao-paulo',
      cityName: 'São Paulo',
      date: '2025-07-15',
      functions: [
        { id: 1, role: 'Garçom', quantity: 10, salary: '180', requirements: 'Experiência em eventos corporativos' },
        { id: 2, role: 'Operador de Caixa', quantity: 3, salary: '200', requirements: 'Conhecimento em sistemas de pagamento' },
        { id: 3, role: 'Segurança', quantity: 5, salary: '220', requirements: 'Curso de segurança patrimonial' }
      ]
    },
    {
      id: 2,
      title: 'Casamento Elegante Villa Bisutti',
      description: 'Cerimônia e festa de casamento em ambiente luxuoso para 200 convidados',
      location: 'Villa Bisutti',
      city: 'belo-horizonte',
      cityName: 'Belo Horizonte',
      date: '2025-08-22',
      functions: [
        { id: 1, role: 'Garçom', quantity: 8, salary: '160', requirements: 'Experiência em eventos sociais' },
        { id: 2, role: 'Churrasqueiro', quantity: 2, salary: '250', requirements: 'Especialização em churrasco gourmet' },
        { id: 3, role: 'Segurança', quantity: 2, salary: '180', requirements: 'Postura discreta para eventos sociais' }
      ]
    },
    {
      id: 3,
      title: 'Festival de Música Verão 2025',
      description: 'Festival ao ar livre com múltiplos artistas nacionais e internacionais',
      location: 'Parque Ibirapuera',
      city: 'sao-paulo',
      cityName: 'São Paulo', 
      date: '2025-09-10',
      functions: [
        { id: 1, role: 'Segurança', quantity: 15, salary: '200', requirements: 'Experiência em eventos de grande porte' },
        { id: 2, role: 'Operador de Caixa', quantity: 8, salary: '180', requirements: 'Agilidade no atendimento' },
        { id: 3, role: 'Limpeza', quantity: 10, salary: '140', requirements: 'Disponibilidade para trabalho noturno' }
      ]
    },
    {
      id: 4,
      title: 'Churrasco Corporativo Premium',
      description: 'Evento corporativo com churrasco premium e networking empresarial',
      location: 'Clube Country',
      city: 'belo-horizonte',
      cityName: 'Belo Horizonte',
      date: '2025-07-30',
      functions: [
        { id: 1, role: 'Churrasqueiro', quantity: 3, salary: '280', requirements: 'Especialização em cortes premium' },
        { id: 2, role: 'Garçom', quantity: 6, salary: '170', requirements: 'Experiência em eventos corporativos' }
      ]
    },
    {
      id: 5,
      title: 'Conferência Internacional de Negócios',
      description: 'Evento empresarial com palestrantes internacionais e networking',
      location: 'Centro de Convenções do Anhembi',
      city: 'rio-de-janeiro',
      cityName: 'Rio de Janeiro',
      date: '2025-08-15',
      functions: [
        { id: 1, role: 'Operador de Caixa', quantity: 5, salary: '190', requirements: 'Bilíngue preferencial' },
        { id: 2, role: 'Segurança', quantity: 8, salary: '210', requirements: 'Experiência em eventos corporativos' }
      ]
    },
    {
      id: 6,
      title: 'Festa de Formatura Medicina UFMG',
      description: 'Cerimônia de formatura e festa para turma de medicina',
      location: 'Hotel Ouro Minas',
      city: 'brasilia',
      cityName: 'Brasília',
      date: '2025-12-15',
      functions: [
        { id: 1, role: 'Garçom', quantity: 12, salary: '165', requirements: 'Experiência em eventos acadêmicos' },
        { id: 2, role: 'Limpeza', quantity: 4, salary: '130', requirements: 'Trabalho em equipe' }
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
    { value: 'operador-de-caixa', label: 'Operador de Caixa' },
    { value: 'limpeza', label: 'Limpeza' }
  ];

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'todas' || event.city === selectedCity;
    const matchesRole = selectedRole === 'todas' || event.functions.some(func => 
      func.role.toLowerCase().replace(/\s+/g, '-') === selectedRole
    );
    
    return matchesSearch && matchesCity && matchesRole;
  });

  const getPageTitle = () => {
    if (city && role) {
      const cityName = cities.find(c => c.value === city)?.label || city;
      const roleName = roles.find(r => r.value === role)?.label || role;
      return `Vagas de ${roleName} em ${cityName} - EventConnect`;
    } else if (city) {
      const cityName = cities.find(c => c.value === city)?.label || city;
      return `Eventos para Freelancers em ${cityName} - EventConnect`;
    } else if (role) {
      const roleName = roles.find(r => r.value === role)?.label || role;
      return `Vagas de ${roleName} - EventConnect`;
    }
    return 'Eventos e Oportunidades para Freelancers - EventConnect';
  };

  const getPageDescription = () => {
    if (city && role) {
      const cityName = cities.find(c => c.value === city)?.label || city;
      const roleName = roles.find(r => r.value === role)?.label || role;
      return `Encontre as melhores oportunidades de trabalho como ${roleName} em ${cityName}. Vagas em eventos corporativos, casamentos, festas e muito mais. Cadastre-se gratuitamente!`;
    } else if (city) {
      const cityName = cities.find(c => c.value === city)?.label || city;
      return `Descubra oportunidades de trabalho freelancer em eventos em ${cityName}. Vagas para garçons, seguranças, churrasqueiros, operadores de caixa e mais profissionais de eventos!`;
    }
    return 'Encontre as melhores oportunidades de trabalho freelancer em eventos pelo Brasil. Vagas em festas, casamentos, eventos corporativos e muito mais. Cadastre-se gratuitamente!';
  };

  const getTotalVacancies = () => {
    return filteredEvents.reduce((total, event) => 
      total + event.functions.reduce((eventTotal, func) => eventTotal + func.quantity, 0), 0
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags - seria implementado com React Helmet na aplicação real */}
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
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
            <Button onClick={() => navigate('/plans')} className="bg-gradient-to-r from-blue-600 to-purple-600">
              Ver Planos
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header - Otimizado para SEO */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-600">{getTotalVacancies()} vagas disponíveis</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-4xl">
            {getPageDescription()}
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Como Funciona</h3>
            </div>
            <p className="text-blue-700">
              <strong>1.</strong> Escolha um plano → <strong>2.</strong> Candidate-se às vagas → <strong>3.</strong> Seja aprovado → <strong>4.</strong> Trabalhe e ganhe dinheiro!
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Encontre a Vaga Ideal
            </CardTitle>
            <CardDescription>
              Use os filtros abaixo para encontrar as melhores oportunidades na sua cidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar eventos</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Ex: casamento, festa corporativa..."
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
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as cidades</SelectItem>
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
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as funções</SelectItem>
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

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''} • {getTotalVacancies()} vagas disponíveis
          </p>
          {(selectedCity !== 'todas' || selectedRole !== 'todas' || searchTerm) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedCity('todas');
                setSelectedRole('todas');
                setSearchTerm('');
              }}
            >
              Limpar Filtros
            </Button>
          )}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                <CardDescription className="line-clamp-2">{event.description}</CardDescription>
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
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Vagas Disponíveis:</h4>
                  {event.functions.map((func) => (
                    <div key={func.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{func.role}</span>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {func.quantity}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          <DollarSign className="w-4 h-4" />
                          R$ {func.salary}
                        </div>
                      </div>
                      {func.requirements && (
                        <p className="text-xs text-gray-500">{func.requirements}</p>
                      )}
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => navigate('/plans')}
                >
                  Ver Planos e Candidatar-se
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
              Tente ajustar os filtros de busca ou explore outras cidades e funções.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => {
                  setSelectedCity('todas');
                  setSelectedRole('todas');
                  setSearchTerm('');
                }}
                variant="outline"
              >
                Ver Todas as Oportunidades
              </Button>
              <br />
              <Button onClick={() => navigate('/plans')}>
                Ver Planos Disponíveis
              </Button>
            </div>
          </div>
        )}

        {/* CTA Section - Otimizada para conversão */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Pronto para Começar sua Carreira como Freelancer?
          </h2>
          <p className="text-xl mb-6 opacity-90 max-w-3xl mx-auto">
            Junte-se a mais de 500 freelancers ativos que já estão ganhando dinheiro com eventos. 
            Escolha seu plano e comece hoje mesmo!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg"
              onClick={() => navigate('/plans')}
            >
              Ver Planos Gratuitos
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg"
              onClick={() => navigate('/login')}
            >
              Fazer Login
            </Button>
          </div>
        </div>

        {/* SEO Footer Links */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-gray-200">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Vagas por Cidade</h3>
            <div className="space-y-2">
              {cities.map((city) => (
                <button
                  key={city.value}
                  onClick={() => navigate(`/eventos/${city.value}`)}
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  Eventos {city.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Vagas por Função</h3>
            <div className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => navigate(`/eventos/sao-paulo/${role.value}`)}
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  Vagas {role.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Mais Procurados</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/eventos/sao-paulo/garcom')}
                className="block text-blue-600 hover:text-blue-800 text-sm"
              >
                Garçom São Paulo
              </button>
              <button
                onClick={() => navigate('/eventos/belo-horizonte/churrasqueiro')}
                className="block text-blue-600 hover:text-blue-800 text-sm"
              >
                Churrasqueiro BH
              </button>
              <button
                onClick={() => navigate('/eventos/rio-de-janeiro/seguranca')}
                className="block text-blue-600 hover:text-blue-800 text-sm"
              >
                Segurança Rio de Janeiro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicEvents;
