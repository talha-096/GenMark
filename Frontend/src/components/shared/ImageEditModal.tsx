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
  Move 
} from 'lucide-react';

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
  const [textOverlay, setTextOverlay] = useState('SEASON SALE\n50% OFF');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState(36);
  const [textX, setTextX] = useState(50);
  const [textY, setTextY] = useState(50);
  const [textBgColor, setTextBgColor] = useState('rgba(0,0,0,0.4)');
  const [fontFamily, setFontFamily] = useState('system-ui, sans-serif');
  const [fontWeight, setFontWeight] = useState('bold');
  const [isItalic, setIsItalic] = useState(false);
  const [isUppercase, setIsUppercase] = useState(true);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');

  // Drag state for text overlay
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringText, setIsHoveringText] = useState(false);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle dragging logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setTextX(Math.max(0, Math.min(100, Math.round(x))));
      setTextY(Math.max(0, Math.min(100, Math.round(y))));
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
  }, [isDragging]);

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
    const rawText = textOverlay.trim();
    if (rawText) {
      const displayText = isUppercase ? rawText.toUpperCase() : rawText;
      const scaleFactor = image.naturalWidth / image.width;
      const naturalFontSize = textSize * scaleFactor;
      const italicPrefix = isItalic ? 'italic ' : '';
      
      ctx.font = `${italicPrefix}${fontWeight} ${naturalFontSize}px ${fontFamily}`;
      ctx.fillStyle = textColor;
      ctx.textAlign = textAlign;
      ctx.textBaseline = 'middle';

      const xPos = (textX / 100) * canvas.width;
      const yPos = (textY / 100) * canvas.height;

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

      let startX = xPos;
      if (textAlign === 'center') {
        startX = xPos - maxWidth / 2;
      } else if (textAlign === 'right') {
        startX = xPos - maxWidth;
      }

      // Draw background banner if set
      if (textBgColor !== 'transparent') {
        ctx.fillStyle = textBgColor;
        ctx.fillRect(
          startX - paddingX,
          yPos - (lineHeight * textLines.length) / 2 - paddingY,
          maxWidth + paddingX * 2,
          bannerHeight
        );
      }

      // Draw text lines
      ctx.fillStyle = textColor;
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

  const handleResetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
    setHueRotate(0);
    toast.success('Filters reset to default');
  };

  const displayText = isUppercase ? textOverlay.toUpperCase() : textOverlay;

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
                    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) hue-rotate(${hueRotate}deg)`
                  }}
                />
                
                {/* Drag Instructions overlay */}
                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-white/75 font-mono flex items-center gap-1.5 pointer-events-none">
                  <Move size={10} /> Drag text directly on poster to position
                </div>

                <div 
                  onMouseDown={handleMouseDown}
                  onMouseEnter={() => setIsHoveringText(true)}
                  onMouseLeave={() => setIsHoveringText(false)}
                  className={`absolute select-none whitespace-pre-line cursor-move transition-shadow duration-200 ${isDragging ? 'shadow-xl' : ''}`}
                  style={{
                    left: `${textX}%`,
                    top: `${textY}%`,
                    transform: textAlign === 'center' 
                      ? 'translate(-50%, -50%)' 
                      : textAlign === 'left' 
                        ? 'translate(0%, -50%)' 
                        : 'translate(-100%, -50%)',
                    textAlign: textAlign,
                    color: textColor,
                    fontSize: `${textSize}px`,
                    fontFamily: fontFamily,
                    fontWeight: fontWeight,
                    fontStyle: isItalic ? 'italic' : 'normal',
                    backgroundColor: textBgColor,
                    padding: textBgColor !== 'transparent' ? '8px 20px' : '4px',
                    borderRadius: '8px',
                    lineHeight: '1.25',
                    maxWidth: '85%',
                    wordBreak: 'break-word',
                    outline: isHoveringText || isDragging ? '2px dashed #3b82f6' : 'none',
                    outlineOffset: '4px',
                    boxShadow: textBgColor !== 'transparent' ? '0 8px 24px rgba(0,0,0,0.4)' : 'none',
                    textShadow: textBgColor === 'transparent' ? '1px 1px 6px rgba(0,0,0,0.9)' : 'none'
                  }}
                >
                  {displayText || 'Enter Text'}
                </div>
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
                  <h4 className="font-bold mb-1 text-primary">Professional Typography</h4>
                  <p className="text-[11px] text-muted-foreground">Design premium visual copy overlays for your campaigns.</p>
                </div>

                {/* Text Content */}
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Headline Text</label>
                  <textarea 
                    value={textOverlay}
                    onChange={(e) => setTextOverlay(e.target.value)}
                    placeholder="Enter poster text..."
                    rows={3}
                    className="w-full bg-glass/5 border border-glass/10 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                  />
                </div>

                {/* Typography formatting buttons */}
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Formatting & Alignment</label>
                  <div className="flex gap-2">
                    {/* Alignment buttons */}
                    <div className="flex bg-glass/5 rounded-xl border border-glass/10 p-1">
                      <button 
                        onClick={() => setTextAlign('left')}
                        className={`p-1.5 rounded-lg transition-colors ${textAlign === 'left' ? 'bg-primary text-primary-foreground' : 'hover:bg-glass/10'}`}
                      >
                        <AlignLeft size={16} />
                      </button>
                      <button 
                        onClick={() => setTextAlign('center')}
                        className={`p-1.5 rounded-lg transition-colors ${textAlign === 'center' ? 'bg-primary text-primary-foreground' : 'hover:bg-glass/10'}`}
                      >
                        <AlignCenter size={16} />
                      </button>
                      <button 
                        onClick={() => setTextAlign('right')}
                        className={`p-1.5 rounded-lg transition-colors ${textAlign === 'right' ? 'bg-primary text-primary-foreground' : 'hover:bg-glass/10'}`}
                      >
                        <AlignRight size={16} />
                      </button>
                    </div>

                    {/* Font weight and style toggles */}
                    <div className="flex bg-glass/5 rounded-xl border border-glass/10 p-1 flex-1 justify-around">
                      <button 
                        onClick={() => setFontWeight(prev => prev === 'bold' ? 'normal' : 'bold')}
                        className={`p-1.5 rounded-lg transition-colors px-2.5 ${fontWeight === 'bold' ? 'bg-primary text-primary-foreground' : 'hover:bg-glass/10'}`}
                      >
                        <Bold size={16} />
                      </button>
                      <button 
                        onClick={() => setIsItalic(prev => !prev)}
                        className={`p-1.5 rounded-lg transition-colors px-2.5 ${isItalic ? 'bg-primary text-primary-foreground' : 'hover:bg-glass/10'}`}
                      >
                        <Italic size={16} />
                      </button>
                      <button 
                        onClick={() => setIsUppercase(prev => !prev)}
                        className={`text-xs font-bold rounded-lg transition-colors px-2 ${isUppercase ? 'bg-primary text-primary-foreground' : 'hover:bg-glass/10 text-muted-foreground'}`}
                      >
                        aA
                      </button>
                    </div>
                  </div>
                </div>

                {/* Font Family selection */}
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Brand Font Family</label>
                  <select 
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
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

                {/* Size and Position Inputs */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Text Size</span>
                      <span className="font-mono text-[11px]">{textSize}px</span>
                    </div>
                    <input 
                      type="range" min="12" max="120" value={textSize} 
                      onChange={(e) => setTextSize(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Horizontal Alignment (X)</span>
                      <span className="font-mono text-[11px]">{textX}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={textX} 
                      onChange={(e) => setTextX(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Vertical Alignment (Y)</span>
                      <span className="font-mono text-[11px]">{textY}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={textY} 
                      onChange={(e) => setTextY(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>

                {/* Text Color / Banner Styling */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Text Fill Color</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full border border-glass/20 overflow-hidden shrink-0">
                        <input 
                          type="color" value={textColor} 
                          onChange={(e) => setTextColor(e.target.value)}
                          className="absolute inset-0 w-12 h-12 -translate-x-2 -translate-y-2 border-0 cursor-pointer"
                        />
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {['#ffffff', '#000000', '#facc15', '#ef4444', '#3b82f6', '#22c55e', '#ff007f'].map(c => (
                          <button 
                            key={c} onClick={() => setTextColor(c)}
                            className="w-5 h-5 rounded-full border border-white/20 transition-transform active:scale-90"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">Text Background Frame</label>
                    <select 
                      value={textBgColor}
                      onChange={(e) => setTextBgColor(e.target.value)}
                      className="w-full bg-glass/5 border border-glass/10 rounded-xl p-2 text-xs outline-none focus:ring-1 focus:ring-primary/50"
                    >
                      <option value="transparent">None (Transparent / Dropped)</option>
                      <option value="rgba(0,0,0,0.4)">Glassmorphic Matte Dark (Default)</option>
                      <option value="rgba(0,0,0,0.85)">Solid Cinematic Black</option>
                      <option value="rgba(255,255,255,0.4)">Glassmorphic Matte Light</option>
                      <option value="rgba(255,255,255,0.85)">Solid Matte White</option>
                    </select>
                  </div>
                </div>

                {/* Separator */}
                <hr className="border-glass/10 my-4" />

                {/* Color Adjustments */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h5 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Color Grading</h5>
                    <button 
                      onClick={handleResetFilters}
                      className="text-[10px] text-primary flex items-center gap-1 hover:underline"
                    >
                      <RotateCcw size={10} /> Reset
                    </button>
                  </div>
                  
                  {/* Hue track has colorful gradient representing hue spectrum */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Color Tone Shift (Hue)</span>
                      <span className="font-mono text-[11px]">{hueRotate}°</span>
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
                      <span className="font-mono text-[11px]">{brightness}%</span>
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
                      <span className="font-mono text-[11px]">{contrast}%</span>
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
                      <span className="font-mono text-[11px]">{saturate}%</span>
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
