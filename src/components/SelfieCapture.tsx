
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SelfieCaptureProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  onNext: () => void;
  onBack: () => void;
}

export const SelfieCapture: React.FC<SelfieCaptureProps> = ({
  onFileSelect,
  selectedFile,
  onNext,
  onBack
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione apenas imagens (JPG, PNG).",
        variant: "destructive"
      });
      return;
    }

    // Verificar tamanho do arquivo (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive"
      });
      return;
    }

    onFileSelect(file);
    
    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    onFileSelect(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        {!selectedFile ? (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Tire uma selfie</h3>
              <p className="text-gray-500">
                Uma foto sua para comparação com o documento
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Fazer Upload
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative inline-block">
              {preview && (
                <img
                  src={preview}
                  alt="Preview da selfie"
                  className="max-w-full max-h-64 rounded-lg shadow-md"
                />
              )}
              <button
                onClick={removeFile}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <strong>{selectedFile.name}</strong>
              <br />
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">Dicas para uma boa selfie:</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Mantenha o rosto bem iluminado</li>
          <li>• Olhe diretamente para a câmera</li>
          <li>• Não use óculos escuros ou chapéu</li>
          <li>• Mantenha uma expressão neutra</li>
          <li>• Certifique-se de que seu rosto esteja completamente visível</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Voltar
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedFile}
          className="flex-1"
        >
          Enviar Verificação
        </Button>
      </div>
    </div>
  );
};
