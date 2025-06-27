import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Clock, Eye, FileText, User } from 'lucide-react';

interface AdminVerification {
  id: string;
  user_id: string;
  tipo_documento: string;
  numero_documento: string;
  foto_documento_url: string;
  selfie_url: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  created_at: string;
  motivo_rejeicao?: string;
  user_profiles?: {
    name: string;
    city: string;
  } | null;
}

const AdminVerifications = () => {
  const [verifications, setVerifications] = useState<AdminVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<AdminVerification | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const { toast } = useToast();

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      
      // Mock data - no database dependencies
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockVerifications: AdminVerification[] = [
        {
          id: '1',
          user_id: 'user1',
          tipo_documento: 'cpf',
          numero_documento: '123.456.789-00',
          foto_documento_url: '/placeholder.svg',
          selfie_url: '/placeholder.svg',
          status: 'pendente',
          created_at: new Date().toISOString(),
          user_profiles: {
            name: 'João Silva',
            city: 'São Paulo'
          }
        },
        {
          id: '2',
          user_id: 'user2',
          tipo_documento: 'rg',
          numero_documento: '12.345.678-9',
          foto_documento_url: '/placeholder.svg',
          selfie_url: '/placeholder.svg',
          status: 'aprovado',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          user_profiles: {
            name: 'Maria Santos',
            city: 'Rio de Janeiro'
          }
        }
      ];
      
      setVerifications(mockVerifications);
    } catch (error) {
      console.error('Error fetching verifications:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar verificações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const updateVerificationStatus = async (
    verificationId: string, 
    status: 'aprovado' | 'rejeitado', 
    reason?: string
  ) => {
    try {
      // Mock update - no database dependencies
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: status === 'aprovado' ? 'Verificação aprovada!' : 'Verificação rejeitada',
        description: `A verificação foi ${status === 'aprovado' ? 'aprovada' : 'rejeitada'} com sucesso.`
      });

      fetchVerifications();
      setSelectedVerification(null);
      setRejectReason('');
    } catch (error) {
      console.error('Error updating verification:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar verificação.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'rejeitado':
        return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel de Verificações
          </h1>
          <p className="text-gray-600">
            Gerencie as verificações de identidade dos usuários
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verificações Recentes</CardTitle>
            <CardDescription>
              Lista de todas as verificações de identidade enviadas pelos usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verifications.map((verification) => (
                  <TableRow key={verification.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{verification.user_profiles?.name || 'Nome não disponível'}</div>
                        <div className="text-sm text-gray-500">{verification.user_profiles?.city || 'Cidade não disponível'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{verification.tipo_documento.toUpperCase()}</div>
                        <div className="text-sm text-gray-500">{verification.numero_documento}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(verification.created_at)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(verification.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedVerification(verification)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        {verification.status === 'pendente' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateVerificationStatus(verification.id, 'aprovado')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Aprovar
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal de detalhes da verificação */}
        {selectedVerification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Detalhes da Verificação</CardTitle>
                <CardDescription>
                  Revise os documentos enviados pelo usuário
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-gray-700">Usuário:</label>
                    <p>{selectedVerification.user_profiles?.name || 'Nome não disponível'}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Cidade:</label>
                    <p>{selectedVerification.user_profiles?.city || 'Cidade não disponível'}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Tipo de Documento:</label>
                    <p>{selectedVerification.tipo_documento.toUpperCase()}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Número:</label>
                    <p>{selectedVerification.numero_documento}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-gray-700 block mb-2">Documento:</label>
                    <img 
                      src={selectedVerification.foto_documento_url} 
                      alt="Documento"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-gray-700 block mb-2">Selfie:</label>
                    <img 
                      src={selectedVerification.selfie_url} 
                      alt="Selfie"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                </div>

                {selectedVerification.status === 'pendente' && (
                  <div className="space-y-4">
                    <div>
                      <label className="font-medium text-gray-700 block mb-2">
                        Motivo da rejeição (opcional):
                      </label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Digite o motivo caso vá rejeitar..."
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedVerification(null);
                          setRejectReason('');
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => updateVerificationStatus(
                          selectedVerification.id, 
                          'rejeitado', 
                          rejectReason
                        )}
                        disabled={!rejectReason.trim()}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rejeitar
                      </Button>
                      <Button
                        onClick={() => updateVerificationStatus(selectedVerification.id, 'aprovado')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Aprovar
                      </Button>
                    </div>
                  </div>
                )}

                {selectedVerification.status !== 'pendente' && (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedVerification(null)}
                    >
                      Fechar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVerifications;
