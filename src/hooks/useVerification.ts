
import { useState, useCallback } from 'react';

interface VerificationData {
  documentType: 'rg' | 'cnh' | 'passaporte';
  documentNumber: string;
  documentFile: File;
  selfieFile: File;
}

interface Verification {
  id: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  tipo_documento: string;
  numero_documento: string;
  created_at: string;
  data_verificacao?: string;
  motivo_rejeicao?: string;
}

export const useVerification = () => {
  const [verification, setVerification] = useState<Verification>({
    id: '1',
    status: 'aprovado',
    tipo_documento: 'rg',
    numero_documento: '123456789',
    created_at: '2024-06-20',
    data_verificacao: '2024-06-21'
  });
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
    // Mock - não faz nada
  }, []);

  return {
    verification,
    loading,
    submitVerification,
    checkVerificationStatus
  };
};
