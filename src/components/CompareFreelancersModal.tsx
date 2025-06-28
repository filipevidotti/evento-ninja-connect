
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, Clock, UserPlus } from 'lucide-react';

interface FreelancerData {
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
}

interface CompareFreelancersModalProps {
  isOpen: boolean;
  onClose: () => void;
  freelancers: FreelancerData[];
  onInvite: (freelancerId: string) => void;
}

const CompareFreelancersModal: React.FC<CompareFreelancersModalProps> = ({
  isOpen,
  onClose,
  freelancers,
  onInvite
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comparar Freelancers ({freelancers.length})</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((freelancer) => (
            <div key={freelancer.id} className="border rounded-lg p-4 space-y-4">
              {/* Header */}
              <div className="text-center">
                <Avatar className="w-16 h-16 mx-auto mb-2">
                  <AvatarFallback className="text-lg">{freelancer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{freelancer.name}</h3>
                {freelancer.available && (
                  <Badge variant="default" className="bg-green-100 text-green-800 mt-1">
                    Disponível
                  </Badge>
                )}
              </div>

              <Separator />

              {/* Rating */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">Avaliação</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{freelancer.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({freelancer.reviewCount})</span>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">Localização</h4>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{freelancer.city}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">Habilidades</h4>
                <div className="flex flex-wrap gap-1">
                  {freelancer.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">Faixa de Preço</h4>
                <p className="font-semibold text-green-600">{freelancer.priceRange}</p>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">Experiência</h4>
                <p className="text-sm">{freelancer.completedEvents} eventos concluídos</p>
              </div>

              {/* Last Active */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">Última Atividade</h4>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{freelancer.lastActive}</span>
                </div>
              </div>

              <Separator />

              {/* Action Button */}
              <Button 
                className="w-full"
                size="sm"
                onClick={() => onInvite(freelancer.id)}
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Convidar
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar Comparação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompareFreelancersModal;
