import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { X, Crop as CropIcon, Wand2, RefreshCw, Type, Palette } from 'lucide-react';

interface ImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onSave: (newImageUrl: string) => void;
}

export const ImageEditModal: React.FC<ImageEditModalProps> = ({ isOpen, onClose, imageUrl, onSave }) => {
  const [activeTab, setActiveTab] = useState<'crop' | 'ai' | 'text'>('crop');
  
  // Crop state
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);

  // AI state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);

  // Text Overlay state
  const [textOverlay, setTextOverlay] = useState('New Launch!');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState(36);
  const [textX, setTextX] = useState(50);
  const [textY, setTextY] = useState(80);
  const [textBgColor, setTextBgColor] = useState('rgba(0,0,0,0.5)');
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [fontWeight, setFontWeight] = useState('bold');

  // Color Filter Adjustments state
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [hueRotate, setHueRotate] = useState(0);

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

  const handleSaveTextAndFilters = async () => {
    if (!imgRef.current) return;
    
    setIsTransforming(true);
    toast.info('Applying design changes...');

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsTransforming(false);
      return;
    }

    // 1. Apply image filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) hue-rotate(${hueRotate}deg)`;
    
    // 2. Draw the image with filters
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    // Reset filters for text rendering
    ctx.filter = 'none';

    // 3. Draw text overlay
    if (textOverlay.trim()) {
      const scaleFactor = image.naturalWidth / image.width;
      const naturalFontSize = textSize * scaleFactor;
      
      ctx.font = `${fontWeight} ${naturalFontSize}px ${fontFamily}`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const xPos = (textX / 100) * canvas.width;
      const yPos = (textY / 100) * canvas.height;

      // Draw background banner if set
      if (textBgColor !== 'transparent') {
        const textLines = textOverlay.split('\n');
        let maxWidth = 0;
        textLines.forEach(line => {
          const width = ctx.measureText(line).width;
          if (width > maxWidth) maxWidth = width;
        });

        const paddingX = 24 * scaleFactor;
        const paddingY = 16 * scaleFactor;
        const bannerHeight = (naturalFontSize * 1.2 * textLines.length) + (paddingY * 2);
        
        ctx.fillStyle = textBgColor;
        ctx.fillRect(
          xPos - maxWidth / 2 - paddingX,
          yPos - bannerHeight / 2,
          maxWidth + paddingX * 2,
          bannerHeight
        );
      }

      // Draw text lines
      ctx.fillStyle = textColor;
      const textLines = textOverlay.split('\n');
      const lineHeight = naturalFontSize * 1.2;
      const totalHeight = lineHeight * textLines.length;
      const startY = yPos - (totalHeight / 2) + (lineHeight / 2);

      textLines.forEach((line, index) => {
        ctx.fillText(line, xPos, startY + (index * lineHeight));
      });
    }

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setIsTransforming(false);
        return;
      }
      
      const formData = new FormData();
      formData.append('image', blob, 'edited_poster.png');
      
      try {
        const response = await apiClient.post<{ image_url: string }>('/api/generate/upload-image', formData);
        onSave(response.image_url);
        onClose();
        toast.success('Design updates saved!');
      } catch (error) {
        toast.error('Failed to save design updates');
      } finally {
        setIsTransforming(false);
      }
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <GlassCard className="w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden relative">
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
            <CropIcon size={20} /> Crop
          </button>
          <button 
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 font-display font-bold text-lg pb-2 transition-colors ${activeTab === 'text' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Type size={20} /> Text & Colors
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
          <div className="flex-1 flex items-center justify-center bg-black/20 rounded-xl overflow-hidden min-h-[300px] relative">
            {activeTab === 'crop' && (
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
            )}
            
            {activeTab === 'text' && (
              <div className="relative max-h-[60vh] flex items-center justify-center select-none">
                <img 
                  ref={imgRef}
                  src={imageUrl} 
                  alt="Text preview" 
                  className="max-h-[60vh] object-contain"
                  crossOrigin="anonymous"
                  style={{
                    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) hue-rotate(${hueRotate}deg)`
                  }}
                />
                <div 
                  className="absolute pointer-events-none text-center select-none whitespace-pre-line"
                  style={{
                    left: `${textX}%`,
                    top: `${textY}%`,
                    transform: 'translate(-50%, -50%)',
                    color: textColor,
                    fontSize: `${textSize}px`,
                    fontFamily: fontFamily,
                    fontWeight: fontWeight,
                    backgroundColor: textBgColor,
                    padding: textBgColor !== 'transparent' ? '6px 16px' : '0',
                    borderRadius: '8px',
                    lineHeight: '1.2',
                    maxWidth: '85%',
                    wordBreak: 'break-word',
                    boxShadow: textBgColor !== 'transparent' ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
                    textShadow: textBgColor === 'transparent' ? '1px 1px 4px rgba(0,0,0,0.8)' : 'none'
                  }}
                >
                  {textOverlay}
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <img 
                src={imageUrl} 
                alt="AI preview" 
                className="max-h-[60vh] object-contain"
              />
            )}
          </div>

          {/* Controls Area */}
          <div className="w-full md:w-80 flex flex-col gap-6 shrink-0 overflow-y-auto max-h-[65vh] pr-2">
            {activeTab === 'crop' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold mb-2">Crop Image</h4>
                  <p className="text-sm text-muted-foreground">Drag on the image to select the area you want to keep.</p>
                </div>
                <Button onClick={handleSaveCrop} className="w-full">
                  Apply Crop
                </Button>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold mb-2">Text & Colors</h4>
                  <p className="text-sm text-muted-foreground">Customize text overlays and adjust the colors of your poster.</p>
                </div>

                {/* Text Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Text Content</label>
                  <textarea 
                    value={textOverlay}
                    onChange={(e) => setTextOverlay(e.target.value)}
                    placeholder="Enter poster text..."
                    rows={2}
                    className="w-full bg-glass/5 border border-glass/10 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                  />
                </div>

                {/* Font Customization */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Font Family</label>
                    <select 
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full bg-glass/5 border border-glass/10 rounded-xl p-2 text-xs outline-none focus:ring-1 focus:ring-primary/50"
                    >
                      <option value="sans-serif">Sans Serif</option>
                      <option value="serif">Elegant Serif</option>
                      <option value="monospace">Monospace</option>
                      <option value="cursive">Script / Cursive</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Font Weight</label>
                    <select 
                      value={fontWeight}
                      onChange={(e) => setFontWeight(e.target.value)}
                      className="w-full bg-glass/5 border border-glass/10 rounded-xl p-2 text-xs outline-none focus:ring-1 focus:ring-primary/50"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="bolder">Extra Bold</option>
                    </select>
                  </div>
                </div>

                {/* Sliders for Size & Position */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Text Size</span>
                      <span>{textSize}px</span>
                    </div>
                    <input 
                      type="range" min="12" max="100" value={textSize} 
                      onChange={(e) => setTextSize(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Horizontal Pos (X)</span>
                      <span>{textX}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={textX} 
                      onChange={(e) => setTextX(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Vertical Pos (Y)</span>
                      <span>{textY}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={textY} 
                      onChange={(e) => setTextY(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" value={textColor} 
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-8 h-8 rounded-full border-0 cursor-pointer overflow-hidden"
                      />
                      <div className="flex gap-1.5">
                        {['#ffffff', '#000000', '#facc15', '#ef4444', '#3b82f6', '#22c55e'].map(c => (
                          <button 
                            key={c} onClick={() => setTextColor(c)}
                            className="w-5 h-5 rounded-full border border-white/20"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Background Banner</label>
                    <select 
                      value={textBgColor}
                      onChange={(e) => setTextBgColor(e.target.value)}
                      className="w-full bg-glass/5 border border-glass/10 rounded-xl p-2 text-xs outline-none focus:ring-1 focus:ring-primary/50"
                    >
                      <option value="transparent">None (Text Shadow Only)</option>
                      <option value="rgba(0,0,0,0.5)">Dark Semi-Transparent</option>
                      <option value="rgba(0,0,0,0.85)">Dark Solid</option>
                      <option value="rgba(255,255,255,0.6)">Light Semi-Transparent</option>
                      <option value="rgba(255,255,255,0.9)">Light Solid</option>
                    </select>
                  </div>
                </div>

                {/* Separator */}
                <hr className="border-glass/10 my-4" />

                {/* Image Filters Section */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Adjust Image Colors</h5>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Hue (Change Colors)</span>
                      <span>{hueRotate}°</span>
                    </div>
                    <input 
                      type="range" min="0" max="360" value={hueRotate} 
                      onChange={(e) => setHueRotate(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Brightness</span>
                      <span>{brightness}%</span>
                    </div>
                    <input 
                      type="range" min="50" max="150" value={brightness} 
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Contrast</span>
                      <span>{contrast}%</span>
                    </div>
                    <input 
                      type="range" min="50" max="150" value={contrast} 
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Saturation</span>
                      <span>{saturate}%</span>
                    </div>
                    <input 
                      type="range" min="50" max="200" value={saturate} 
                      onChange={(e) => setSaturate(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <Button 
                  onClick={handleSaveTextAndFilters}
                  disabled={isTransforming}
                  className="w-full mt-4"
                >
                  {isTransforming ? (
                    <><RefreshCw className="animate-spin mr-2" size={18} /> Saving...</>
                  ) : (
                    <><Palette className="mr-2" size={18} /> Save Design</>
                  )}
                </Button>
              </div>
            )}

            {activeTab === 'ai' && (
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
