
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EventFunction } from '@/components/EventContext';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateEvent: (eventData: {
    title: string;
    description: string;
    date: string;
    location: string;
    city: string;
    functions: EventFunction[];
  }) => void;
}

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({ open, onOpenChange, onCreateEvent }) => {
  const { toast } = useToast();
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    city: '',
    functions: [] as EventFunction[]
  });
  const [newFunction, setNewFunction] = useState({
    role: '',
    quantity: 1,
    salary: 0,
    requirements: ''
  });

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location || newEvent.functions.length === 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios e adicione pelo menos uma função.",
        variant: "destructive"
      });
      return;
    }

    onCreateEvent(newEvent);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      location: '',
      city: '',
      functions: []
    });
    onOpenChange(false);
  };

  const addFunction = () => {
    if (!newFunction.role || !newFunction.salary) {
      toast({
        title: "Erro",
        description: "Preencha pelo menos o cargo e salário.",
        variant: "destructive"
      });
      return;
    }

    const functionWithId = {
      ...newFunction,
      id: Math.random().toString(36).substr(2, 9)
    };

    setNewEvent({
      ...newEvent,
      functions: [...newEvent.functions, functionWithId]
    });

    setNewFunction({
      role: '',
      quantity: 1,
      salary: 0,
      requirements: ''
    });

    toast({
      title: "Função adicionada!",
      description: `${functionWithId.role} foi adicionado ao evento.`
    });
  };

  const removeFunction = (index: number) => {
    setNewEvent({
      ...newEvent,
      functions: newEvent.functions.filter((_, i) => i !== index)
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Evento</DialogTitle>
          <DialogDescription>
            Preencha as informações do seu evento e adicione as funções necessárias.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Evento *</label>
              <Input
                placeholder="Ex: Festa Corporativa 2025"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data *</label>
              <Input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              placeholder="Descreva seu evento..."
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Local *</label>
              <Input
                placeholder="Ex: Centro de Convenções"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cidade *</label>
              <Input
                placeholder="Ex: São Paulo"
                value={newEvent.city}
                onChange={(e) => setNewEvent({ ...newEvent, city: e.target.value })}
              />
            </div>
          </div>
          
          {/* Add Function Section */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Adicionar Função</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cargo *</label>
                <Input
                  placeholder="Ex: Garçom"
                  value={newFunction.role}
                  onChange={(e) => setNewFunction({ ...newFunction, role: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantidade *</label>
                <Input
                  type="number"
                  min="1"
                  value={newFunction.quantity}
                  onChange={(e) => setNewFunction({ ...newFunction, quantity: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Salário (R$) *</label>
                <Input
                  type="number"
                  min="0"
                  value={newFunction.salary}
                  onChange={(e) => setNewFunction({ ...newFunction, salary: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Requisitos</label>
                <Input
                  placeholder="Ex: Experiência mínima"
                  value={newFunction.requirements}
                  onChange={(e) => setNewFunction({ ...newFunction, requirements: e.target.value })}
                />
              </div>
            </div>
            <Button type="button" variant="outline" onClick={addFunction} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Função
            </Button>
          </div>
          
          {/* Functions List */}
          {newEvent.functions.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Funções Adicionadas:</h4>
              {newEvent.functions.map((func, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{func.role}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      ({func.quantity}x) - R$ {func.salary}
                    </span>
                    {func.requirements && (
                      <p className="text-xs text-gray-500">{func.requirements}</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFunction(index)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleCreateEvent} className="flex-1">
              Criar Evento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
