import { Briefcase, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';

interface ProjectItem {
    id: string;
    name: string;
    assets: number;
    status: string;
    lastModified: string;
}

export const Projects = () => {
    const { user } = useAuth();
    
    const { data: projects = [], isLoading } = useQuery({
        queryKey: ['user-projects', user?.id],
        queryFn: async () => {
            const res = await apiClient.get<any[]>('/api/projects');
            return res.map(p => ({
                id: p._id,
                name: p.name,
                assets: p.asset_count || 0,
                status: p.status || 'Active',
                lastModified: new Date(p.updated_at || p.created_at).toLocaleDateString()
            }));
        },
        enabled: !!user,
        refetchInterval: 10000,
        staleTime: 5000,
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight">Marketing Projects</h1>
                    <p className="text-muted-foreground mt-1">Organize your creative assets into strategic campaigns.</p>
                </div>
                <Button className="gap-2 shadow-glow-sm" onClick={() => toast.info("Project Engine", { description: "Creation flow is being synchronized with the neural core." })}>
                    <Plus size={18} />
                    New Project
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-40 w-full rounded-2xl bg-white/5 animate-pulse" />
                    ))
                ) : projects.length === 0 ? (
                    <div className="md:col-span-2 lg:col-span-3 py-20 text-center border-2 border-dashed border-white/5 rounded-2xl">
                         <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                            <Briefcase size={24} />
                         </div>
                         <h4 className="font-bold">Neural Workspace Empty</h4>
                         <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto mb-6">Initialize your first strategic neural project to begin organizing campaign assets.</p>
                         <Button variant="outline" className="text-xs" onClick={() => toast.info("Project Engine", { description: "Coming Soon: Structured multi-asset projects." })} >
                            Create Neural Workspace
                         </Button>
                    </div>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="group p-6 rounded-2xl bg-surface/30 border border-white/5 hover:border-primary/20 transition-all cursor-pointer hover:shadow-glow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Briefcase size={20} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                    project.status.toLowerCase() === "active" ? "bg-green-500/20 text-green-400" : 
                                    project.status.toLowerCase() === "draft" ? "bg-yellow-500/20 text-yellow-400" : 
                                    "bg-white/10 text-muted-foreground"
                                }`}>
                                    {project.status}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{project.name}</h3>
                            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                                <span>{project.assets} Neural Assets</span>
                                <span>{project.lastModified}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
