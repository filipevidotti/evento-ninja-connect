
-- Criar tabela de verificações de identidade
CREATE TABLE public.verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo_documento TEXT NOT NULL CHECK (tipo_documento IN ('rg', 'cnh', 'passaporte')),
  numero_documento TEXT NOT NULL,
  foto_documento_url TEXT,
  selfie_url TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
  motivo_rejeicao TEXT,
  data_verificacao TIMESTAMP WITH TIME ZONE,
  admin_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar coluna de verificação aos perfis de usuário
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS verificado BOOLEAN DEFAULT false;

-- Adicionar RLS policies para verificações
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver apenas suas próprias verificações
CREATE POLICY "Users can view their own verifications" 
  ON public.verifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Usuários podem criar suas próprias verificações
CREATE POLICY "Users can create their own verifications" 
  ON public.verifications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar suas próprias verificações (para reenvio)
CREATE POLICY "Users can update their own verifications" 
  ON public.verifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Admins podem ver todas as verificações (para implementar depois)
CREATE POLICY "Admins can view all verifications" 
  ON public.verifications 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Criar bucket de storage para documentos de verificação
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'verification-documents', 
  'verification-documents', 
  false, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg']
);

-- Policy para upload de documentos de verificação
CREATE POLICY "Users can upload their verification documents" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'verification-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy para visualizar documentos de verificação
CREATE POLICY "Users can view their verification documents" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'verification-documents' AND 
    (auth.uid()::text = (storage.foldername(name))[1] OR
     EXISTS (
       SELECT 1 FROM public.user_profiles 
       WHERE id = auth.uid() AND user_type = 'admin'
     ))
  );

-- Policy para deletar documentos de verificação
CREATE POLICY "Users can delete their verification documents" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'verification-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
