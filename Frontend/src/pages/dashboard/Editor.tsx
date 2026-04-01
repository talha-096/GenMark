import React from 'react';

const Editor: React.FC = () => {
  return (
    <div className="flex w-full h-full gap-4">
      <div className="w-[220px] bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 font-mono text-sm text-muted-foreground flex flex-col">
        <div className="mb-4 text-xs font-bold text-white/50 uppercase tracking-widest">Explorer</div>
        <div className="cursor-pointer hover:text-white py-1">src</div>
        <div className="cursor-pointer hover:text-white py-1 pl-4 text-primary">App.tsx</div>
        <div className="cursor-pointer hover:text-white py-1 pl-4">main.tsx</div>
      </div>
      
      <div className="flex-1 bg-surface border border-white/[0.08] rounded-lg p-4 font-mono text-sm shadow-glass overflow-hidden relative">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-4 text-white/70 bg-white/5 px-4 py-1 rounded-md text-xs">App.tsx</span>
        </div>
        <pre className="text-code/90">
          <code>
{`import React from 'react';\nimport { Canvas } from '@react-three/fiber';\n\nexport const App = () => {\n  return (\n    <div className="relative">\n      <h1 className="text-primary">AntiGravity</h1>\n      <Canvas>\n        <ambientLight />\n      </Canvas>\n    </div>\n  );\n};`}
          </code>
        </pre>
        <div className="absolute inset-0 pointer-events-none animate-scanline bg-white/[0.02] h-4 w-full" />
      </div>

      <div className="w-[320px] bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-primary/20 border border-primary/30 p-3 rounded-md text-sm text-primary">
            I noticed you imported Canvas but forgot orbit controls. Should I add them?
          </div>
          <div className="bg-white/5 p-3 rounded-md text-sm text-muted-foreground">
            Yes, please add OrbitControls from @react-three/drei.
          </div>
        </div>
        <div className="mt-4 border border-white/10 rounded-md p-2 flex">
          <input className="bg-transparent outline-none flex-1 text-sm px-2" placeholder="Ask AI..." />
        </div>
      </div>
    </div>
  );
};

export default Editor;
