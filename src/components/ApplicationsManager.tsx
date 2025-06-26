
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
  onApplicationAction: (applicationId: string, action: 'approved' | 'rejected') => void;
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
                  <h3 className="font-medium text-lg mb-4">{event.title}</h3>
                  <div className="space-y-3">
                    {eventApplications.map(application => {
                      const eventFunction = event.functions.find(f => f.id === application.functionId);
                      
                      return (
                        <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{application.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{application.userName}</p>
                              <p className="text-sm text-gray-600">{application.userEmail}</p>
                              <p className="text-sm text-gray-600">
                                <strong>Função:</strong> {eventFunction?.role}
                              </p>
                              <p className="text-xs text-gray-500">
                                Candidatou-se em {new Date(application.appliedAt).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {application.status === 'pending' ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onApplicationAction(application.id, 'rejected')}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Recusar
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => onApplicationAction(application.id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Aprovar
                                </Button>
                              </>
                            ) : (
                              <Badge 
                                className={application.status === 'approved' ? 
                                  'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                              >
                                {application.status === 'approved' ? (
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationsManager;
