import { Activity as ActivityIcon, CheckCircle2, Clock, AlertCircle, Sparkles, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

interface ActivityItem {
    id: string;
    title: string;
    type: string;
    time: string;
    status: string;
}

export const Activity = () => {
    const { user } = useAuth();
    
    const { data: activities = [], isLoading } = useQuery({
        queryKey: ['dashboard-activity', user?.id],
        queryFn: () => apiClient.get<ActivityItem[]>('/api/dashboard/activity'),
        enabled: !!user,
        refetchInterval: 10000,
        staleTime: 5000,
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "success": return <CheckCircle2 className="text-green-500" size={16} />;
            case "warning": return <AlertCircle className="text-yellow-500" size={16} />;
            case "error": return <AlertCircle className="text-red-500" size={16} />;
            default: return <Clock className="text-blue-500" size={16} />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-display font-bold tracking-tight">Neural Activity Log</h1>
                <p className="text-muted-foreground mt-1">Audit trail of all engine operations and account actions.</p>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 w-full rounded-xl bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-20 bg-surface/20 rounded-2xl border border-dashed border-white/5">
                        <p className="text-muted-foreground">No recent activity found.</p>
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div key={activity.id} className="p-4 rounded-xl bg-surface/30 border border-white/5 flex items-start gap-4 hover:bg-white/5 transition-colors group relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="mt-1">
                                {getStatusIcon(activity.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="font-bold text-sm text-foreground truncate">{activity.title}</h3>
                                    <span className="text-[10px] text-muted-foreground font-mono whitespace-nowrap">{activity.time}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-tighter">{activity.type}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-8 rounded-2xl border border-dashed border-white/10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <ActivityIcon size={24} className="text-muted-foreground" />
                </div>
                <h4 className="font-bold">Encryption Active</h4>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">All activity logs are end-to-end encrypted and stored in your private vault for 30 days.</p>
            </div>
        </div>
    );
};
