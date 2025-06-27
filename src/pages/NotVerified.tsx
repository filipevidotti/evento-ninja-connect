
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle2, Camera, Upload, Send, ArrowLeft } from 'lucide-react';
import FreelancerHeader from '@/components/FreelancerHeader';

const NotVerified = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Upload,
      title: 'Escolha o documento',
      description: 'Selecione entre RG, CNH ou Passaporte'
    },
    {
      icon: Camera,
      title: 'Foto do documento',
      description: 'Tire uma foto clara do documento escolhido'
    },
    {
      icon: Camera,
      title: 'Selfie',
      description: 'Tire uma selfie para comparação'
    },
    {
      icon: Send,
      title: 'Enviar para aprovação',
      description: 'Aguarde a análise em até 24 horas'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <FreelancerHeader />
      
      <div className="max-w-4xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/freelancer/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verificação de Identidade Necessária
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Para garantir a segurança da plataforma e dos usuários, você precisa verificar sua identidade 
            antes de se candidatar a eventos.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Benefícios da Verificação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Maior confiança</h4>
                  <p className="text-sm text-gray-600">Organizadores preferem freelancers verificados</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Acesso completo</h4>
                  <p className="text-sm text-gray-600">Candidature-se a todos os eventos disponíveis</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Perfil destacado</h4>
                  <p className="text-sm text-gray-600">Seu perfil aparece com selo de verificado</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Processo rápido</h4>
                  <p className="text-sm text-gray-600">Análise em até 24 horas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Como funciona a verificação</CardTitle>
            <CardDescription>
              Processo simples em 4 etapas para verificar sua identidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <step.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="font-medium mb-1">Etapa {index + 1}</div>
                  <h4 className="font-medium text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/verification')}
            size="lg"
            className="px-8"
          >
            Iniciar Verificação
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Seus dados estão seguros e são utilizados apenas para verificação
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotVerified;
