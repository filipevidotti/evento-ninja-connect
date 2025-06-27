import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Briefcase, 
  Star, 
  MapPin, 
  Calendar, 
  DollarSign,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  UtensilsCrossed,
  ShieldCheck,
  Calculator,
  Sparkles,
  ChefHat,
  Camera,
  Music,
  Car
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: "Conexão Rápida",
      description: "Encontre profissionais qualificados ou oportunidades de trabalho em minutos"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Seguro e Confiável",
      description: "Sistema de avaliações e verificação de perfis para maior segurança"
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-600" />,
      title: "Sem Burocracia",
      description: "Processo simplificado de candidatura e aprovação de freelancers"
    }
  ];

  const jobOpportunities = [
    {
      title: "Garçom",
      description: "Serviço de mesa em eventos corporativos e sociais",
      icon: <UtensilsCrossed className="w-6 h-6" />,
      salary: "R$ 150-250",
      vacancies: "120+ vagas",
      slug: "garcom",
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Segurança",
      description: "Segurança patrimonial e controle de acesso",
      icon: <ShieldCheck className="w-6 h-6" />,
      salary: "R$ 180-300",
      vacancies: "80+ vagas",
      slug: "seguranca",
      gradient: "from-red-500 to-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Operador de Caixa",
      description: "Operação de caixa e atendimento ao cliente",
      icon: <Calculator className="w-6 h-6" />,
      salary: "R$ 160-220",
      vacancies: "45+ vagas",
      slug: "operador-de-caixa",
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Limpeza",
      description: "Limpeza e organização de espaços para eventos",
      icon: <Sparkles className="w-6 h-6" />,
      salary: "R$ 120-180",
      vacancies: "60+ vagas",
      slug: "limpeza",
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Churrasqueiro",
      description: "Preparo de churrasco e grelhados em eventos",
      icon: <ChefHat className="w-6 h-6" />,
      salary: "R$ 200-350",
      vacancies: "35+ vagas",
      slug: "churrasqueiro",
      gradient: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Fotógrafo",
      description: "Cobertura fotográfica de eventos sociais e corporativos",
      icon: <Camera className="w-6 h-6" />,
      salary: "R$ 300-600",
      vacancies: "25+ vagas",
      slug: "fotografo",
      gradient: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "DJ / Som",
      description: "Sonorização e animação musical para eventos",
      icon: <Music className="w-6 h-6" />,
      salary: "R$ 250-500",
      vacancies: "40+ vagas",
      slug: "dj-som",
      gradient: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      title: "Manobrista",
      description: "Serviços de estacionamento e manobrista",
      icon: <Car className="w-6 h-6" />,
      salary: "R$ 140-200",
      vacancies: "55+ vagas",
      slug: "manobrista",
      gradient: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50"
    }
  ];

  const mockEvents = [
    {
      title: "Festa Corporativa Tech Summit",
      location: "Centro de Convenções Anhembi",
      date: "15/07/2025",
      functions: ["Garçom", "Operador de Caixa"],
      salary: "R$ 150-200"
    },
    {
      title: "Casamento Marina & Carlos",
      location: "Villa Bisutti",
      date: "22/08/2025",
      functions: ["Garçom", "Segurança"],
      salary: "R$ 160-180"
    },
    {
      title: "Festival de Música Verão",
      location: "Parque Ibirapuera",
      date: "10/09/2025",
      functions: ["Segurança", "Operador de Caixa"],
      salary: "R$ 180-220"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EventConnect
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A plataforma que conecta <strong>freelancers qualificados</strong> com <strong>organizadores de eventos</strong> 
              de forma rápida, segura e sem burocracia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
                onClick={() => navigate('/login')}
              >
                <Users className="w-5 h-5 mr-2" />
                Sou Freelancer
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-6 text-lg"
                onClick={() => navigate('/login')}
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Sou Organizador
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Freelancers Ativos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">200+</div>
                <div className="text-gray-600">Eventos Realizados</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">4.8★</div>
                <div className="text-gray-600">Avaliação Média</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o EventConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uma plataforma completa que facilita a conexão entre talentos e oportunidades no mercado de eventos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Opportunities Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Oportunidades Disponíveis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Encontre as melhores vagas de trabalho freelancer em eventos pelo Brasil
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {jobOpportunities.map((job, index) => (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-white overflow-hidden h-full"
                onClick={() => navigate(`/eventos/sao-paulo/${job.slug}`)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto mb-4 p-4 ${job.bgColor} rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`bg-gradient-to-r ${job.gradient} bg-clip-text text-transparent`}>
                      {job.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </CardTitle>
                  <CardDescription className="text-sm min-h-[2.5rem] flex items-center justify-center">
                    {job.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-sm">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      {job.vacancies}
                    </div>
                  </div>
                  <Button 
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300"
                    variant="outline"
                    size="sm"
                  >
                    Ver Vagas
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-6 text-lg"
              onClick={() => navigate('/eventos')}
            >
              Ver Todas as Oportunidades
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como funciona?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Freelancers */}
            <Card className="border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-blue-600">Para Freelancers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium">Crie seu perfil</h4>
                    <p className="text-gray-600 text-sm">Cadastre suas habilidades e experiências</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium">Encontre eventos</h4>
                    <p className="text-gray-600 text-sm">Navegue pelas oportunidades disponíveis</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium">Candidate-se</h4>
                    <p className="text-gray-600 text-sm">Aplique para as funções que interessam</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-medium">Trabalhe e seja avaliado</h4>
                    <p className="text-gray-600 text-sm">Construa sua reputação na plataforma</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Organizers */}
            <Card className="border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                  <Briefcase className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-purple-600">Para Organizadores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium">Publique seu evento</h4>
                    <p className="text-gray-600 text-sm">Defina funções, salários e requisitos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium">Receba candidaturas</h4>
                    <p className="text-gray-600 text-sm">Profissionais se candidatam às suas vagas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium">Aprove freelancers</h4>
                    <p className="text-gray-600 text-sm">Escolha os melhores candidatos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-medium">Avalie a equipe</h4>
                    <p className="text-gray-600 text-sm">Deixe feedback para futuros contratantes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Eventos em Destaque
            </h2>
            <p className="text-xl text-gray-600">
              Veja algumas das oportunidades disponíveis agora
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockEvents.map((event, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    {event.salary}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.functions.map((func, funcIndex) => (
                      <Badge key={funcIndex} variant="secondary">{func}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => navigate('/eventos')}
            >
              Ver Todos os Eventos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se à nossa comunidade e transforme a forma como você trabalha com eventos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg"
              onClick={() => navigate('/login')}
            >
              <Users className="w-5 h-5 mr-2" />
              Cadastrar como Freelancer
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg"
              onClick={() => navigate('/login')}
            >
              <Briefcase className="w-5 h-5 mr-2" />
              Cadastrar como Organizador
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo and Description */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                EventConnect
              </h3>
              <p className="text-gray-400 mb-4">
                Conectando talentos aos melhores eventos do Brasil
              </p>
            </div>

            {/* Eventos por Cidade */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Eventos por Cidade</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => navigate('/eventos/sao-paulo')}
                    className="hover:text-white transition-colors"
                  >
                    Eventos São Paulo
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/eventos/belo-horizonte')}
                    className="hover:text-white transition-colors"
                  >
                    Eventos Belo Horizonte
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/eventos/rio-de-janeiro')}
                    className="hover:text-white transition-colors"
                  >
                    Eventos Rio de Janeiro
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/eventos/brasilia')}
                    className="hover:text-white transition-colors"
                  >
                    Eventos Brasília
                  </button>
                </li>
              </ul>
            </div>

            {/* Vagas por Função */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Vagas por Função</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => navigate('/eventos/sao-paulo/garcom')}
                    className="hover:text-white transition-colors"
                  >
                    Vagas Garçom São Paulo
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/eventos/belo-horizonte/churrasqueiro')}
                    className="hover:text-white transition-colors"
                  >
                    Vagas Churrasqueiro BH
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/eventos/sao-paulo/seguranca')}
                    className="hover:text-white transition-colors"
                  >
                    Vagas Segurança São Paulo
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/eventos/rio-de-janeiro/operador-de-caixa')}
                    className="hover:text-white transition-colors"
                  >
                    Vagas Caixa Rio de Janeiro
                  </button>
                </li>
              </ul>
            </div>

            {/* Links Úteis */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Links Úteis</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => navigate('/eventos')}
                    className="hover:text-white transition-colors"
                  >
                    Todos os Eventos
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/login')}
                    className="hover:text-white transition-colors"
                  >
                    Cadastro Freelancer
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/login')}
                    className="hover:text-white transition-colors"
                  >
                    Cadastro Organizador
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/plans')}
                    className="hover:text-white transition-colors"
                  >
                    Planos
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <div className="flex justify-center space-x-6 text-gray-400">
              <span>© 2025 EventConnect</span>
              <span>•</span>
              <span>Todos os direitos reservados</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
