
import React from 'react';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items, showBackButton = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center space-x-2 py-2 px-4 bg-gray-50 border-b">
      {showBackButton && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Button>
      )}
      
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {index === items.length - 1 ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    onClick={() => item.path && navigate(item.path)}
                    className="cursor-pointer hover:text-blue-600"
                  >
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < items.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbNav;
