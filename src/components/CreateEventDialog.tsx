
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EventFunction } from '@/components/EventContext';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Team {
  id: string;
  name: string;
}

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateEvent: (eventData: {
    name: string;
    descricao: string;
    data: string;
    local: string;
    functions: Omit<EventFunction, 'id'>[];
  }) => void;
  availableTeams?: Team[];
}

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({ 
  open, 
  onOpenChange, 
  onCreateEvent,
  availableTeams = [] 
}) => {
  const { toast } = useToast();
  const [newEvent, setNewEvent] = useState({
    name: '',
    descricao: '',
    data: '',
    local: '',
    functions: [] as Omit<EventFunction, 'id'>[]
  });
  const [newFunction, setNewFunction] = useState({
    cargo: '',
    quantidade: 1,
    valor: 0,
    requirements: '',
    team: 'Geral'
  });

  // Default teams including "Geral"
  const teams = availableTeams.length > 0 
    ? [{ id: 'geral', name: 'Geral' }, ...availableTeams]
    : [{ id: 'geral', name: 'Geral' }];

  const handleCreateEvent = () => {
    if (!newEvent.name || !newEvent.data || !newEvent.local || newEvent.functions.length === 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios e adicione pelo menos uma função.",
        variant: "destructive"
      });
      return;
    }

    onCreateEvent(newEvent);
    setNewEvent({
      name: '',
      descricao: '',
      data: '',
      local: '',
      functions: []
    });
    setNewFunction({
      cargo: '',
      quantidade: 1,
      valor: 0,
      requirements: '',
      team: 'Geral'
    });
    onOpenChange(false);
  };

  const addFunction = () => {
    if (!newFunction.cargo || !newFunction.valor) {
      toast({
        title: "Erro",
        description: "Preencha pelo menos o cargo e salário.",
        variant: "destructive"
      });
      return;
    }

    setNewEvent({
      ...newEvent,
      functions: [...newEvent.functions, { 
        cargo: newFunction.cargo,
        quantidade: newFunction.quantidade,
        valor: newFunction.valor,
        requirements: newFunction.requirements,
        team: newFunction.team
      }]
    });

    setNewFunction({
      cargo: '',
      quantidade: 1,
      valor: 0,
      requirements: '',
      team: 'Geral'
    });

    toast({
      title: "Função adicionada!",
      description: `${newFunction.cargo} foi adicionado ao evento.`
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
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data *</label>
              <Input
                type="date"
                value={newEvent.data}
                onChange={(e) => setNewEvent({ ...newEvent, data: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              placeholder="Descreva seu evento..."
              value={newEvent.descricao}
              onChange={(e) => setNewEvent({ ...newEvent, descricao: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Local *</label>
            <Input
              placeholder="Ex: Centro de Convenções, São Paulo"
              value={newEvent.local}
              onChange={(e) => setNewEvent({ ...newEvent, local: e.target.value })}
            />
          </div>
          
          {/* Add Function Section */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Adicionar Função</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cargo *</label>
                <Input
                  placeholder="Ex: Garçom"
                  value={newFunction.cargo}
                  onChange={(e) => setNewFunction({ ...newFunction, cargo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Equipe *</label>
                <Select
                  value={newFunction.team}
                  onValueChange={(value) => setNewFunction({ ...newFunction, team: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar equipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.name}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantidade *</label>
                <Input
                  type="number"
                  min="1"
                  value={newFunction.quantidade}
                  onChange={(e) => setNewFunction({ ...newFunction, quantidade: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Salário (R$) *</label>
                <Input
                  type="number"
                  min="0"
                  value={newFunction.valor}
                  onChange={(e) => setNewFunction({ ...newFunction, valor: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2 col-span-2">
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
                    <span className="font-medium">{func.cargo}</span>
                    <span className="text-sm text-blue-600 ml-2">
                      [{func.team || 'Geral'}]
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      ({func.quantidade}x) - R$ {func.valor}
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
