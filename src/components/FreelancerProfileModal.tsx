
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, Clock, Heart, UserPlus } from 'lucide-react';

interface FreelancerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  freelancer: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    skills: string[];
    city: string;
    lastActive: string;
    priceRange: string;
    available: boolean;
    completedEvents: number;
  } | null;
  onInvite: (freelancerId: string) => void;
  onToggleFavorite: (freelancerId: string) => void;
  isFavorite: boolean;
}

const FreelancerProfileModal: React.FC<FreelancerProfileModalProps> = ({
  isOpen,
  onClose,
  freelancer,
  onInvite,
  onToggleFavorite,
  isFavorite
}) => {
  if (!freelancer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Perfil do Freelancer</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl">{freelancer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">{freelancer.name}</h2>
                {freelancer.available && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Disponível
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{freelancer.rating}</span>
                  <span>({freelancer.reviewCount} avaliações)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{freelancer.city}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{freelancer.lastActive}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleFavorite(freelancer.id)}
                  className={isFavorite ? 'text-red-600' : ''}
                >
                  <Heart className={`w-4 h-4 mr-1 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                </Button>
                
                <Button size="sm" onClick={() => onInvite(freelancer.id)}>
                  <UserPlus className="w-4 h-4 mr-1" />
                  Convidar
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Skills */}
          <div>
            <h3 className="font-semibold mb-3">Habilidades</h3>
            <div className="flex flex-wrap gap-2">
              {freelancer.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Faixa de Preço</h4>
              <p className="text-lg font-semibold">{freelancer.priceRange}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Eventos Concluídos</h4>
              <p className="text-lg font-semibold">{freelancer.completedEvents}</p>
            </div>
          </div>

          <Separator />

          {/* About */}
          <div>
            <h3 className="font-semibold mb-3">Sobre</h3>
            <p className="text-gray-600">
              Freelancer experiente com foco em qualidade e pontualidade. 
              Já participei de diversos eventos e sempre busco superar as expectativas dos clientes.
              Tenho flexibilidade de horários e facilidade para trabalhar em equipe.
            </p>
          </div>

          {/* Reviews */}
          <div>
            <h3 className="font-semibold mb-3">Últimas Avaliações</h3>
            <div className="space-y-3">
              <div className="border rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">há 2 dias</span>
                </div>
                <p className="text-sm">"Excelente profissional! Muito pontual e dedicado."</p>
                <p className="text-xs text-gray-500 mt-1">- Cliente Anônimo</p>
              </div>
              
              <div className="border rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <Star className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-sm text-gray-500">há 1 semana</span>
                </div>
                <p className="text-sm">"Bom trabalho, mas poderia ser mais proativo."</p>
                <p className="text-xs text-gray-500 mt-1">- Cliente Anônimo</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FreelancerProfileModal;
