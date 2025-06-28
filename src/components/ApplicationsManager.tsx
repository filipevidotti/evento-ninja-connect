
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { Event, Application } from '@/components/EventContext';

interface ApplicationsManagerProps {
  events: Event[];
  getApplicationsByEvent: (eventId: string) => Application[];
  onApplicationAction: (applicationId: string, action: 'aprovado' | 'recusado') => void;
}

const ApplicationsManager: React.FC<ApplicationsManagerProps> = ({ 
  events, 
  getApplicationsByEvent, 
  onApplicationAction 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Candidaturas</CardTitle>
        <CardDescription>
          Aprove ou recuse candidatos para seus eventos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Crie eventos para receber candidaturas.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map(event => {
              const eventApplications = getApplicationsByEvent(event.id);
              
              if (eventApplications.length === 0) return null;
              
              return (
                <div key={event.id} className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-4">{event.name}</h3>
                  <div className="space-y-3">
                    {eventApplications.map(application => {
                      const eventFunction = event.functions.find(f => f.id === application.function_id);
                      
                      return (
                        <div key={application.id} className="p-3 bg-gray-50 rounded-lg space-y-3">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{application.user_name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{application.user_name}</p>
                              <p className="text-sm text-gray-600">{application.user_email}</p>
                              <p className="text-sm text-gray-600">
                                <strong>Função:</strong> {eventFunction?.cargo}
                              </p>
                              <p className="text-xs text-gray-500">
                                Candidatou-se em {new Date(application.applied_at).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          
                          {/* Botões em linha separada no mobile */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                            {application.status === 'pendente' ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onApplicationAction(application.id, 'recusado')}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Recusar
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => onApplicationAction(application.id, 'aprovado')}
                                  className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Aprovar
                                </Button>
                              </>
                            ) : (
                              <Badge 
                                className={`w-full sm:w-auto justify-center ${application.status === 'aprovado' ? 
                                  'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                              >
                                {application.status === 'aprovado' ? (
                                  <><CheckCircle className="w-3 h-3 mr-1" />Aprovado</>
                                ) : (
                                  <><XCircle className="w-3 h-3 mr-1" />Recusado</>
                                )}
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            
            {events.every(event => getApplicationsByEvent(event.id).length === 0) && (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma candidatura recebida ainda.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Compartilhe seus eventos para receber candidaturas de freelancers.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationsManager;
