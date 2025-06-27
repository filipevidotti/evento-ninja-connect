
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

interface Verification {
  id: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  tipo_documento: string;
  numero_documento: string;
  created_at: string;
  data_verificacao?: string;
  motivo_rejeicao?: string;
}

interface VerificationStatusProps {
  verification: Verification;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({ verification }) => {
  const getStatusIcon = () => {
    switch (verification.status) {
      case 'aprovado':
        return <CheckCircle2 className="w-8 h-8 text-green-500" />;
      case 'rejeitado':
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Clock className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (verification.status) {
      case 'aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'rejeitado':
        return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
    }
  };

  const getStatusMessage = () => {
    switch (verification.status) {
      case 'aprovado':
        return {
          title: 'Verificação aprovada!',
          description: 'Sua identidade foi verificada com sucesso. Agora você pode acessar todas as funcionalidades da plataforma.'
        };
      case 'rejeitado':
        return {
          title: 'Verificação rejeitada',
          description: 'Infelizmente não foi possível verificar sua identidade com os documentos enviados.'
        };
      default:
        return {
          title: 'Verificação em análise',
          description: 'Seus documentos estão sendo analisados. Isso pode levar até 24 horas.'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <CardTitle>{statusMessage.title}</CardTitle>
                <CardDescription>{statusMessage.description}</CardDescription>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Tipo de documento:</span>
              <p className="text-gray-900">
                {verification.tipo_documento.toUpperCase()}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Número:</span>
              <p className="text-gray-900">
                {verification.numero_documento}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Enviado em:</span>
              <p className="text-gray-900">
                {formatDate(verification.created_at)}
              </p>
            </div>
            {verification.data_verificacao && (
              <div>
                <span className="font-medium text-gray-700">
                  {verification.status === 'aprovado' ? 'Aprovado em:' : 'Rejeitado em:'}
                </span>
                <p className="text-gray-900">
                  {formatDate(verification.data_verificacao)}
                </p>
              </div>
            )}
          </div>

          {verification.status === 'rejeitado' && verification.motivo_rejeicao && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Motivo da rejeição:</h4>
                  <p className="text-red-800 mt-1">{verification.motivo_rejeicao}</p>
                </div>
              </div>
            </div>
          )}

          {verification.status === 'rejeitado' && (
            <Button className="w-full" onClick={() => window.location.reload()}>
              Tentar nova verificação
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
