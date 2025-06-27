import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

export interface EventFunction {
  id: string;
  cargo: string;
  quantidade: number;
  valor: number;
  requirements?: string;
}

export interface Event {
  id: string;
  name: string;
  descricao: string;
  data: string;
  local: string;
  produtor_id: string;
  producer_name: string;
  functions: EventFunction[];
  status: 'open' | 'closed' | 'completed';
  created_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  function_id: string;
  status: 'pendente' | 'aprovado' | 'recusado';
  applied_at: string;
  user_name?: string;
  user_email?: string;
  event_name?: string;
  function_cargo?: string;
}

interface EventContextType {
  events: Event[];
  applications: Application[];
  loading: boolean;
  createEvent: (event: Omit<Event, 'id' | 'created_at' | 'producer_name' | 'functions'> & { functions: Omit<EventFunction, 'id'>[] }) => Promise<boolean>;
  applyToEvent: (functionId: string) => Promise<boolean>;
  updateApplicationStatus: (applicationId: string, status: 'aprovado' | 'recusado') => Promise<boolean>;
  getEventsByProducer: (producerId: string) => Event[];
  getApplicationsByUser: (userId: string) => Application[];
  getApplicationsByEvent: (eventId: string) => Application[];
  refreshEvents: () => Promise<void>;
  refreshApplications: () => Promise<void>;
}

const EventContext = createContext<EventContextType | null>(null);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

// Dados mockados com informações mais realistas
const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Rock in Rio 2024',
    descricao: 'O maior festival de música do Brasil. 7 dias de shows com artistas nacionais e internacionais. Mais de 100.000 pessoas por dia.',
    data: '2024-09-15',
    local: 'Cidade do Rock, Barra da Tijuca - Rio de Janeiro, RJ',
    produtor_id: '2',
    producer_name: 'Rock World Produções',
    status: 'open',
    created_at: '2024-06-27',
    functions: [
      {
        id: '1',
        cargo: 'Fotógrafo Oficial',
        quantidade: 5,
        valor: 1200,
        requirements: 'Portfolio em eventos musicais, equipamento profissional Canon/Nikon, experiência mínima 3 anos'
      },
      {
        id: '2',
        cargo: 'Cinegrafista Drone',
        quantidade: 3,
        valor: 1800,
        requirements: 'Licença ANAC, drone DJI Mavic Pro ou superior, seguro de equipamento'
      },
      {
        id: '3',
        cargo: 'Segurança VIP',
        quantidade: 20,
        valor: 450,
        requirements: 'Curso de vigilante atualizado, experiência em grandes eventos, porte físico'
      }
    ]
  },
  {
    id: '2',
    name: 'Casamento Fernanda & Ricardo',
    descricao: 'Cerimônia religiosa e festa de casamento de luxo. Evento para 300 convidados em local premium com decoração sofisticada.',
    data: '2024-08-22',
    local: 'Casa Fasano, Jardim Europa - São Paulo, SP',
    produtor_id: '2',
    producer_name: 'Elegance Eventos',
    status: 'open',
    created_at: '2024-06-25',
    functions: [
      {
        id: '4',
        cargo: 'Fotógrafo de Casamento',
        quantidade: 2,
        valor: 2500,
        requirements: 'Portfolio especializado em casamentos, equipamento completo, edição inclusa'
      },
      {
        id: '5',
        cargo: 'Garçom Especializado',
        quantidade: 12,
        valor: 380,
        requirements: 'Uniforme próprio, experiência em eventos de luxo, francês ou inglês básico'
      },
      {
        id: '6',
        cargo: 'Bartender Premium',
        quantidade: 3,
        valor: 650,
        requirements: 'Conhecimento em mixologia, drinks autorais, apresentação impecável'
      }
    ]
  },
  {
    id: '3',
    name: 'Summit Tech Brasil 2024',
    descricao: 'Maior conferência de tecnologia do país. 2 dias de palestras, networking e inovação com líderes do setor tech.',
    data: '2024-10-10',
    local: 'Expo Center Norte - São Paulo, SP',
    produtor_id: '2',
    producer_name: 'TechEvents Pro',
    status: 'open',
    created_at: '2024-06-20',
    functions: [
      {
        id: '7',
        cargo: 'Recepcionista Bilíngue',
        quantidade: 8,
        valor: 320,
        requirements: 'Inglês fluente, experiência em eventos corporativos, boa comunicação'
      },
      {
        id: '8',
        cargo: 'Técnico Audiovisual',
        quantidade: 6,
        valor: 850,
        requirements: 'Conhecimento em mesa de som digital, projeção 4K, troubleshooting'
      }
    ]
  },
  {
    id: '4',
    name: 'Festa Reveillon Copacabana',
    descricao: 'Festa privada de Reveillon com vista para os fogos de Copacabana. Evento exclusivo para 500 convidados VIP.',
    data: '2024-12-31',
    local: 'Copacabana Palace Hotel - Rio de Janeiro, RJ',
    produtor_id: '2',
    producer_name: 'Celebration Events',
    status: 'open',
    created_at: '2024-06-15',
    functions: [
      {
        id: '9',
        cargo: 'DJ Profissional',
        quantidade: 2,
        valor: 2200,
        requirements: 'Equipamento próprio Pioneer, repertório amplo, experiência em festas de luxo'
      },
      {
        id: '10',
        cargo: 'Bartender Premium',
        quantidade: 4,
        valor: 520,
        requirements: 'Drinks premium, champagne service, uniforme fornecido'
      }
    ]
  },
  {
    id: '5',
    name: 'Fashion Week São Paulo',
    descricao: 'Semana de moda com desfiles de grandes estilistas brasileiros. Evento para imprensa, compradores e influenciadores.',
    data: '2024-11-05',
    local: 'Memorial da América Latina - São Paulo, SP',
    produtor_id: '2',
    producer_name: 'Fashion Events',
    status: 'open',
    created_at: '2024-06-22',
    functions: [
      {
        id: '11',
        cargo: 'Fotógrafo de Moda',
        quantidade: 4,
        valor: 1500,
        requirements: 'Portfolio fashion, equipamento profissional, entrega em 24h'
      },
      {
        id: '12',
        cargo: 'Produtor de Backstage',
        quantidade: 6,
        valor: 600,
        requirements: 'Experiência em desfiles, organização, trabalho sob pressão'
      }
    ]
  },
  {
    id: '6',
    name: 'Festival Gastronômico Campos do Jordão',
    descricao: 'Festival de inverno com os melhores chefs do Brasil. Food trucks, degustações e shows ao vivo durante 4 dias.',
    data: '2024-07-28',
    local: 'Capivari, Campos do Jordão - SP',
    produtor_id: '2',
    producer_name: 'Gourmet Productions',
    status: 'open',
    created_at: '2024-06-18',
    functions: [
      {
        id: '13',
        cargo: 'Garçom de Festival',
        quantidade: 25,
        valor: 340,
        requirements: 'Experiência em atendimento, agilidade, trabalho em equipe'
      },
      {
        id: '14',
        cargo: 'Auxiliar de Limpeza',
        quantidade: 15,
        valor: 220,
        requirements: 'Disponibilidade integral, trabalho noturno incluso'
      },
      {
        id: '15',
        cargo: 'Operador de Caixa',
        quantidade: 12,
        valor: 280,
        requirements: 'Experiência com PDV, matemática básica, honestidade comprovada'
      }
    ]
  }
];

// Candidaturas com mais detalhes
const mockApplications: Application[] = [
  {
    id: '1',
    user_id: 'freelancer1',
    function_id: '1',
    status: 'pendente',
    applied_at: '2024-06-28T10:30:00Z',
    user_name: 'Carlos Fotografo',
    user_email: 'carlos@email.com',
    event_name: 'Rock in Rio 2024',
    function_cargo: 'Fotógrafo Oficial'
  },
  {
    id: '2',
    user_id: 'freelancer1',
    function_id: '4',
    status: 'aprovado',
    applied_at: '2024-06-27T15:20:00Z',
    user_name: 'Carlos Fotografo',
    user_email: 'carlos@email.com',
    event_name: 'Casamento Fernanda & Ricardo',
    function_cargo: 'Fotógrafo de Casamento'
  },
  {
    id: '3',
    user_id: 'freelancer1',
    function_id: '7',
    status: 'recusado',
    applied_at: '2024-06-26T09:15:00Z',
    user_name: 'Carlos Fotografo',
    user_email: 'carlos@email.com',
    event_name: 'Summit Tech Brasil 2024',
    function_cargo: 'Recepcionista Bilíngue'
  },
  {
    id: '4',
    user_id: 'freelancer1',
    function_id: '11',
    status: 'aprovado',
    applied_at: '2024-06-25T14:20:00Z',
    user_name: 'Carlos Fotografo',
    user_email: 'carlos@email.com',
    event_name: 'Fashion Week São Paulo',
    function_cargo: 'Fotógrafo de Moda'
  },
  {
    id: '5',
    user_id: 'freelancer1',
    function_id: '9',
    status: 'pendente',
    applied_at: '2024-06-29T11:45:00Z',
    user_name: 'Carlos Fotografo',
    user_email: 'carlos@email.com',
    event_name: 'Festa Reveillon Copacabana',
    function_cargo: 'DJ Profissional'
  }
];

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [loading, setLoading] = useState(false);

  const refreshEvents = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
  };

  const refreshApplications = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
  };

  const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'producer_name' | 'functions'> & { functions: Omit<EventFunction, 'id'>[] }): Promise<boolean> => {
    if (!user) return false;

    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      producer_name: user.name,
      functions: eventData.functions.map((func, index) => ({
        ...func,
        id: `${Date.now()}_${index}`
      }))
    };

    setEvents(prev => [newEvent, ...prev]);
    return true;
  };

  const applyToEvent = async (functionId: string): Promise<boolean> => {
    if (!user) return false;

    const eventWithFunction = events.find(event => 
      event.functions.some(func => func.id === functionId)
    );
    
    const functionData = eventWithFunction?.functions.find(func => func.id === functionId);

    const newApplication: Application = {
      id: Date.now().toString(),
      user_id: user.id,
      function_id: functionId,
      status: 'pendente',
      applied_at: new Date().toISOString(),
      user_name: user.name,
      user_email: user.email,
      event_name: eventWithFunction?.name,
      function_cargo: functionData?.cargo
    };

    setApplications(prev => [newApplication, ...prev]);
    return true;
  };

  const updateApplicationStatus = async (applicationId: string, status: 'aprovado' | 'recusado'): Promise<boolean> => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId ? { ...app, status } : app
      )
    );
    return true;
  };

  const getEventsByProducer = (producerId: string) => {
    return events.filter(event => event.produtor_id === producerId);
  };

  const getApplicationsByUser = (userId: string) => {
    return applications.filter(app => app.user_id === userId);
  };

  const getApplicationsByEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return [];
    
    return applications.filter(app => 
      event.functions.some(func => func.id === app.function_id)
    );
  };

  return (
    <EventContext.Provider value={{
      events,
      applications,
      loading,
      createEvent,
      applyToEvent,
      updateApplicationStatus,
      getEventsByProducer,
      getApplicationsByUser,
      getApplicationsByEvent,
      refreshEvents,
      refreshApplications
    }}>
      {children}
    </EventContext.Provider>
  );
};
