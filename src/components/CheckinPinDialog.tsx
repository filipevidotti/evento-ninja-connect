
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useCheckin } from '@/hooks/useCheckin';

interface CheckinPinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventName: string;
}

const CheckinPinDialog = ({ open, onOpenChange, eventId, eventName }: CheckinPinDialogProps) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { performCheckin, loading } = useCheckin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length < 4) {
      setError('PIN deve ter pelo menos 4 dígitos');
      return;
    }

    setError('');
    const result = await performCheckin(eventId, pin);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setPin('');
        setSuccess(false);
        setError('');
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setPin('');
    setError('');
    setSuccess(false);
  };

  const formatPin = (value: string) => {
    // Remove caracteres não numéricos e limita a 6 dígitos
    const numbers = value.replace(/\D/g, '').slice(0, 6);
    return numbers;
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-green-900">Check-in Bem-Sucedido!</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Você registrou sua chegada no evento:
            </p>
            <p className="font-medium text-gray-900">{eventName}</p>
            <p className="text-sm text-gray-500">
              Horário: {new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Check-in no Evento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Digite o PIN fornecido pelo organizador do evento:
            </p>
            <p className="font-medium text-gray-900">{eventName}</p>
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              placeholder="____"
              value={pin}
              onChange={(e) => setPin(formatPin(e.target.value))}
              className="text-center text-2xl font-mono tracking-widest"
              maxLength={6}
              autoFocus
            />
            <p className="text-xs text-gray-500 text-center">
              Digite o código de 4-6 dígitos
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || pin.length < 4}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Confirmar Check-in'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckinPinDialog;
