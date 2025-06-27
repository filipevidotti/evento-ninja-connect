import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshEvents = async () => {
    try {
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (eventsData) {
        const eventsWithFunctions = await Promise.all(
          eventsData.map(async (event) => {
            const { data: functionsData } = await supabase
              .from('functions')
              .select('*')
              .eq('evento_id', event.id);

            const { data: producerData } = await supabase
              .from('user_profiles')
              .select('name')
              .eq('id', event.produtor_id)
              .single();

            return {
              id: event.id,
              name: event.name,
              descricao: event.descricao || '',
              data: event.data,
              local: event.local,
              produtor_id: event.produtor_id,
              producer_name: producerData?.name || 'Produtor',
              functions: functionsData || [],
              status: event.status as 'open' | 'closed' | 'completed',
              created_at: event.created_at
            };
          })
        );

        setEvents(eventsWithFunctions);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const refreshApplications = async () => {
    if (!user) return;

    try {
      const { data: userApplicationsData } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });

      if (userApplicationsData) {
        const enrichedApplications = await Promise.all(
          userApplicationsData.map(async (app) => {
            const { data: functionData } = await supabase
              .from('functions')
              .select(`
                cargo,
                events(name)
              `)
              .eq('id', app.function_id)
              .single();

            return {
              id: app.id,
              user_id: app.user_id,
              function_id: app.function_id,
              status: app.status as 'pendente' | 'aprovado' | 'recusado',
              applied_at: app.applied_at,
              user_name: user.name,
              user_email: user.email,
              event_name: functionData?.events?.name,
              function_cargo: functionData?.cargo
            };
          })
        );

        setApplications(enrichedApplications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  // Load events once on mount
  useEffect(() => {
    refreshEvents();
  }, []);

  // Load applications when user changes
  useEffect(() => {
    if (user) {
      refreshApplications();
    } else {
      setApplications([]);
    }
  }, [user]);

  const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'producer_name' | 'functions'> & { functions: Omit<EventFunction, 'id'>[] }): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data: eventResult, error: eventError } = await supabase
        .from('events')
        .insert({
          name: eventData.name,
          descricao: eventData.descricao,
          data: eventData.data,
          local: eventData.local,
          produtor_id: user.id,
          status: eventData.status
        })
        .select()
        .single();

      if (eventError) throw eventError;

      if (eventData.functions.length > 0) {
        const functionsToInsert = eventData.functions.map(func => ({
          evento_id: eventResult.id,
          cargo: func.cargo,
          quantidade: func.quantidade,
          valor: func.valor,
          requirements: func.requirements
        }));

        const { error: functionsError } = await supabase
          .from('functions')
          .insert(functionsToInsert);

        if (functionsError) throw functionsError;
      }

      await refreshEvents();
      return true;
    } catch (error) {
      console.error('Error creating event:', error);
      return false;
    }
  };

  const applyToEvent = async (functionId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          function_id: functionId,
          status: 'pendente'
        });

      if (error) throw error;

      await refreshApplications();
      return true;
    } catch (error) {
      console.error('Error applying to event:', error);
      return false;
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: 'aprovado' | 'recusado'): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', applicationId);

      if (error) throw error;

      await refreshApplications();
      return true;
    } catch (error) {
      console.error('Error updating application status:', error);
      return false;
    }
  };

  const getEventsByProducer = (producerId: string) => {
    return events.filter(event => event.produtor_id === producerId);
  };

  const getApplicationsByUser = (userId: string) => {
    return applications.filter(app => app.user_id === userId);
  };

  const getApplicationsByEvent = (eventId: string) => {
    return applications.filter(app => {
      const event = events.find(e => e.id === eventId);
      return event?.functions.some(f => f.id === app.function_id);
    });
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
