
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface EventFunction {
  id: string;
  role: string;
  quantity: number;
  salary: number;
  requirements?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  city: string;
  producerId: string;
  producerName: string;
  functions: EventFunction[];
  status: 'open' | 'closed' | 'completed';
  createdAt: string;
}

export interface Application {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  eventId: string;
  functionId: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

interface EventContextType {
  events: Event[];
  applications: Application[];
  createEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  applyToEvent: (eventId: string, functionId: string, userId: string, userName: string, userEmail: string) => void;
  updateApplicationStatus: (applicationId: string, status: 'approved' | 'rejected') => void;
  getEventsByProducer: (producerId: string) => Event[];
  getApplicationsByUser: (userId: string) => Application[];
  getApplicationsByEvent: (eventId: string) => Application[];
}

const EventContext = createContext<EventContextType | null>(null);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    // Load mock data
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Festa Corporativa Tech Summit 2025',
        description: 'Grande evento corporativo com 500 convidados',
        date: '2025-07-15',
        location: 'Centro de Convenções Anhembi',
        city: 'São Paulo',
        producerId: 'prod1',
        producerName: 'Eventos Premium',
        functions: [
          { id: 'f1', role: 'Garçom', quantity: 10, salary: 150, requirements: 'Experiência mínima de 6 meses' },
          { id: 'f2', role: 'Operador de Caixa', quantity: 3, salary: 180 },
          { id: 'f3', role: 'Segurança', quantity: 5, salary: 200, requirements: 'Curso de segurança obrigatório' }
        ],
        status: 'open',
        createdAt: '2025-06-20'
      },
      {
        id: '2',
        title: 'Casamento de Luxo - Marina & Carlos',
        description: 'Cerimônia elegante para 200 convidados',
        date: '2025-08-22',
        location: 'Villa Bisutti',
        city: 'São Paulo',
        producerId: 'prod2',
        producerName: 'Casamentos dos Sonhos',
        functions: [
          { id: 'f4', role: 'Garçom', quantity: 8, salary: 160 },
          { id: 'f5', role: 'Operador de Caixa', quantity: 2, salary: 170 }
        ],
        status: 'open',
        createdAt: '2025-06-21'
      }
    ];
    
    setEvents(mockEvents);
  }, []);

  const createEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const applyToEvent = (eventId: string, functionId: string, userId: string, userName: string, userEmail: string) => {
    const newApplication: Application = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      userName,
      userEmail,
      eventId,
      functionId,
      status: 'pending',
      appliedAt: new Date().toISOString()
    };
    setApplications(prev => [...prev, newApplication]);
  };

  const updateApplicationStatus = (applicationId: string, status: 'approved' | 'rejected') => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId ? { ...app, status } : app
      )
    );
  };

  const getEventsByProducer = (producerId: string) => {
    return events.filter(event => event.producerId === producerId);
  };

  const getApplicationsByUser = (userId: string) => {
    return applications.filter(app => app.userId === userId);
  };

  const getApplicationsByEvent = (eventId: string) => {
    return applications.filter(app => app.eventId === eventId);
  };

  return (
    <EventContext.Provider value={{
      events,
      applications,
      createEvent,
      applyToEvent,
      updateApplicationStatus,
      getEventsByProducer,
      getApplicationsByUser,
      getApplicationsByEvent
    }}>
      {children}
    </EventContext.Provider>
  );
};
