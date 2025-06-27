
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('verification-documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('verification-documents')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const submitVerification = useCallback(async (data: VerificationData) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    try {
      // Upload dos arquivos
      const documentUrl = await uploadFile(data.documentFile, 'documents');
      const selfieUrl = await uploadFile(data.selfieFile, 'selfies');

      // Inserir dados de verificação
      const { data: verificationData, error } = await supabase
        .from('verifications')
        .insert({
          user_id: user.id,
          tipo_documento: data.documentType,
          numero_documento: data.documentNumber,
          foto_documento_url: documentUrl,
          selfie_url: selfieUrl,
          status: 'pendente'
        })
        .select()
        .single();

      if (error) throw error;

      setVerification(verificationData);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const checkVerificationStatus = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setVerification(data);
    } catch (error) {
      console.error('Error checking verification status:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    verification,
    loading,
    submitVerification,
    checkVerificationStatus
  };
};
