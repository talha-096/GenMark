import { useState } from 'react';
import { Clock, Search, Filter, Download, Trash2, Image as ImageIcon, FileText, Video, Loader2 } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { toast } from "sonner";
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

interface NeuralAssetResponse {
    _id: string;
    type?: string;
    title?: string;
    created_at: string;
    size?: string;
    status?: string;
}

interface HistoryItem {
    id: string;
    type: string;
    name: string;
    date: string;
    size: string;
    status: string;
}

export const History = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    const { data: items = [], isLoading } = useQuery({
        queryKey: ['neural-assets', user?.id],
        queryFn: async (): Promise<HistoryItem[]> => {
            const res = await apiClient.get<NeuralAssetResponse[]>('/api/content');
            return res.map(item => ({
                id: item._id,
                type: item.type || 'text',
                name: item.title || 'Untitled Asset',
                date: new Date(item.created_at).toLocaleDateString(),
                size: item.size || 'N/A',
                status: item.status || 'completed'
            }));
        },
        enabled: !!user,
        refetchInterval: 10000,
        staleTime: 5000,
    });

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "image": return <ImageIcon size={18} className="text-primary" />;
            case "text": return <FileText size={18} className="text-blue-400" />;
            case "video": return <Video size={18} className="text-purple-400" />;
            default: return <Clock size={18} />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-display font-bold tracking-tight">Neural Asset Library</h1>
                <p className="text-muted-foreground mt-1">Every model interaction is securely logged for your enterprise record.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name, prompt or metadata..." 
                        className="w-full bg-surface/30 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-all font-display"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 bg-surface/30 border-white/10">
                        <Filter size={18} />
                        Filter
                    </Button>
                    <Button variant="outline" className="gap-2 bg-surface/30 border-white/10" onClick={() => toast.success("Exporting data...")}>
                        <Download size={18} />
                        Export
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-surface/20 rounded-2xl border border-dashed border-white/5">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                        <p className="text-muted-foreground animate-pulse">Synchronizing neural vault...</p>
                    </div>
                ) : filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <div key={item.id} className="group p-4 rounded-xl bg-surface/30 border border-white/5 hover:border-primary/10 hover:bg-white/5 transition-all flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                {getTypeIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{item.name}</h3>
                                <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase tracking-wider font-mono mt-0.5">
                                    <span>{item.type}</span>
                                    <span>•</span>
                                    <span>{item.date}</span>
                                    <span>•</span>
                                    <span>{item.size}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                    item.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                                }`}>
                                    {item.status}
                                </span>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Download size={16} />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-500 hover:bg-red-500/10">
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-2xl">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <Search size={24} className="text-muted-foreground/30" />
                        </div>
                        <h4 className="font-bold">No results found</h4>
                        <p className="text-sm text-muted-foreground mt-1">Try adjusting your search query or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
