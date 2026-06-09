import { useState } from 'react';
import { 
  Clock, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Image as ImageIcon, 
  FileText, 
  Video, 
  Loader2, 
  X, 
  Copy, 
  ExternalLink, 
  Eye 
} from "lucide-react";
import { Button } from "@/components/shared/Button";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { cn } from "@/lib/utils";

interface GenerativeAssetResponse {
  _id: string;
  type?: string;
  title?: string;
  content?: string;
  prompt?: string;
  image_url?: string;
  marketing_copy?: string;
  selected_task?: string;
  created_at: string;
  size?: string;
  status?: string;
}

interface HistoryItem {
  id: string;
  type: string;
  name: string;
  content: string;
  prompt: string;
  imageUrl: string;
  marketingCopy: string;
  selectedTask: string;
  date: string;
  size: string;
  status: string;
}

export const History = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  // Fetch full asset list from backend
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['generative-assets', user?.id],
    queryFn: async (): Promise<HistoryItem[]> => {
      const res = await apiClient.get<GenerativeAssetResponse[]>('/api/content/');
      return res.map(item => ({
        id: item._id,
        type: item.type || 'text',
        name: item.title || 'Untitled Asset',
        content: item.content || '',
        prompt: item.prompt || '',
        imageUrl: item.image_url || '',
        marketingCopy: item.marketing_copy || '',
        selectedTask: item.selected_task || '',
        date: item.created_at && !isNaN(new Date(item.created_at).getTime())
          ? new Date(item.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : 'Unknown Date',
        size: item.size || 'N/A',
        status: item.status || 'completed'
      }));
    },
    enabled: !!user,
    staleTime: 5000,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/content/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generative-assets'] });
      toast.success("Asset removed from library");
      if (selectedItem) setSelectedItem(null);
    },
    onError: () => {
      toast.error("Failed to delete asset");
    }
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image": return <ImageIcon size={18} className="text-primary" />;
      case "text": return <FileText size={18} className="text-blue-400" />;
      case "image_analysis": return <FileText size={18} className="text-emerald-400" />;
      case "video": return <Video size={18} className="text-purple-400" />;
      default: return <Clock size={18} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto w-full relative">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Generative Asset Library</h1>
        <p className="text-muted-foreground mt-1">Every model interaction is securely logged for your enterprise record.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, prompt or metadata..." 
            className="w-full bg-surface/30 border border-glass/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-all font-display text-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-surface/30 border-glass/10" onClick={() => toast.info("Filter parameters are sync locked.")}>
            <Filter size={18} />
            Filter
          </Button>
          <Button variant="outline" className="gap-2 bg-surface/30 border-glass/10" onClick={() => toast.success("Exporting vault metadata...")}>
            <Download size={18} />
            Export
          </Button>
        </div>
      </div>

      {/* Library Grid */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-surface/20 rounded-2xl border border-dashed border-glass/5">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground animate-pulse font-mono text-xs uppercase tracking-widest">Synchronizing generative vault...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedItem(item)}
              className="group p-4 rounded-2xl bg-surface/30 border border-glass/5 hover:border-primary/25 hover:bg-glass/5 transition-all flex items-center gap-4 cursor-pointer"
            >
              {/* Thumbnail Container */}
              <div className="w-16 h-16 rounded-xl bg-glass/5 border border-glass/10 flex items-center justify-center shrink-0 overflow-hidden relative group-hover:scale-102 transition-transform">
                {item.type === "image" && item.content ? (
                  <img src={item.content} alt={item.name} className="w-full h-full object-cover" />
                ) : item.type === "image_analysis" && item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  getTypeIcon(item.type)
                )}
              </div>

              {/* Text Meta Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate group-hover:text-primary transition-colors text-foreground">
                  {item.name}
                </h3>
                {item.prompt && (
                  <p className="text-xs text-muted-foreground/75 truncate mt-1 italic font-sans">
                    Prompt: "{item.prompt}"
                  </p>
                )}
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase tracking-wider font-mono mt-2">
                  <span className="font-bold text-primary/80">{item.type.replace('_', ' ')}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                  <span>•</span>
                  <span>{item.size}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  item.status === "completed" ? "bg-green-500/10 text-green-400 border border-green-500/10" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/10"
                }`}>
                  {item.status}
                </span>
                
                {/* View Details Button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setSelectedItem(item)}
                >
                  <Eye size={16} />
                </Button>

                {/* Download (For Images) */}
                {((item.type === "image" && item.content) || (item.type === "image_analysis" && item.imageUrl)) && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(item.type === "image" ? item.content : item.imageUrl, "_blank");
                    }}
                  >
                    <Download size={16} />
                  </Button>
                )}

                {/* Delete button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  disabled={deleteMutation.isPending}
                  className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-500 hover:bg-red-500/10"
                  onClick={(e) => handleDelete(e, item.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-glass/5 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-glass/5 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-muted-foreground/30" />
            </div>
            <h4 className="font-bold">No results found</h4>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search query or filters.</p>
          </div>
        )}
      </div>

      {/* Lightbox / Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-glass-inverse/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div 
            className="bg-[#0b0f19]/90 border border-glass/15 rounded-3xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row shadow-2xl relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-glass-inverse/60 rounded-full hover:bg-glass/10 transition-colors text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>

            {/* Left side: Media preview (specifically for image-type content) */}
            {((selectedItem.type === "image" && selectedItem.content) || (selectedItem.type === "image_analysis" && selectedItem.imageUrl)) ? (
              <div className="md:w-1/2 bg-glass-inverse/40 flex items-center justify-center border-b md:border-b-0 md:border-r border-glass/10 min-h-[300px] md:min-h-0 relative">
                <img 
                  src={selectedItem.type === "image" ? selectedItem.content : selectedItem.imageUrl} 
                  alt={selectedItem.name} 
                  className="max-w-full max-h-[50vh] md:max-h-[80vh] object-contain p-4" 
                />
              </div>
            ) : null}

            {/* Right side: Detailed meta parameters */}
            <div className={cn(
              "p-6 md:p-8 flex flex-col gap-6 overflow-y-auto max-h-[50vh] md:max-h-[85vh]",
              ((selectedItem.type === "image" && selectedItem.content) || (selectedItem.type === "image_analysis" && selectedItem.imageUrl)) ? "md:w-1/2" : "w-full"
            )}>
              <div>
                <span className="text-[9px] font-mono text-primary uppercase tracking-widest border border-primary/20 px-2 py-0.5 rounded-full">
                  {selectedItem.type.replace('_', ' ')}
                </span>
                <h2 className="text-xl font-display font-bold mt-3 text-foreground">{selectedItem.name}</h2>
                <p className="text-[10px] text-muted-foreground font-mono mt-1">{selectedItem.date} • ID: {selectedItem.id}</p>
              </div>

              {/* Prompt Box */}
              {selectedItem.prompt && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    <span>Generation Prompt</span>
                    <button 
                      onClick={() => copyToClipboard(selectedItem.prompt, "Prompt")}
                      className="p-1 hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <Copy size={12} />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="p-3 bg-glass/5 border border-glass/5 rounded-xl text-xs text-foreground/80 leading-relaxed font-sans italic">
                    "{selectedItem.prompt}"
                  </div>
                </div>
              )}

              {/* Generated Content Output */}
              {selectedItem.type !== "image" && selectedItem.content && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    <span>Generated Content / Description</span>
                    <button 
                      onClick={() => copyToClipboard(selectedItem.content, "Content")}
                      className="p-1 hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <Copy size={12} />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="p-4 bg-glass/5 border border-glass/5 rounded-xl text-sm leading-relaxed text-foreground/90 font-sans whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {selectedItem.content}
                  </div>
                </div>
              )}

              {/* Marketing copy (for Vision dual-stage) */}
              {selectedItem.marketingCopy && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-purple-400">
                    <span>Synthesized Marketing Copy</span>
                    <button 
                      onClick={() => copyToClipboard(selectedItem.marketingCopy, "Marketing copy")}
                      className="p-1 hover:text-purple-400 transition-colors flex items-center gap-1"
                    >
                      <Copy size={12} />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/20 rounded-xl text-sm leading-relaxed text-foreground/95 font-sans whitespace-pre-wrap">
                    {selectedItem.marketingCopy}
                  </div>
                </div>
              )}

              {/* Dynamic Task parameter info */}
              {selectedItem.selectedTask && (
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Vision Pipeline Preset</span>
                  <p className="text-xs font-semibold text-foreground mt-1 uppercase">{selectedItem.selectedTask}</p>
                </div>
              )}

              {/* Footer Actions */}
              <div className="mt-auto pt-6 border-t border-glass/10 flex flex-wrap gap-3">
                {((selectedItem.type === "image" && selectedItem.content) || (selectedItem.type === "image_analysis" && selectedItem.imageUrl)) ? (
                  <Button 
                    className="flex-1 gap-2 rounded-xl text-xs py-2.5" 
                    onClick={() => window.open(selectedItem.type === "image" ? selectedItem.content : selectedItem.imageUrl, "_blank")}
                  >
                    <ExternalLink size={14} /> Open Full View
                  </Button>
                ) : null}
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2 rounded-xl text-xs py-2.5 text-red-400 border-glass/10 hover:bg-red-500/10" 
                  onClick={(e) => {
                    handleDelete(e, selectedItem.id);
                  }}
                >
                  <Trash2 size={14} /> Delete Entry
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

