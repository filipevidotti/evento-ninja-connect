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

// Dados mockados expandidos
const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Festival de Música 2024',
    descricao: 'Grande festival de música com artistas nacionais e internacionais',
    data: '2024-12-31',
    local: 'São Paulo - SP',
    produtor_id: '2',
    producer_name: 'João Silva',
    status: 'open',
    created_at: '2024-06-27',
    functions: [
      {
        id: '1',
        cargo: 'Fotógrafo',
        quantidade: 2,
        valor: 500,
        requirements: 'Experiência em eventos musicais'
      },
      {
        id: '2',
        cargo: 'Cinegrafista',
        quantidade: 1,
        valor: 800,
        requirements: 'Equipamento próprio'
      }
    ]
  },
  {
    id: '2',
    name: 'Casamento Maria & Pedro',
    descricao: 'Cerimônia e festa de casamento',
    data: '2024-07-15',
    local: 'Rio de Janeiro - RJ',
    produtor_id: '2',
    producer_name: 'João Silva',
    status: 'open',
    created_at: '2024-06-25',
    functions: [
      {
        id: '3',
        cargo: 'Fotógrafo',
        quantidade: 1,
        valor: 1200,
        requirements: 'Portfolio de casamentos'
      },
      {
        id: '4',
        cargo: 'Garçom',
        quantidade: 8,
        valor: 250,
        requirements: 'Experiência em eventos sociais'
      }
    ]
  },
  {
    id: '3',
    name: 'Evento Corporativo XYZ',
    descricao: 'Conferência anual da empresa XYZ',
    data: '2024-08-20',
    local: 'Belo Horizonte - MG',
    produtor_id: '2',
    producer_name: 'João Silva',
    status: 'open',
    created_at: '2024-06-20',
    functions: [
      {
        id: '5',
        cargo: 'Recepcionista',
        quantidade: 4,
        valor: 200,
        requirements: 'Boa comunicação'
      },
      {
        id: '6',
        cargo: 'Técnico de Som',
        quantidade: 2,
        valor: 600,
        requirements: 'Conhecimento em equipamentos de áudio'
      }
    ]
  },
  {
    id: '4',
    name: 'Festa de Aniversário 50 Anos',
    descricao: 'Celebração de aniversário com 200 convidados',
    data: '2024-09-10',
    local: 'Brasília - DF',
    produtor_id: '2',
    producer_name: 'João Silva',
    status: 'closed',
    created_at: '2024-06-15',
    functions: [
      {
        id: '7',
        cargo: 'DJ',
        quantidade: 1,
        valor: 800,
        requirements: 'Playlist variada'
      },
      {
        id: '8',
        cargo: 'Bartender',
        quantidade: 2,
        valor: 350,
        requirements: 'Conhecimento em drinks'
      }
    ]
  }
];

// Candidaturas fictícias
const mockApplications: Application[] = [
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
    id: '3',
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
    id: '4',
    user_id: 'freelancer4',
    function_id: '3',
    status: 'aprovado',
    applied_at: '2024-06-26T14:45:00Z',
    user_name: 'Maria Silva',
    user_email: 'maria@email.com',
    event_name: 'Casamento Maria & Pedro',
    function_cargo: 'Fotógrafo'
  },
  {
    id: '5',
    user_id: 'freelancer5',
    function_id: '4',
    status: 'pendente',
    applied_at: '2024-06-28T11:30:00Z',
    user_name: 'João Garçom',
    user_email: 'joao@email.com',
    event_name: 'Casamento Maria & Pedro',
    function_cargo: 'Garçom'
  },
  {
    id: '6',
    user_id: 'freelancer6',
    function_id: '4',
    status: 'pendente',
    applied_at: '2024-06-28T12:00:00Z',
    user_name: 'Lucas Costa',
    user_email: 'lucas@email.com',
    event_name: 'Casamento Maria & Pedro',
    function_cargo: 'Garçom'
  },
  {
    id: '7',
    user_id: 'freelancer7',
    function_id: '5',
    status: 'recusado',
    applied_at: '2024-06-25T16:20:00Z',
    user_name: 'Fernanda Lima',
    user_email: 'fernanda@email.com',
    event_name: 'Evento Corporativo XYZ',
    function_cargo: 'Recepcionista'
  },
  {
    id: '8',
    user_id: 'freelancer8',
    function_id: '5',
    status: 'aprovado',
    applied_at: '2024-06-26T08:30:00Z',
    user_name: 'Roberto Santos',
    user_email: 'roberto@email.com',
    event_name: 'Evento Corporativo XYZ',
    function_cargo: 'Recepcionista'
  },
  {
    id: '9',
    user_id: 'freelancer9',
    function_id: '6',
    status: 'pendente',
    applied_at: '2024-06-28T13:45:00Z',
    user_name: 'Diego Técnico',
    user_email: 'diego@email.com',
    event_name: 'Evento Corporativo XYZ',
    function_cargo: 'Técnico de Som'
  },
  {
    id: '10',
    user_id: 'freelancer10',
    function_id: '7',
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
