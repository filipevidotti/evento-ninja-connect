
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface InviteFreelancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  freelancerName: string;
  onSendInvite: (inviteData: {
    eventType: string;
    date: Date | undefined;
    location: string;
    payment: string;
    message: string;
  }) => void;
}

const InviteFreelancerModal: React.FC<InviteFreelancerModalProps> = ({
  isOpen,
  onClose,
  freelancerName,
  onSendInvite
}) => {
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState<Date>();
  const [location, setLocation] = useState('');
  const [payment, setPayment] = useState('');
  const [message, setMessage] = useState('');

  const handleSendInvite = () => {
    onSendInvite({
      eventType,
      date,
      location,
      payment,
      message
    });
    
    // Reset form
    setEventType('');
    setDate(undefined);
    setLocation('');
    setPayment('');
    setMessage('');
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Convidar {freelancerName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="event-type">Tipo de Evento</Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casamento">Casamento</SelectItem>
                <SelectItem value="festa-corporativa">Festa Corporativa</SelectItem>
                <SelectItem value="aniversario">Aniversário</SelectItem>
                <SelectItem value="evento-social">Evento Social</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Data do Evento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="location">Local do Evento</Label>
            <Input
              id="location"
              placeholder="Endereço do evento"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="payment">Valor Oferecido (R$)</Label>
            <Input
              id="payment"
              placeholder="Ex: 200"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="message">Mensagem (Opcional)</Label>
            <Textarea
              id="message"
              placeholder="Descreva mais detalhes sobre o evento ou expectativas..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleSendInvite} 
              className="flex-1"
              disabled={!eventType || !date || !location || !payment}
            >
              Enviar Convite
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteFreelancerModal;
