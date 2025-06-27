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

// Dados mockados expandidos com mais eventos
const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Festival de Música 2024',
    descricao: 'Grande festival de música com artistas nacionais e internacionais. Esperamos mais de 50.000 pessoas durante os 3 dias de evento.',
    data: '2024-12-31',
    local: 'Parque Ibirapuera, São Paulo - SP',
    produtor_id: '2',
    producer_name: 'João Silva',
    status: 'open',
    created_at: '2024-06-27',
    functions: [
      {
        id: '1',
        cargo: 'Fotógrafo',
        quantidade: 3,
        valor: 500,
        requirements: 'Experiência em eventos musicais, equipamento profissional'
      },
      {
        id: '2',
        cargo: 'Cinegrafista',
        quantidade: 2,
        valor: 800,
        requirements: 'Equipamento próprio, drone preferencial'
      },
      {
        id: '3',
        cargo: 'Segurança',
        quantidade: 15,
        valor: 300,
        requirements: 'Curso de vigilante, experiência em eventos'
      }
    ]
  },
  {
    id: '2',
    name: 'Casamento Maria & Pedro',
    descricao: 'Cerimônia e festa de casamento elegante para 200 convidados',
    data: '2024-07-15',
    local: 'Salão de Festas Premium, Rio de Janeiro - RJ',
    produtor_id: '2',
    producer_name: 'João Silva',
    status: 'open',
    created_at: '2024-06-25',
    functions: [
      {
        id: '4',
        cargo: 'Fotógrafo',
        quantidade: 1,
        valor: 1200,
        requirements: 'Portfolio de casamentos, equipamento completo'
      },
      {
        id: '5',
        cargo: 'Garçom',
        quantidade: 8,
        valor: 250,
        requirements: 'Experiência em eventos sociais, uniforme próprio'
      },
      {
        id: '6',
        cargo: 'Bartender',
        quantidade: 2,
        valor: 400,
        requirements: 'Conhecimento em drinks clássicos'
      }
    ]
  },
  {
    id: '3',
    name: 'Evento Corporativo XYZ',
    descricao: 'Conferência anual da empresa XYZ com palestras e networking',
    data: '2024-08-20',
    local: 'Centro de Convenções, Belo Horizonte - MG',
    produtor_id: '2',
    producer_name: 'João Silva',
    status: 'open',
    created_at: '2024-06-20',
    functions: [
      {
        id: '7',
        cargo: 'Recepcionista',
        quantidade: 4,
        valor: 200,
        requirements: 'Boa comunicação, inglês básico'
      },
      {
        id: '8',
        cargo: 'Técnico de Som',
        quantidade: 2,
        valor: 600,
        requirements: 'Conhecimento em equipamentos de áudio profissional'
      }
    ]
  },
  {
    id: '4',
    name: 'Festa de Aniversário 50 Anos',
    descricao: 'Celebração de aniversário temática com 200 convidados',
    data: '2024-09-10',
    local: 'Clube Recreativo, Brasília - DF',
    produtor_id: '2',
    producer_name: 'João Silva',
    status: 'closed',
    created_at: '2024-06-15',
    functions: [
      {
        id: '9',
        cargo: 'DJ',
        quantidade: 1,
        valor: 800,
        requirements: 'Playlist variada, equipamento próprio'
      },
      {
        id: '10',
        cargo: 'Bartender',
        quantidade: 2,
        valor: 350,
        requirements: 'Conhecimento em drinks, apresentação impecável'
      }
    ]
  },
  {
    id: '5',
    name: 'Workshop de Fotografia',
    descricao: 'Workshop intensivo de fotografia profissional',
    data: '2024-07-25',
    local: 'Estúdio Central, São Paulo - SP',
    produtor_id: '2',
    producer_name: 'João Silva',
    status: 'open',
    created_at: '2024-06-22',
    functions: [
      {
        id: '11',
        cargo: 'Assistente de Fotografia',
        quantidade: 2,
        valor: 300,
        requirements: 'Conhecimento básico de fotografia'
      },
      {
        id: '12',
        cargo: 'Organizador de Evento',
        quantidade: 1,
        valor: 400,
        requirements: 'Experiência em coordenação de eventos'
      }
    ]
  },
  {
    id: '6',
    name: 'Feira Gastronômica',
    descricao: 'Grande feira de gastronomia com food trucks e shows',
    data: '2024-08-15',
    local: 'Parque da Cidade, Fortaleza - CE',
    produtor_id: '2',
    producer_name: 'João Silva',
    status: 'open',
    created_at: '2024-06-18',
    functions: [
      {
        id: '13',
        cargo: 'Garçom',
        quantidade: 20,
        valor: 280,
        requirements: 'Experiência em atendimento, agilidade'
      },
      {
        id: '14',
        cargo: 'Limpeza',
        quantidade: 8,
        valor: 180,
        requirements: 'Disponibilidade para trabalhar em equipe'
      },
      {
        id: '15',
        cargo: 'Caixa',
        quantidade: 10,
        valor: 220,
        requirements: 'Experiência com vendas, matemática básica'
      }
    ]
  }
];

// Candidaturas fictícias expandidas
const mockApplications: Application[] = [
  // Aplicações do usuário freelancer1 (logado)
  {
    id: '1',
    user_id: 'freelancer1',
    function_id: '1',
    status: 'pendente',
    applied_at: '2024-06-28T10:30:00Z',
    user_name: 'Carlos Fotografo',
    user_email: 'carlos@email.com',
    event_name: 'Festival de Música 2024',
    function_cargo: 'Fotógrafo'
  },
  {
    id: '2',
    user_id: 'freelancer1',
    function_id: '4',
    status: 'aprovado',
    applied_at: '2024-06-27T15:20:00Z',
    user_name: 'Carlos Fotografo',
    user_email: 'carlos@email.com',
    event_name: 'Casamento Maria & Pedro',
    function_cargo: 'Fotógrafo'
  },
  {
    id: '3',
    user_id: 'freelancer1',
    function_id: '7',
    status: 'recusado',
    applied_at: '2024-06-26T09:15:00Z',
    user_name: 'Carlos Fotografo',
    user_email: 'carlos@email.com',
    event_name: 'Evento Corporativo XYZ',
    function_cargo: 'Recepcionista'
  },
  // Outras aplicações
  {
    id: '4',
    user_id: 'freelancer2',
    function_id: '1',
    status: 'aprovado',
    applied_at: '2024-06-27T15:20:00Z',
    user_name: 'Ana Santos',
    user_email: 'ana@email.com',
    event_name: 'Festival de Música 2024',
    function_cargo: 'Fotógrafo'
  },
  {
    id: '5',
    user_id: 'freelancer3',
    function_id: '2',
    status: 'pendente',
    applied_at: '2024-06-28T09:15:00Z',
    user_name: 'Pedro Oliveira',
    user_email: 'pedro@email.com',
    event_name: 'Festival de Música 2024',
    function_cargo: 'Cinegrafista'
  },
  {
    id: '6',
    user_id: 'freelancer4',
    function_id: '5',
    status: 'aprovado',
    applied_at: '2024-06-26T14:45:00Z',
    user_name: 'Maria Silva',
    user_email: 'maria@email.com',
    event_name: 'Casamento Maria & Pedro',
    function_cargo: 'Garçom'
  },
  {
    id: '7',
    user_id: 'freelancer5',
    function_id: '5',
    status: 'pendente',
    applied_at: '2024-06-28T11:30:00Z',
    user_name: 'João Garçom',
    user_email: 'joao@email.com',
    event_name: 'Casamento Maria & Pedro',
    function_cargo: 'Garçom'
  },
  {
    id: '8',
    user_id: 'freelancer6',
    function_id: '5',
    status: 'pendente',
    applied_at: '2024-06-28T12:00:00Z',
    user_name: 'Lucas Costa',
    user_email: 'lucas@email.com',
    event_name: 'Casamento Maria & Pedro',
    function_cargo: 'Garçom'
  },
  {
    id: '9',
    user_id: 'freelancer7',
    function_id: '7',
    status: 'recusado',
    applied_at: '2024-06-25T16:20:00Z',
    user_name: 'Fernanda Lima',
    user_email: 'fernanda@email.com',
    event_name: 'Evento Corporativo XYZ',
    function_cargo: 'Recepcionista'
  },
  {
    id: '10',
    user_id: 'freelancer8',
    function_id: '7',
    status: 'aprovado',
    applied_at: '2024-06-26T08:30:00Z',
    user_name: 'Roberto Santos',
    user_email: 'roberto@email.com',
    event_name: 'Evento Corporativo XYZ',
    function_cargo: 'Recepcionista'
  },
  {
    id: '11',
    user_id: 'freelancer9',
    function_id: '8',
    status: 'pendente',
    applied_at: '2024-06-28T13:45:00Z',
    user_name: 'Diego Técnico',
    user_email: 'diego@email.com',
    event_name: 'Evento Corporativo XYZ',
    function_cargo: 'Técnico de Som'
  },
  {
    id: '12',
    user_id: 'freelancer10',
    function_id: '9',
    status: 'aprovado',
    applied_at: '2024-06-24T19:15:00Z',
    user_name: 'Rafael DJ',
    user_email: 'rafael@email.com',
    event_name: 'Festa de Aniversário 50 Anos',
    function_cargo: 'DJ'
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
