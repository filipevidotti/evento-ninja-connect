
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Users, Key, Eye, EyeOff } from 'lucide-react';
import { Event } from '@/components/EventContext';
import { toast } from '@/hooks/use-toast';

interface ExtendedEvent extends Event {
  checkin_pin?: string;
}

interface ProducerEventCardProps {
  event: ExtendedEvent;
  totalApplications: number;
  approvedApplications: number;
}

const ProducerEventCard: React.FC<ProducerEventCardProps> = ({ event, totalApplications, approvedApplications }) => {
  const [showPin, setShowPin] = useState(false);
  const [customPin, setCustomPin] = useState('');
  const [isEditingPin, setIsEditingPin] = useState(false);

  // Mock PIN para demonstração
  const currentPin = event.checkin_pin || '1234';

  const handleGeneratePin = () => {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    toast({
      title: "PIN gerado!",
      description: `Novo PIN: ${newPin}`,
    });
  };

  const handleSaveCustomPin = () => {
    if (customPin.length >= 4) {
      toast({
        title: "PIN atualizado!",
        description: `PIN do evento atualizado para: ${customPin}`,
      });
      setIsEditingPin(false);
      setCustomPin('');
    } else {
      toast({
        title: "PIN inválido",
        description: "O PIN deve ter pelo menos 4 dígitos.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{event.name}</CardTitle>
          <Badge variant={event.status === 'open' ? 'default' : 'secondary'}>
            {event.status === 'open' ? 'Aberto' : event.status === 'closed' ? 'Fechado' : 'Concluído'}
          </Badge>
        </div>
        <CardDescription>{event.descricao}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(event.data).toLocaleDateString('pt-BR')}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {event.local}
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {totalApplications} candidaturas ({approvedApplications} aprovadas)
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Funções:</h4>
          {event.functions.map(func => (
            <div key={func.id} className="flex items-center justify-between text-sm">
              <span>{func.cargo} ({func.quantidade}x)</span>
              <span className="text-green-600 font-medium">R$ {func.valor}</span>
            </div>
          ))}
        </div>

        {/* Seção de PIN para Check-in */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-600" />
            <h4 className="font-medium text-sm">PIN de Check-in</h4>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                <span className="font-mono text-lg">
                  {showPin ? currentPin : '••••'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPin(!showPin)}
                  className="p-1"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGeneratePin}
              className="flex-1"
            >
              Gerar Novo PIN
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingPin(!isEditingPin)}
              className="flex-1"
            >
              PIN Custom
            </Button>
          </div>

          {isEditingPin && (
            <div className="space-y-2">
              <Input
                placeholder="Digite o PIN customizado"
                value={customPin}
                onChange={(e) => setCustomPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center font-mono"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditingPin(false);
                    setCustomPin('');
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveCustomPin}
                  className="flex-1"
                >
                  Salvar PIN
                </Button>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500">
            <p>• Compartilhe este PIN com os freelancers para check-in</p>
            <p>• O PIN pode ser alterado a qualquer momento</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProducerEventCard;
