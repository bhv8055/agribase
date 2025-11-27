'use client';

import { useState, useRef, useCallback, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageClear: () => void;
  exampleImage: ImagePlaceholder;
  uploadHint: string;
}

export function ImageUpload({ onImageSelect, onImageClear, exampleImage, uploadHint }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };
  
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };
  
  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageClear();
  };
  
  const useExample = async () => {
    const response = await fetch(exampleImage.imageUrl);
    const blob = await response.blob();
    const file = new File([blob], `${exampleImage.id}.jpg`, { type: 'image/jpeg' });
    handleFileChange(file);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200",
              isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
            )}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
            {preview ? (
              <div className="relative aspect-square max-h-[300px] mx-auto">
                <Image src={preview} alt="Image preview" fill className="object-contain rounded-md" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-3 -right-3 rounded-full h-8 w-8"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear image</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <UploadCloud className="h-12 w-12" />
                <p className="font-semibold">{uploadHint}</p>
                <p className="text-sm">Drag & drop, or</p>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Browse Files
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center text-center gap-4">
            <p className="text-muted-foreground">Don't have an image? Try an example.</p>
            <div className="relative group w-48 h-48 rounded-lg overflow-hidden border">
              <Image 
                src={exampleImage.imageUrl} 
                alt={exampleImage.description} 
                fill 
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={exampleImage.imageHint}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button onClick={useExample} variant="secondary">
                  <ImageIcon className="mr-2 h-4 w-4" /> Use Example
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
