
import { useState, useCallback } from 'react';
import { useAuth } from '@/components/AuthContext';

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
  const [verification, setVerification] = useState<Verification | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const submitVerification = useCallback(async (data: VerificationData) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    
    // Simular upload e processamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newVerification: Verification = {
      id: Date.now().toString(),
      status: 'pendente',
      tipo_documento: data.documentType,
      numero_documento: data.documentNumber,
      created_at: new Date().toISOString()
    };

    setVerification(newVerification);
    setLoading(false);
  }, [user]);

  const checkVerificationStatus = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simular verificação existente
    if (Math.random() > 0.5) {
      setVerification({
        id: '1',
        status: 'aprovado',
        tipo_documento: 'rg',
        numero_documento: '123456789',
        created_at: '2024-06-20',
        data_verificacao: '2024-06-21'
      });
    }
    
    setLoading(false);
  }, [user]);

  return {
    verification,
    loading,
    submitVerification,
    checkVerificationStatus
  };
};
