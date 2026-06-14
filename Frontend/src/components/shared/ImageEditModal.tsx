import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { GlassCard } from './GlassCard';
import { Button } from './Button';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { 
  X, 
  Crop as CropIcon, 
  Wand2, 
  RefreshCw, 
  Type, 
  Palette, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  RotateCcw, 
  Bold, 
  Italic, 
  Move,
  Layers
} from 'lucide-react';

interface ImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  brandColors?: string[];
  onSave: (newImageUrl: string) => void;
}

export const ImageEditModal: React.FC<ImageEditModalProps> = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  brandColors = [], 
  onSave 
}) => {
  const [activeTab, setActiveTab] = useState<'crop' | 'ai' | 'text'>('crop');
  const [activeLayer, setActiveLayer] = useState<'header' | 'subtitle'>('header');
  
  // Crop state
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);

  // AI state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);

  // --- LAYER 1: HEADER STATE ---
  const [headerText, setHeaderText] = useState('SEASON SALE');
  const [headerColor, setHeaderColor] = useState('#ffffff');
  const [headerSize, setHeaderSize] = useState(38);
  const [headerX, setHeaderX] = useState(50);
  const [headerY, setHeaderY] = useState(40);
  const [headerBgColor, setHeaderBgColor] = useState('transparent');
  const [headerFontFamily, setHeaderFontFamily] = useState('system-ui, sans-serif');
  const [headerFontWeight, setHeaderFontWeight] = useState('bold');
  const [headerItalic, setHeaderItalic] = useState(false);
  const [headerUppercase, setHeaderUppercase] = useState(true);
  const [headerAlign, setHeaderAlign] = useState<'left' | 'center' | 'right'>('center');
  const [headerRotation, setHeaderRotation] = useState(0);

  // --- LAYER 2: SUBTITLE / CALL TO ACTION STATE ---
  const [subtitleText, setSubtitleText] = useState('UP TO 50% OFF ALL ITEMS');
  const [subtitleColor, setSubtitleColor] = useState('#facc15');
  const [subtitleSize, setSubtitleSize] = useState(20);
  const [subtitleX, setSubtitleX] = useState(50);
  const [subtitleY, setSubtitleY] = useState(60);
  const [subtitleBgColor, setSubtitleBgColor] = useState('rgba(0,0,0,0.5)');
  const [subtitleFontFamily, setSubtitleFontFamily] = useState('system-ui, sans-serif');
  const [subtitleFontWeight, setSubtitleFontWeight] = useState('normal');
  const [subtitleItalic, setSubtitleItalic] = useState(false);
  const [subtitleUppercase, setSubtitleUppercase] = useState(true);
  const [subtitleAlign, setSubtitleAlign] = useState<'left' | 'center' | 'right'>('center');
  const [subtitleRotation, setSubtitleRotation] = useState(0);

  // Drag state for text overlays
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringText, setIsHoveringText] = useState(false);

  // Color Filter Adjustments state
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [hueRotate, setHueRotate] = useState(0);
  const [blur, setBlur] = useState(0);

  // Disable body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle dragging logic relative to the active layer
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const clampedX = Math.max(0, Math.min(100, Math.round(x)));
      const clampedY = Math.max(0, Math.min(100, Math.round(y)));

      if (activeLayer === 'header') {
        setHeaderX(clampedX);
        setHeaderY(clampedY);
      } else {
        setSubtitleX(clampedX);
        setSubtitleY(clampedY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, activeLayer]);

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
    const scaleFactor = image.naturalWidth / image.width;
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) hue-rotate(${hueRotate}deg) blur(${blur * scaleFactor}px)`;
    
    // 2. Draw the image with filters
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    // Reset filters for text rendering
    ctx.filter = 'none';

    // 3. Draw text overlays helper
    const drawTextLayer = (
      text: string,
      x: number,
      y: number,
      size: number,
      color: string,
      bgColor: string,
      font: string,
      weight: string,
      italic: boolean,
      uppercase: boolean,
      align: 'left' | 'center' | 'right',
      rotation: number
    ) => {
      const rawText = text.trim();
      if (!rawText) return;

      const displayText = uppercase ? rawText.toUpperCase() : rawText;
      const naturalFontSize = size * scaleFactor;
      const italicPrefix = italic ? 'italic ' : '';

      ctx.save();

      const xPos = (x / 100) * canvas.width;
      const yPos = (y / 100) * canvas.height;

      // Position canvas context for rotation
      ctx.translate(xPos, yPos);
      ctx.rotate((rotation * Math.PI) / 180);

      ctx.font = `${italicPrefix}${weight} ${naturalFontSize}px ${font}`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';

      const textLines = displayText.split('\n');
      let maxWidth = 0;
      textLines.forEach(line => {
        const width = ctx.measureText(line).width;
        if (width > maxWidth) maxWidth = width;
      });

      const paddingX = 24 * scaleFactor;
      const paddingY = 16 * scaleFactor;
      const lineHeight = naturalFontSize * 1.25;
      const bannerHeight = (lineHeight * textLines.length) + (paddingY * 2);

      let startX = 0;
      if (align === 'center') {
        startX = -maxWidth / 2;
      } else if (align === 'right') {
        startX = -maxWidth;
      }

      // Draw background banner if set
      if (bgColor !== 'transparent') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(
          startX - paddingX,
          - (lineHeight * textLines.length) / 2 - paddingY,
          maxWidth + paddingX * 2,
          bannerHeight
        );
      }

      // Draw text lines
      ctx.fillStyle = color;
      const totalHeight = lineHeight * textLines.length;
      const startY = - (totalHeight / 2) + (lineHeight / 2);

      textLines.forEach((line, index) => {
        ctx.fillText(line, 0, startY + (index * lineHeight));
      });

      ctx.restore();
    };

    // Draw Header layer
    drawTextLayer(
      headerText,
      headerX,
      headerY,
      headerSize,
      headerColor,
      headerBgColor,
      headerFontFamily,
      headerFontWeight,
      headerItalic,
      headerUppercase,
      headerAlign,
      headerRotation
    );

    // Draw Subtitle layer
    drawTextLayer(
      subtitleText,
      subtitleX,
      subtitleY,
      subtitleSize,
      subtitleColor,
      subtitleBgColor,
      subtitleFontFamily,
      subtitleFontWeight,
      subtitleItalic,
      subtitleUppercase,
      subtitleAlign,
      subtitleRotation
    );

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

  const handleResetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
    setHueRotate(0);
    setBlur(0);
    toast.success('Filters reset to default');
  };

  // Active layer settings mapped to dynamic components
  const layerText = activeLayer === 'header' ? headerText : subtitleText;
  const setLayerText = activeLayer === 'header' ? setHeaderText : setSubtitleText;
  const layerColor = activeLayer === 'header' ? headerColor : subtitleColor;
  const setLayerColor = activeLayer === 'header' ? setHeaderColor : setSubtitleColor;
  const layerSize = activeLayer === 'header' ? headerSize : subtitleSize;
  const setLayerSize = activeLayer === 'header' ? setHeaderSize : setSubtitleSize;
  const layerBgColor = activeLayer === 'header' ? headerBgColor : subtitleBgColor;
  const setLayerBgColor = activeLayer === 'header' ? setHeaderBgColor : setSubtitleBgColor;
  const layerFontFamily = activeLayer === 'header' ? headerFontFamily : subtitleFontFamily;
  const setLayerFontFamily = activeLayer === 'header' ? setHeaderFontFamily : setSubtitleFontFamily;
  const layerFontWeight = activeLayer === 'header' ? headerFontWeight : subtitleFontWeight;
  const setLayerFontWeight = activeLayer === 'header' ? setHeaderFontWeight : setSubtitleFontWeight;
  const layerItalic = activeLayer === 'header' ? headerItalic : subtitleItalic;
  const setLayerItalic = activeLayer === 'header' ? setHeaderItalic : setSubtitleItalic;
  const layerUppercase = activeLayer === 'header' ? headerUppercase : subtitleUppercase;
  const setLayerUppercase = activeLayer === 'header' ? setHeaderUppercase : setSubtitleUppercase;
  const layerAlign = activeLayer === 'header' ? headerAlign : subtitleAlign;
  const setLayerAlign = activeLayer === 'header' ? setHeaderAlign : setSubtitleAlign;
  const layerRotation = activeLayer === 'header' ? headerRotation : subtitleRotation;
  const setLayerRotation = activeLayer === 'header' ? setHeaderRotation : setSubtitleRotation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <GlassCard className="w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden relative">
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
            <Type size={20} /> Professional Editor
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 font-display font-bold text-lg pb-2 transition-colors ${activeTab === 'ai' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Wand2 size={20} /> AI Transform
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-8">
          {/* Image Preview Area */}
          <div className="flex-1 flex items-center justify-center bg-black/20 rounded-2xl overflow-hidden min-h-[400px] relative p-4 border border-glass/10">
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
                  className="max-h-[65vh] object-contain rounded-lg"
                  crossOrigin="anonymous"
                />
              </ReactCrop>
            )}
            
            {activeTab === 'text' && (
              <div 
                ref={containerRef}
                className="relative max-h-[65vh] flex items-center justify-center select-none"
              >
                <img 
                  ref={imgRef}
                  src={imageUrl} 
                  alt="Text preview" 
                  className="max-h-[65vh] object-contain rounded-lg shadow-2xl"
                  crossOrigin="anonymous"
                  style={{
                    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) hue-rotate(${hueRotate}deg) blur(${blur}px)`
                  }}
                />
                
                {/* Drag Instructions overlay */}
                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-white/75 font-mono flex items-center gap-1.5 pointer-events-none">
                  <Move size={10} /> Active: <span className="text-primary font-bold uppercase">{activeLayer}</span> (Drag on image to move)
                </div>

                {/* Layer 1: Header Preview */}
                {headerText.trim() && (
                  <div 
                    onMouseDown={(e) => {
                      setActiveLayer('header');
                      handleMouseDown(e);
                    }}
                    onMouseEnter={() => setIsHoveringText(true)}
                    onMouseLeave={() => setIsHoveringText(false)}
                    className={`absolute select-none whitespace-pre-line cursor-move transition-all duration-200 ${
                      activeLayer === 'header' ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    style={{
                      left: `${headerX}%`,
                      top: `${headerY}%`,
                      transform: headerAlign === 'center' 
                        ? `translate(-50%, -50%) rotate(${headerRotation}deg)` 
                        : headerAlign === 'left' 
                          ? `translate(0%, -50%) rotate(${headerRotation}deg)` 
                          : `translate(-100%, -50%) rotate(${headerRotation}deg)`,
                      transformOrigin: headerAlign === 'center' ? 'center center' : headerAlign === 'left' ? 'left center' : 'right center',
                      textAlign: headerAlign,
                      color: headerColor,
                      fontSize: `${headerSize}px`,
                      fontFamily: headerFontFamily,
                      fontWeight: headerFontWeight,
                      fontStyle: headerItalic ? 'italic' : 'normal',
                      backgroundColor: headerBgColor,
                      padding: headerBgColor !== 'transparent' ? '8px 20px' : '4px',
                      borderRadius: '8px',
                      lineHeight: '1.25',
                      maxWidth: '85%',
                      wordBreak: 'break-word',
                      outline: activeLayer === 'header' ? '1px dashed #3b82f6' : (isHoveringText ? '1px dashed #3b82f6' : 'none'),
                      outlineOffset: '4px',
                      boxShadow: headerBgColor !== 'transparent' ? '0 8px 24px rgba(0,0,0,0.4)' : 'none',
                      textShadow: headerBgColor === 'transparent' ? '1px 1px 6px rgba(0,0,0,0.9)' : 'none'
                    }}
                  >
                    {headerUppercase ? headerText.toUpperCase() : headerText}
                  </div>
                )}

                {/* Layer 2: Subtitle Preview */}
                {subtitleText.trim() && (
                  <div 
                    onMouseDown={(e) => {
                      setActiveLayer('subtitle');
                      handleMouseDown(e);
                    }}
                    onMouseEnter={() => setIsHoveringText(true)}
                    onMouseLeave={() => setIsHoveringText(false)}
                    className={`absolute select-none whitespace-pre-line cursor-move transition-all duration-200 ${
                      activeLayer === 'subtitle' ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    style={{
                      left: `${subtitleX}%`,
                      top: `${subtitleY}%`,
                      transform: subtitleAlign === 'center' 
                        ? `translate(-50%, -50%) rotate(${subtitleRotation}deg)` 
                        : subtitleAlign === 'left' 
                          ? `translate(0%, -50%) rotate(${subtitleRotation}deg)` 
                          : `translate(-100%, -50%) rotate(${subtitleRotation}deg)`,
                      transformOrigin: subtitleAlign === 'center' ? 'center center' : subtitleAlign === 'left' ? 'left center' : 'right center',
                      textAlign: subtitleAlign,
                      color: subtitleColor,
                      fontSize: `${subtitleSize}px`,
                      fontFamily: subtitleFontFamily,
                      fontWeight: subtitleFontWeight,
                      fontStyle: subtitleItalic ? 'italic' : 'normal',
                      backgroundColor: subtitleBgColor,
                      padding: subtitleBgColor !== 'transparent' ? '8px 20px' : '4px',
                      borderRadius: '8px',
                      lineHeight: '1.25',
                      maxWidth: '85%',
                      wordBreak: 'break-word',
                      outline: activeLayer === 'subtitle' ? '1px dashed #3b82f6' : (isHoveringText ? '1px dashed #3b82f6' : 'none'),
                      outlineOffset: '4px',
                      boxShadow: subtitleBgColor !== 'transparent' ? '0 8px 24px rgba(0,0,0,0.4)' : 'none',
                      textShadow: subtitleBgColor === 'transparent' ? '1px 1px 6px rgba(0,0,0,0.9)' : 'none'
                    }}
                  >
                    {subtitleUppercase ? subtitleText.toUpperCase() : subtitleText}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ai' && (
              <img 
                src={imageUrl} 
                alt="AI preview" 
                className="max-h-[65vh] object-contain rounded-lg"
              />
            )}
          </div>

          {/* Controls Area */}
          <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 overflow-y-auto max-h-[70vh] pr-2">
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
                  <h4 className="font-bold mb-1 text-primary">Poster Studio</h4>
                  <p className="text-[11px] text-muted-foreground">Add text, format typography, and grade colors.</p>
                </div>

                {/* Layer Selector */}
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-1"><Layers size={10} /> Active Layer</label>
                  <div className="grid grid-cols-2 gap-2 bg-glass/5 rounded-xl border border-glass/10 p-1">
                    <button
                      onClick={() => setActiveLayer('header')}
                      className={`py-1.5 text-xs rounded-lg transition-colors font-bold ${activeLayer === 'header' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Title Layer
                    </button>
                    <button
                      onClick={() => setActiveLayer('subtitle')}
                      className={`py-1.5 text-xs rounded-lg transition-colors font-bold ${activeLayer === 'subtitle' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Subtitle Layer
                    </button>
                  </div>
                </div>

                {/* Active Layer Customizations */}
                <div className="space-y-4 p-4 rounded-xl border border-glass/5 bg-glass/2">
                  <div className="flex justify-between items-center pb-2 border-b border-glass/5">
                    <span className="text-xs font-bold capitalize text-primary">{activeLayer} Text Settings</span>
                  </div>

                  {/* Text Content */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Text Content</label>
                    <textarea 
                      value={layerText}
                      onChange={(e) => setLayerText(e.target.value)}
                      placeholder={`Enter ${activeLayer} text...`}
                      rows={2}
                      className="w-full bg-glass/5 border border-glass/10 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                    />
                  </div>

                  {/* Formatting Controls */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Alignment & Formatting</label>
                    <div className="flex gap-2">
                      <div className="flex bg-glass/5 rounded-xl border border-glass/10 p-1">
                        <button 
                          onClick={() => setLayerAlign('left')}
                          className={`p-1.5 rounded-lg transition-colors ${layerAlign === 'left' ? 'bg-primary text-primary-foreground' : 'hover:bg-glass/10'}`}
                        >
                          <AlignLeft size={14} />
                        </button>
                        <button 
                          onClick={() => setLayerAlign('center')}
                          className={`p-1.5 rounded-lg transition-colors ${layerAlign === 'center' ? 'bg-primary text-primary-foreground' : 'hover:bg-glass/10'}`}
                        >
                          <AlignCenter size={14} />
                        </button>
                        <button 
                          onClick={() => setLayerAlign('right')}
                          className={`p-1.5 rounded-lg transition-colors ${layerAlign === 'right' ? 'bg-primary text-primary-foreground' : 'hover:bg-glass/10'}`}
                        >
                          <AlignRight size={14} />
                        </button>
                      </div>

                      <div className="flex bg-glass/5 rounded-xl border border-glass/10 p-1 flex-1 justify-around items-center">
                        <button 
                          onClick={() => setLayerFontWeight(prev => prev === 'bold' ? 'normal' : 'bold')}
                          className={`p-1.5 rounded-lg transition-colors ${layerFontWeight === 'bold' ? 'bg-primary text-primary-foreground' : 'hover:bg-glass/10'}`}
                        >
                          <Bold size={14} />
                        </button>
                        <button 
                          onClick={() => setLayerItalic(prev => !prev)}
                          className={`p-1.5 rounded-lg transition-colors ${layerItalic ? 'bg-primary text-primary-foreground' : 'hover:bg-glass/10'}`}
                        >
                          <Italic size={14} />
                        </button>
                        <button 
                          onClick={() => setLayerUppercase(prev => !prev)}
                          className={`text-[10px] font-bold rounded-lg transition-colors px-2 ${layerUppercase ? 'bg-primary text-primary-foreground' : 'hover:bg-glass/10 text-muted-foreground'}`}
                        >
                          aA
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Brand Font Family */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Font Family</label>
                    <select 
                      value={layerFontFamily}
                      onChange={(e) => setLayerFontFamily(e.target.value)}
                      className="w-full bg-glass/5 border border-glass/10 rounded-xl p-2 text-xs outline-none focus:ring-1 focus:ring-primary/50"
                    >
                      <option value="system-ui, sans-serif">Modern Sans-Serif</option>
                      <option value="'Playfair Display', Georgia, serif">Classic Serif (Editorial)</option>
                      <option value="'Montserrat', sans-serif">Montserrat (Geometric Sans)</option>
                      <option value="'Cinzel', Times, serif">Cinzel (Luxury & Elegant)</option>
                      <option value="'Courier New', monospace">Courier (Minimalist Tech)</option>
                      <option value="'Brush Script MT', cursive">Script / Cursive</option>
                    </select>
                  </div>

                  {/* Sliders for Size and Rotation */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Size</span>
                        <span className="font-mono text-[10px]">{layerSize}px</span>
                      </div>
                      <input 
                        type="range" min="10" max="100" value={layerSize} 
                        onChange={(e) => setLayerSize(Number(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Angle Rotation</span>
                        <span className="font-mono text-[10px]">{layerRotation}°</span>
                      </div>
                      <input 
                        type="range" min="-180" max="180" value={layerRotation} 
                        onChange={(e) => setLayerRotation(Number(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>

                  {/* Text Color / Brand Palette Selection */}
                  <div className="space-y-3">
                    {brandColors.length > 0 && (
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                          <Palette size={10} className="text-primary" /> Brand Palette
                        </label>
                        <div className="flex gap-1.5 flex-wrap">
                          {brandColors.map(c => (
                            <button 
                              key={c} onClick={() => setLayerColor(c)}
                              className="w-6 h-6 rounded-full border border-white/20 transition-transform active:scale-90"
                              style={{ backgroundColor: c }}
                              title="Sync with Brand Colors"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Custom Color</label>
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full border border-glass/20 overflow-hidden shrink-0">
                          <input 
                            type="color" value={layerColor} 
                            onChange={(e) => setLayerColor(e.target.value)}
                            className="absolute inset-0 w-12 h-12 -translate-x-2 -translate-y-2 border-0 cursor-pointer"
                          />
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {['#ffffff', '#000000', '#facc15', '#ef4444', '#3b82f6', '#22c55e'].map(c => (
                            <button 
                              key={c} onClick={() => setLayerColor(c)}
                              className="w-5 h-5 rounded-full border border-white/20 transition-transform active:scale-90"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Text Frame</label>
                      <select 
                        value={layerBgColor}
                        onChange={(e) => setLayerBgColor(e.target.value)}
                        className="w-full bg-glass/5 border border-glass/10 rounded-xl p-2 text-xs outline-none focus:ring-1 focus:ring-primary/50"
                      >
                        <option value="transparent">None (Transparent / Outline Glow)</option>
                        <option value="rgba(0,0,0,0.5)">Matte Dark (Default)</option>
                        <option value="rgba(0,0,0,0.85)">Solid Cinematic Black</option>
                        <option value="rgba(255,255,255,0.45)">Matte Light</option>
                        <option value="rgba(255,255,255,0.85)">Solid White</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Separator */}
                <hr className="border-glass/10 my-4" />

                {/* Color Adjustments */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h5 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Color Grading & Filters</h5>
                    <button 
                      onClick={handleResetFilters}
                      className="text-[10px] text-primary flex items-center gap-1 hover:underline"
                    >
                      <RotateCcw size={10} /> Reset All
                    </button>
                  </div>
                  
                  {/* Hue shift with color gradient */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Color Tone Shift (Hue)</span>
                      <span className="font-mono text-[10px]">{hueRotate}°</span>
                    </div>
                    <input 
                      type="range" min="0" max="360" value={hueRotate} 
                      onChange={(e) => setHueRotate(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer outline-none transition-all"
                      style={{
                        background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Exposure (Brightness)</span>
                      <span className="font-mono text-[10px]">{brightness}%</span>
                    </div>
                    <input 
                      type="range" min="50" max="150" value={brightness} 
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Contrast Balance</span>
                      <span className="font-mono text-[10px]">{contrast}%</span>
                    </div>
                    <input 
                      type="range" min="50" max="150" value={contrast} 
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Color Saturation</span>
                      <span className="font-mono text-[10px]">{saturate}%</span>
                    </div>
                    <input 
                      type="range" min="50" max="200" value={saturate} 
                      onChange={(e) => setSaturate(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Atmosphere Blur</span>
                      <span className="font-mono text-[10px]">{blur}px</span>
                    </div>
                    <input 
                      type="range" min="0" max="10" value={blur} 
                      onChange={(e) => setBlur(Number(e.target.value))}
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
                    <><RefreshCw className="animate-spin mr-2" size={18} /> Processing...</>
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
