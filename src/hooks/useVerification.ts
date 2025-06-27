
import { useState, useCallback } from 'react';

interface VerificationData {
  documentType: 'rg' | 'cnh' | 'passaporte';
  documentNumber: string;
  documentFile: File;
  selfieFile: File;
}

interface Verification {
  id: string;
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'nao_verificado';
  tipo_documento: string;
  numero_documento: string;
  created_at: string;
  data_verificacao?: string;
  motivo_rejeicao?: string;
}

export const useVerification = () => {
  // Simulando usuário não verificado por padrão
  const [verification, setVerification] = useState<Verification | null>(null);
  const [loading, setLoading] = useState(false);

  const submitVerification = useCallback(async (data: VerificationData) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setVerification({
      id: Date.now().toString(),
      status: 'pendente',
      tipo_documento: data.documentType,
      numero_documento: data.documentNumber,
      created_at: new Date().toISOString()
    });
    
    setLoading(false);
  }, []);

  const checkVerificationStatus = useCallback(async () => {
    // Mock - simula usuário não verificado
    if (!verification) {
      setVerification({
        id: '0',
        status: 'nao_verificado',
        tipo_documento: '',
        numero_documento: '',
        created_at: new Date().toISOString()
      });
    }
  }, [verification]);

  return {
    verification,
    loading,
    submitVerification,
    checkVerificationStatus
  };
};
