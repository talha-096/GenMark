import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { 
  History, 
  Trash2, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  Image as ImageIcon, 
  FileText,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface HistoryItem {
  id: string;
  title: string;
  content: string;
  type: string;
  prompt?: string;
  created_at: string;
  brand_kit_id?: string | null;
  image_url?: string;
  aspect_ratio?: string;
  marketing_copy?: string;
  selected_task?: string;
}

interface HistorySidebarProps {
  type: "text" | "image" | "image_analysis";
  onSelectItem: (item: HistoryItem) => void;
  selectedId?: string | null;
}

export const HistorySidebar = ({ type, onSelectItem, selectedId }: HistorySidebarProps) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Query to fetch history from database
  const { data: history = [], isLoading } = useQuery<HistoryItem[]>({
    queryKey: ["generation-history", type],
    queryFn: () => apiClient.get<HistoryItem[]>(`/api/generate/history?type=${type}&limit=30`),
    refetchOnWindowFocus: false,
  });

  // Mutation to delete a history item
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/content/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generation-history", type] });
      toast.success("Generation removed from history");
    },
    onError: () => {
      toast.error("Failed to delete history item");
    }
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  const filteredHistory = history.filter(item => {
    const promptMatch = item.prompt?.toLowerCase().includes(searchQuery.toLowerCase());
    const titleMatch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return promptMatch || titleMatch;
  });

  const getIcon = () => {
    switch (type) {
      case "text":
        return <MessageSquare size={16} className="text-primary" />;
      case "image":
        return <ImageIcon size={16} className="text-primary" />;
      case "image_analysis":
        return <FileText size={16} className="text-primary" />;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      // Format to relative or concise date
      return date.toLocaleDateString(undefined, { 
        month: "short", 
        day: "numeric", 
        hour: "2-digit", 
        minute: "2-digit" 
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div 
      className={cn(
        "relative h-full min-h-[600px] transition-all duration-300 flex z-30",
        isOpen ? "w-80" : "w-16"
      )}
    >
      {/* Sidebar Content Container */}
      <div 
        className={cn(
          "w-full h-full bg-surface/40 backdrop-blur-xl border border-glass/10 rounded-3xl flex flex-col overflow-hidden transition-all duration-300",
          !isOpen && "items-center"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-glass/10 flex items-center justify-between w-full">
          {isOpen ? (
            <div className="flex items-center gap-2">
              <History size={18} className="text-primary" />
              <span className="font-display font-bold text-sm">Workspace History</span>
            </div>
          ) : (
            <History size={18} className="text-primary opacity-60" />
          )}

          {/* Toggle Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 hover:bg-glass/5 rounded-lg border border-glass/5 hover:border-glass/10 transition-all text-muted-foreground hover:text-foreground"
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Search Bar */}
        {isOpen && (
          <div className="px-4 py-3 border-b border-glass/5 w-full">
            <div className="flex items-center bg-glass/5 border border-glass/10 rounded-xl px-3 py-1.5 gap-2">
              <Search size={14} className="text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search history..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full placeholder:text-muted-foreground/50 text-foreground"
              />
            </div>
          </div>
        )}

        {/* History Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 w-full custom-scrollbar">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center py-8">
              <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2" />
              {isOpen && <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Syncing history...</span>}
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground/30 py-12">
              <Clock size={24} className="opacity-10 mb-2" />
              {isOpen && (
                <>
                  <p className="text-xs font-semibold">No entries</p>
                  <p className="text-[10px] mt-1">Generations will be logged here.</p>
                </>
              )}
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isSelected = selectedId === item.id;
              return (
                <div 
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className={cn(
                    "group relative p-3 rounded-2xl border text-left cursor-pointer transition-all hover:scale-102 flex items-start gap-3",
                    isSelected 
                      ? "bg-primary/10 border-primary/40 text-foreground shadow-glow-sm"
                      : "bg-glass/5 border-glass/5 hover:bg-glass/10 hover:border-glass/15 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="mt-0.5 shrink-0">
                    {getIcon()}
                  </div>

                  {isOpen && (
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="text-xs font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                        {item.title || "Untitled Generation"}
                      </div>
                      <p className="text-[10px] text-muted-foreground/80 truncate mt-1">
                        {item.prompt || "No prompt parameters"}
                      </p>
                      <div className="text-[9px] text-muted-foreground/50 font-mono mt-1.5 flex items-center gap-1">
                        <Clock size={8} />
                        {formatTime(item.created_at)}
                      </div>
                    </div>
                  )}

                  {/* Delete button (displays on hover) */}
                  {isOpen && (
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      disabled={deleteMutation.isPending}
                      className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 hover:text-destructive text-muted-foreground/50 transition-all p-1 hover:bg-red-500/10 rounded"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
