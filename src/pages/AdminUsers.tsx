import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Ban, 
  UserX,
  Mail,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserProfile {
  id: string;
  name: string;
  email?: string;
  user_type: 'freelancer' | 'producer';
  city: string;
  verificado: boolean;
  created_at: string;
  avatar_url?: string;
  phone?: string;
  rating?: number;
  total_reviews?: number;
  courses?: string[];
  other_knowledge?: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Mock data - no database dependencies
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers: UserProfile[] = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@email.com',
          user_type: 'freelancer',
          city: 'São Paulo',
          verificado: true,
          created_at: new Date().toISOString(),
          avatar_url: '/placeholder.svg',
          phone: '(11) 99999-9999',
          rating: 4.8,
          total_reviews: 25,
          courses: ['Fotografia', 'Edição de Vídeo']
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@email.com',
          user_type: 'producer',
          city: 'Rio de Janeiro',
          verificado: false,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          avatar_url: '/placeholder.svg',
          phone: '(21) 88888-8888'
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterType]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'verified' && user.verificado) ||
                         (filterStatus === 'unverified' && !user.verificado);

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (verified: boolean) => {
    if (verified) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verificado
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        Não Verificado
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSendNotification = (user: UserProfile) => {
    toast({
      title: "Notificação enviada",
      description: `Notificação enviada para ${user.name}`,
    });
  };

  const handleSuspendUser = (user: UserProfile) => {
    toast({
      title: "Usuário suspenso",
      description: `${user.name} foi suspenso temporariamente`,
      variant: "destructive"
    });
  };

  const handleBanUser = (user: UserProfile) => {
    toast({
      title: "Usuário banido",
      description: `${user.name} foi banido permanentemente`,
      variant: "destructive"
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
            Gestão de Usuários
          </h1>
          <p className="text-gray-600">
            Gerencie todos os usuários da plataforma
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="type">Tipo de Usuário</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                    <SelectItem value="producer">Produtor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="verified">Verificado</SelectItem>
                    <SelectItem value="unverified">Não Verificado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={fetchUsers} className="w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
            <CardDescription>
              Lista de todos os usuários cadastrados na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.avatar_url} alt={user.name} />
                          <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name || 'Nome não informado'}</div>
                          <div className="text-sm text-gray-500">{user.email || 'Email não disponível'}</div>
                          {user.rating && (
                            <div className="text-sm text-yellow-600">
                              ⭐ {user.rating.toFixed(1)} ({user.total_reviews} avaliações)
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.user_type === 'freelancer' ? 'default' : 'secondary'}>
                        {user.user_type === 'freelancer' ? 'Freelancer' : 'Produtor'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.verificado)}
                    </TableCell>
                    <TableCell>{user.city || 'Não informado'}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendNotification(user)}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSuspendUser(user)}
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleBanUser(user)}
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Detalhes do Usuário</CardTitle>
                <CardDescription>Informações completas de {selectedUser.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.name} />
                    <AvatarFallback className="text-lg">
                      {selectedUser.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    {getStatusBadge(selectedUser.verificado)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo de Usuário</Label>
                    <p className="font-medium">
                      {selectedUser.user_type === 'freelancer' ? 'Freelancer' : 'Produtor'}
                    </p>
                  </div>
                  <div>
                    <Label>Cidade</Label>
                    <p className="font-medium">{selectedUser.city || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label>Telefone</Label>
                    <p className="font-medium">{selectedUser.phone || 'Não informado'}</p>
                  </div>
                  <div>
                    <Label>Data de Cadastro</Label>
                    <p className="font-medium">{formatDate(selectedUser.created_at)}</p>
                  </div>
                </div>

                {selectedUser.user_type === 'freelancer' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Cursos</Label>
                      <p className="font-medium">
                        {selectedUser.courses && selectedUser.courses.length > 0 
                          ? selectedUser.courses.join(', ') 
                          : 'Nenhum curso informado'}
                      </p>
                    </div>
                    <div>
                      <Label>Outros Conhecimentos</Label>
                      <p className="font-medium">
                        {selectedUser.other_knowledge || 'Nenhum conhecimento adicional informado'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setSelectedUser(null)}>
                    Fechar
                  </Button>
                  <Button onClick={() => handleSendNotification(selectedUser)}>
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Notificação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
