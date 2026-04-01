import React from 'react';

const Deployments: React.FC = () => {
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold">Deployments</h1>
        <button className="bg-gradient-to-r from-primary to-accent text-background px-4 py-2 rounded-lg font-bold text-sm shadow-glow hover:shadow-glow-sm transition-shadow">
          New Deployment
        </button>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden mt-6">
        <table className="w-full text-left font-sm">
          <thead className="bg-white/[0.02] text-muted-foreground font-mono text-xs uppercase">
            <tr>
              <th className="p-4">Project</th>
              <th className="p-4">Branch</th>
              <th className="p-4">Status</th>
              <th className="p-4">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="p-4 font-mono font-medium">antigravity-core</td>
              <td className="p-4"><span className="bg-white/10 px-2 py-1 rounded text-xs">main</span></td>
              <td className="p-4"><span className="text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-xs font-bold border border-green-400/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">Live</span></td>
              <td className="p-4 text-muted-foreground">1.2s</td>
            </tr>
            <tr>
              <td className="p-4 font-mono font-medium">antigravity-auth</td>
              <td className="p-4"><span className="bg-white/10 px-2 py-1 rounded text-xs">feature/oauth</span></td>
              <td className="p-4"><span className="text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full text-xs font-bold border border-yellow-400/20 shadow-[0_0_10px_rgba(234,179,8,0.2)] animate-pulse">Building</span></td>
              <td className="p-4 text-muted-foreground">in progress</td>
            </tr>
            <tr>
              <td className="p-4 font-mono font-medium">antigravity-www</td>
              <td className="p-4"><span className="bg-white/10 px-2 py-1 rounded text-xs">patch-1</span></td>
              <td className="p-4"><span className="text-red-400 bg-red-400/10 px-3 py-1 rounded-full text-xs font-bold border border-red-400/20">Failed</span></td>
              <td className="p-4 text-muted-foreground">14.5s</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Deployments;
