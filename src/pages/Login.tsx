
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Briefcase, Mail, Lock, MapPin, Phone, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '', type: 'freelancer' as 'freelancer' | 'producer' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    type: 'freelancer' as 'freelancer' | 'producer',
    city: '',
    phone: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailNotConfirmed, setShowEmailNotConfirmed] = useState(false);
  const [emailToConfirm, setEmailToConfirm] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setShowEmailNotConfirmed(false);
    
    try {
      await login(loginData.email, loginData.password, loginData.type);
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a) ${loginData.type === 'freelancer' ? 'freelancer' : 'produtor'}!`
      });
      
      // Navigate based on user type
      navigate(loginData.type === 'freelancer' ? '/freelancer/dashboard' : '/producer/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error?.message?.includes('Email not confirmed')) {
        setEmailToConfirm(loginData.email);
        setShowEmailNotConfirmed(true);
        toast({
          title: "Email não confirmado",
          description: "Você precisa confirmar seu email antes de fazer login. Verifique sua caixa de entrada.",
          variant: "destructive"
        });
      } else if (error?.message?.includes('Invalid login credentials') || error?.code === 'invalid_credentials') {
        toast({
          title: "Credenciais inválidas",
          description: "Email ou senha incorretos. Verifique suas informações.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro no login",
          description: "Ocorreu um erro inesperado. Tente novamente.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.city) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (registerData.password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await register(registerData);
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar sua conta antes de fazer login."
      });
      
      setEmailToConfirm(registerData.email);
      setShowEmailNotConfirmed(true);
      
      // Reset form
      setRegisterData({
        name: '',
        email: '',
        password: '',
        type: 'freelancer',
        city: '',
        phone: '',
        description: ''
      });
    } catch (error: any) {
      console.error('Register error:', error);
      
      if (error?.message?.includes('User already registered')) {
        toast({
          title: "Email já cadastrado",
          description: "Este email já está registrado. Tente fazer login ou use outro email.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro no cadastro",
          description: "Ocorreu um erro ao criar sua conta. Tente novamente.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!emailToConfirm) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailToConfirm,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      toast({
        title: "Email reenviado!",
        description: "Verifique sua caixa de entrada para confirmar sua conta."
      });
    } catch (error) {
      console.error('Resend error:', error);
      toast({
        title: "Erro ao reenviar email",
        description: "Não foi possível reenviar o email de confirmação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EventConnect
          </h1>
          <p className="text-gray-600 mt-2">Conectando talentos aos melhores eventos</p>
        </div>

        {showEmailNotConfirmed && (
          <Card className="mb-4 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm text-orange-800 font-medium">
                    Email não confirmado
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    Verifique sua caixa de entrada e clique no link de confirmação.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleResendConfirmation}
                variant="outline"
                size="sm"
                className="mt-3 w-full text-orange-700 border-orange-300 hover:bg-orange-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reenviando...
                  </>
                ) : (
                  'Reenviar email de confirmação'
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Acesse sua conta</CardTitle>
            <CardDescription className="text-center">
              Entre como freelancer ou produtor de eventos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Button
                      type="button"
                      variant={loginData.type === 'freelancer' ? 'default' : 'outline'}
                      onClick={() => setLoginData({ ...loginData, type: 'freelancer' })}
                      className="flex items-center gap-2"
                      disabled={isLoading}
                    >
                      <User className="w-4 h-4" />
                      Freelancer
                    </Button>
                    <Button
                      type="button"
                      variant={loginData.type === 'producer' ? 'default' : 'outline'}
                      onClick={() => setLoginData({ ...loginData, type: 'producer' })}
                      className="flex items-center gap-2"
                      disabled={isLoading}
                    >
                      <Briefcase className="w-4 h-4" />
                      Produtor
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Button
                      type="button"
                      variant={registerData.type === 'freelancer' ? 'default' : 'outline'}
                      onClick={() => setRegisterData({ ...registerData, type: 'freelancer' })}
                      className="flex items-center gap-2"
                      disabled={isLoading}
                    >
                      <User className="w-4 h-4" />
                      Freelancer
                    </Button>
                    <Button
                      type="button"
                      variant={registerData.type === 'producer' ? 'default' : 'outline'}
                      onClick={() => setRegisterData({ ...registerData, type: 'producer' })}
                      className="flex items-center gap-2"
                      disabled={isLoading}
                    >
                      <Briefcase className="w-4 h-4" />
                      Produtor
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="city"
                          placeholder="São Paulo"
                          className="pl-10"
                          value={registerData.city}
                          onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">E-mail *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Senha *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          required
                          disabled={isLoading}
                          minLength={6}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          placeholder="(11) 99999-9999"
                          className="pl-10"
                          value={registerData.phone}
                          onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      'Criar conta'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
