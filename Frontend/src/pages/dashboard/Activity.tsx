import { useState } from 'react';
import { 
  Activity as ActivityIcon, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  Eye, 
  X, 
  Search, 
  Copy, 
  ExternalLink,
  MessageSquare,
  Image as ImageIcon,
  FileText,
  Loader2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from "@/components/shared/Button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BackendActivityItem {
  _id: string;
  title: string;
  type: string;
  created_at: string;
  status: string;
}

interface ActivityItem {
  id: string;
  title: string;
  type: string;
  time: string;
  rawTime: string;
  status: string;
}

interface ContentDetails {
  _id: string;
  title: string;
  content: string;
  type: string;
  prompt?: string;
  image_url?: string;
  marketing_copy?: string;
  created_at: string;
}

export const Activity = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "text" | "image">("all");
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  const formatTimeAgo = (dateStr: string) => {
    try {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "";
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      if (seconds < 60) return "Just now";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return "";
    }
  };

  // Query to get recent activity log list
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['dashboard-activity', user?.id],
    queryFn: async (): Promise<ActivityItem[]> => {
      const res = await apiClient.get<BackendActivityItem[]>('/api/dashboard/activity');
      return res.map(item => ({
        id: item._id,
        title: item.title || 'System Action',
        type: item.type || 'text',
        time: formatTimeAgo(item.created_at),
        rawTime: item.created_at,
        status: item.status || 'success'
      }));
    },
    enabled: !!user,
  });

  // Query to fetch complete details of a specific activity/content item on click
  const { data: activeDetails, isLoading: isDetailsLoading } = useQuery<ContentDetails>({
    queryKey: ['activity-details', selectedActivityId],
    queryFn: () => apiClient.get<ContentDetails>(`/api/content/${selectedActivityId}`),
    enabled: !!selectedActivityId,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/content/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-activity'] });
      toast.success("Activity log removed");
      if (selectedActivityId) setSelectedActivityId(null);
    },
    onError: () => {
      toast.error("Failed to delete log entry");
    }
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle2 className="text-green-500" size={16} />;
      case "warning": return <AlertCircle className="text-yellow-500" size={16} />;
      case "error": return <AlertCircle className="text-red-500" size={16} />;
      default: return <Clock className="text-blue-500" size={16} />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image": return <ImageIcon size={14} className="text-primary" />;
      case "text": return <MessageSquare size={14} className="text-blue-400" />;
      default: return <FileText size={14} className="text-emerald-400" />;
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          activity.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || activity.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const successLogsCount = activities.filter(a => a.status === "success").length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full relative">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Generative Activity Log</h1>
        <p className="text-muted-foreground mt-1">Audit trail of all engine operations and account actions.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface/30 border border-glass/5 flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Total Operations</span>
          <span className="text-2xl font-bold font-display text-foreground">{activities.length}</span>
        </div>
        <div className="p-5 rounded-2xl bg-surface/30 border border-glass/5 flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Successful Actions</span>
          <span className="text-2xl font-bold font-display text-green-400">{successLogsCount}</span>
        </div>
        <div className="p-5 rounded-2xl bg-surface/30 border border-glass/5 flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Encryption Status</span>
          <span className="text-2xl font-bold font-display text-primary flex items-center gap-2">Active</span>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search activity log..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/30 border border-glass/10 rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-primary/50 transition-all text-foreground"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex bg-glass/5 border border-glass/10 p-1 rounded-xl shrink-0">
          {(["all", "text", "image"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                activeFilter === tab 
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Log List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 w-full rounded-2xl bg-glass/5 animate-pulse" />
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-20 bg-surface/20 rounded-2xl border border-dashed border-glass/5">
            <p className="text-muted-foreground text-sm">No recent operations found.</p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div 
              key={activity.id} 
              onClick={() => setSelectedActivityId(activity.id)}
              className="p-4 rounded-2xl bg-surface/30 border border-glass/5 flex items-center gap-4 hover:bg-glass/5 transition-colors group relative overflow-hidden cursor-pointer"
            >
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="mt-0.5">
                {getStatusIcon(activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-foreground truncate">{activity.title}</h3>
                  <span className="text-[10px] text-muted-foreground font-mono whitespace-nowrap">{activity.time}</span>
                </div>
                <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-mono flex items-center gap-1.5 mt-1">
                  {getTypeIcon(activity.type)}
                  <span>{activity.type.replace('_', ' ')}</span>
                </p>
              </div>

              {/* Hover Buttons */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setSelectedActivityId(activity.id)}
                >
                  <Eye size={14} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  disabled={deleteMutation.isPending}
                  className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-500 hover:bg-red-500/10"
                  onClick={(e) => handleDelete(e, activity.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-8 rounded-2xl border border-dashed border-glass/10 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-glass/5 flex items-center justify-center mb-4">
          <ActivityIcon size={24} className="text-muted-foreground" />
        </div>
        <h4 className="font-bold">Encryption Active</h4>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">All activity logs are end-to-end encrypted and stored in your private vault for 30 days.</p>
      </div>

      {/* Activity Details Modal overlay */}
      {selectedActivityId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-glass-inverse/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div 
            className="bg-[#0b0f19]/90 border border-glass/15 rounded-3xl w-full max-w-2xl overflow-hidden max-h-[85vh] flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-300 p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button 
              onClick={() => setSelectedActivityId(null)}
              className="absolute top-4 right-4 p-2 bg-glass-inverse/60 rounded-full hover:bg-glass/10 transition-colors text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>

            {isDetailsLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground text-xs uppercase tracking-widest font-mono animate-pulse">Retrieving vault record...</p>
              </div>
            ) : activeDetails ? (
              <div className="space-y-6 overflow-y-auto pr-1">
                <div>
                  <span className="text-[9px] font-mono text-primary uppercase tracking-widest border border-primary/20 px-2.5 py-0.5 rounded-full">
                    Audit Log Detail
                  </span>
                  <h2 className="text-xl font-display font-bold mt-4 text-foreground">{activeDetails.title}</h2>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1">
                    Logged: {new Date(activeDetails.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Prompt Details */}
                {activeDetails.prompt && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">Input Parameters / Directives</span>
                    <div className="p-3 bg-glass/5 border border-glass/5 rounded-xl text-xs text-foreground/80 leading-relaxed font-sans italic">
                      "{activeDetails.prompt}"
                    </div>
                  </div>
                )}

                {/* Content details / output image */}
                {activeDetails.type === "image" && activeDetails.content ? (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">Synthesized Image Output</span>
                    <div className="rounded-xl overflow-hidden border border-glass/10 bg-glass-inverse/40 p-2 max-h-[300px] flex justify-center">
                      <img src={activeDetails.content} alt={activeDetails.title} className="max-h-[280px] object-contain" />
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 text-xs py-2 mt-2"
                      onClick={() => window.open(activeDetails.content, "_blank")}
                    >
                      <ExternalLink size={12} /> Open Full View
                    </Button>
                  </div>
                ) : activeDetails.type === "image_analysis" && activeDetails.image_url ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block mb-2">Analyzed Image</span>
                        <div className="rounded-xl overflow-hidden border border-glass/10 bg-glass-inverse/40 p-1 flex justify-center">
                          <img src={activeDetails.image_url} alt="Analyzed" className="max-h-[160px] object-contain" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">Visual Caption</span>
                        <div className="p-3 bg-glass/5 border border-glass/5 rounded-xl text-xs leading-relaxed max-h-[160px] overflow-y-auto">
                          {activeDetails.content}
                        </div>
                      </div>
                    </div>
                    {activeDetails.marketing_copy && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">Copywriting Synthesis</span>
                        <div className="p-3 bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/20 rounded-xl text-xs leading-relaxed">
                          {activeDetails.marketing_copy}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  activeDetails.content && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                        <span>Output Payload</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(activeDetails.content);
                            toast.success("Payload copied");
                          }}
                          className="p-1 hover:text-primary transition-colors flex items-center gap-1"
                        >
                          <Copy size={12} />
                          <span>Copy</span>
                        </button>
                      </div>
                      <div className="p-4 bg-glass/5 border border-glass/5 rounded-xl text-xs leading-relaxed text-foreground/90 font-sans whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {activeDetails.content}
                      </div>
                    </div>
                  )
                )}

                {/* Actions */}
                <div className="pt-6 border-t border-glass/10 flex gap-3">
                  <Button 
                    variant="outline"
                    className="flex-1 gap-2 rounded-xl text-xs py-2 text-red-400 border-glass/10 hover:bg-red-500/10"
                    onClick={(e) => handleDelete(e, activeDetails._id)}
                  >
                    <Trash2 size={12} /> Purge Audit Record
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground text-sm italic">
                Record could not be found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

