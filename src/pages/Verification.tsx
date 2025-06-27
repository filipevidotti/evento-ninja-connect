
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, XCircle, Camera, Upload, ArrowLeft } from 'lucide-react';
import { DocumentUpload } from '@/components/DocumentUpload';
import { SelfieCapture } from '@/components/SelfieCapture';
import { VerificationStatus } from '@/components/VerificationStatus';
import { useVerification } from '@/hooks/useVerification';
import { useToast } from '@/hooks/use-toast';

const Verification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [documentType, setDocumentType] = useState<'rg' | 'cnh' | 'passaporte'>('rg');
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  
  const { verification, loading, submitVerification, checkVerificationStatus } = useVerification();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    checkVerificationStatus();
  }, [user, navigate]);

  const handleSubmitVerification = async () => {
    if (!documentFile || !selfieFile || !documentNumber) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos e envie os documentos.",
        variant: "destructive"
      });
      return;
    }

    try {
      await submitVerification({
        documentType,
        documentNumber,
        documentFile,
        selfieFile
      });
      
      toast({
        title: "Verificação enviada!",
        description: "Seus documentos foram enviados para análise. Você receberá uma resposta em até 24 horas.",
      });
      
      setCurrentStep(4); // Status final
    } catch (error) {
      toast({
        title: "Erro ao enviar verificação",
        description: "Ocorreu um erro ao processar sua verificação. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se já tem verificação aprovada ou pendente, mostrar o status
  if (verification && verification.status !== 'nao_verificado') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <VerificationStatus verification={verification} />
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: "Tipo de Documento", completed: currentStep > 1 },
    { number: 2, title: "Foto do Documento", completed: currentStep > 2 },
    { number: 3, title: "Selfie", completed: currentStep > 3 },
    { number: 4, title: "Envio para Aprovação", completed: currentStep > 4 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verificação de Identidade
          </h1>
          <p className="text-gray-600">
            Para sua segurança e dos demais usuários, precisamos verificar sua identidade.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium
                ${step.completed ? 'bg-green-500 text-white' : 
                  currentStep === step.number ? 'bg-blue-500 text-white' : 
                  'bg-gray-300 text-gray-600'}
              `}>
                {step.completed ? <CheckCircle2 className="w-5 h-5" /> : step.number}
              </div>
              <span className={`ml-2 text-sm hidden sm:block ${
                step.completed || currentStep === step.number ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`ml-4 w-8 sm:w-16 h-0.5 ${
                  step.completed ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Etapa 1: Selecione o tipo de documento"}
              {currentStep === 2 && "Etapa 2: Envie a foto do documento"}
              {currentStep === 3 && "Etapa 3: Tire uma selfie"}
              {currentStep === 4 && "Etapa 4: Verificação enviada"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Escolha qual documento você deseja usar para verificação"}
              {currentStep === 2 && "Tire uma foto clara do seu documento"}
              {currentStep === 3 && "Tire uma selfie para comparação"}
              {currentStep === 4 && "Sua verificação foi enviada com sucesso"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'rg', label: 'RG', description: 'Registro Geral' },
                    { value: 'cnh', label: 'CNH', description: 'Carteira de Motorista' },
                    { value: 'passaporte', label: 'Passaporte', description: 'Documento Internacional' }
                  ].map((doc) => (
                    <button
                      key={doc.value}
                      onClick={() => setDocumentType(doc.value as any)}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        documentType === doc.value 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{doc.label}</div>
                      <div className="text-sm text-gray-500">{doc.description}</div>
                    </button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Número do documento</label>
                  <input
                    type="text"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    placeholder="Digite o número do documento"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <Button 
                  onClick={() => setCurrentStep(2)}
                  disabled={!documentNumber.trim()}
                  className="w-full"
                >
                  Continuar para Etapa 2
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <DocumentUpload
                onFileSelect={setDocumentFile}
                selectedFile={documentFile}
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <SelfieCapture
                onFileSelect={setSelfieFile}
                selectedFile={selfieFile}
                onNext={handleSubmitVerification}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 4 && (
              <div className="text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-semibold">Verificação enviada com sucesso!</h3>
                <p className="text-gray-600">
                  Analisaremos seus documentos em até 24 horas. Você receberá uma notificação quando a verificação for concluída.
                </p>
                <Button onClick={() => navigate('/freelancer/dashboard')} className="w-full">
                  Voltar ao Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Verification;
