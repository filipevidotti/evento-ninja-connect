
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

// Dados mockados
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
    produtor_id: '3',
    producer_name: 'Ana Santos',
    status: 'open',
    created_at: '2024-06-25',
    functions: [
      {
        id: '3',
        cargo: 'Fotógrafo',
        quantidade: 1,
        valor: 1200,
        requirements: 'Portfolio de casamentos'
      }
    ]
  }
];

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [applications, setApplications] = useState<Application[]>([]);
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
