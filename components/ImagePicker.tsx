
import React, { useRef } from 'react';

interface ImagePickerProps {
  onImageSelected: (base64: string) => void;
  selectedImage: string | null;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ onImageSelected, selectedImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {selectedImage ? (
        <div className="relative group rounded-2xl overflow-hidden border-2 border-pink-100 shadow-inner">
          <img src={selectedImage} alt="Preview" className="w-full aspect-square object-cover" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-medium transition-opacity"
          >
            Trocar Foto
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-square bg-pink-50 border-2 border-dashed border-pink-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-pink-100 transition-colors"
        >
          <span className="text-4xl">📸</span>
          <span className="text-pink-600 font-medium">Tirar Foto ou Galeria</span>
          <p className="text-xs text-pink-400 px-6 text-center">
            Escolha uma foto clara da sua peça com fundo simples
          </p>
        </button>
      )}
    </div>
  );
};

export default ImagePicker;
