import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { X, Crop as CropIcon, Wand2, RefreshCw } from 'lucide-react';

interface ImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onSave: (newImageUrl: string) => void;
}

export const ImageEditModal: React.FC<ImageEditModalProps> = ({ isOpen, onClose, imageUrl, onSave }) => {
  const [activeTab, setActiveTab] = useState<'crop' | 'ai'>('crop');
  
  // Crop state
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);

  // AI state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);

  // Disable body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCrop = async () => {
    if (!completedCrop || !imgRef.current) {
      toast.error('Please make a selection first');
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      // Upload cropped image to S3 to get a URL
      const formData = new FormData();
      formData.append('image', blob, 'cropped.png');
      
      toast.info('Saving cropped image...');
      try {
        const response = await apiClient.post<{ image_url: string }>('/api/generate/upload-image', formData);
        onSave(response.image_url);
        onClose();
        toast.success('Crop saved!');
      } catch (error) {
        toast.error('Failed to save cropped image');
      }
    }, 'image/png');
  };

  const handleAiTransform = async () => {
    if (!aiPrompt) {
      toast.error('Please enter a prompt for the AI');
      return;
    }
    
    setIsTransforming(true);
    toast.info('Applying AI transformations...');
    
    try {
      const response = await apiClient.post<{ success: boolean, content: string }>('/api/generate/edit-image', {
        image_url: imageUrl,
        prompt: aiPrompt
      });
      
      onSave(response.content);
      onClose();
      toast.success('AI Transform applied!');
    } catch (error) {
      toast.error('AI Transform failed');
    } finally {
      setIsTransforming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <GlassCard className="w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-glass/10 hover:bg-glass/20 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-6 border-b border-glass/10 flex gap-6">
          <button 
            onClick={() => setActiveTab('crop')}
            className={`flex items-center gap-2 font-display font-bold text-lg pb-2 transition-colors ${activeTab === 'crop' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <CropIcon size={20} /> Basic Edit
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 font-display font-bold text-lg pb-2 transition-colors ${activeTab === 'ai' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Wand2 size={20} /> AI Transform
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
          {/* Image Preview Area */}
          <div className="flex-1 flex items-center justify-center bg-black/20 rounded-xl overflow-hidden min-h-[300px]">
            {activeTab === 'crop' ? (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img 
                  ref={imgRef}
                  src={imageUrl} 
                  alt="Edit preview" 
                  className="max-h-[60vh] object-contain"
                  crossOrigin="anonymous"
                />
              </ReactCrop>
            ) : (
              <img 
                src={imageUrl} 
                alt="AI preview" 
                className="max-h-[60vh] object-contain"
              />
            )}
          </div>

          {/* Controls Area */}
          <div className="w-full md:w-80 flex flex-col gap-6 shrink-0">
            {activeTab === 'crop' ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold mb-2">Crop Image</h4>
                  <p className="text-sm text-muted-foreground">Drag on the image to select the area you want to keep.</p>
                </div>
                <Button onClick={handleSaveCrop} className="w-full">
                  Apply Crop
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold mb-2">AI Transform</h4>
                  <p className="text-sm text-muted-foreground">Describe how you want to change this image. (e.g., "Make it a painting", "Add snow")</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Transform Prompt</label>
                  <textarea 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe the changes..."
                    className="w-full h-32 bg-glass/5 border border-glass/10 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                  />
                </div>

                <Button 
                  onClick={handleAiTransform} 
                  disabled={isTransforming || !aiPrompt}
                  className="w-full"
                >
                  {isTransforming ? (
                    <><RefreshCw className="animate-spin mr-2" size={18} /> Transforming...</>
                  ) : (
                    <><Wand2 className="mr-2" size={18} /> Apply Transform</>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
