import { APP_CONFIG } from '@/config/constants';
import { Terminal, Zap, Database, Server } from 'lucide-react';
import { SiReact, SiTailwindcss, SiTypescript, SiBun } from '@icons-pack/react-simple-icons';
import { useState, useEffect } from 'react';

/**
 * Hero section component - Brutalist console-inspired design
 */
export function Hero() {
  const [typedText, setTypedText] = useState('');
  const fullText = `> INITIALIZING ${APP_CONFIG.displayName}...`;

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [fullText]);

  const techStack = [
    { name: 'REACT', icon: <SiReact size={20} />, color: 'text-black' },
    { name: 'TAILWIND', icon: <SiTailwindcss size={20} />, color: 'text-black' },
    { name: 'TYPESCRIPT', icon: <SiTypescript size={20} />, color: 'text-black' },
    { name: 'BUN', icon: <SiBun size={20} />, color: 'text-black' },
  ];

  return (
    <div className="mb-20">
      {/* Terminal-style header */}
      <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
        <div className="bg-black px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal size={16} className="text-yellow-400" />
            <span className="text-yellow-400 font-mono text-sm uppercase tracking-wider">
              System Terminal v1.0
            </span>
          </div>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-yellow-400"></div>
            <div className="w-3 h-3 bg-yellow-400"></div>
            <div className="w-3 h-3 bg-yellow-400"></div>
          </div>
        </div>

        <div className="p-8 font-mono">
          <div className="text-black text-lg mb-4">
            {typedText}
            <span className="animate-pulse">_</span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-black/60">[OK]</span>
              <span className="text-black">Loading React framework...</span>
              <Zap size={14} className="text-yellow-400" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-black/60">[OK]</span>
              <span className="text-black">Connecting to none API...</span>
              <Server size={14} className="text-yellow-400" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-black/60">[OK]</span>
              <span className="text-black">Database connection established...</span>
              <Database size={14} className="text-yellow-400" />
            </div>
            <div className="mt-4 pt-4 border-t-2 border-black/20">
              <span className="text-black font-bold">STATUS: </span>
              <span className="text-black bg-yellow-400 px-2 py-1">OPERATIONAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Separator line */}
      <div className="flex items-center justify-center mb-8">
        <div className="h-1 w-20 bg-black"></div>
        <div className="mx-4 w-2 h-2 bg-yellow-400 border-2 border-black rotate-45"></div>
        <div className="h-1 w-20 bg-black"></div>
      </div>

      {/* Project title with brutalist style - reduced size */}
      <div className="text-center mb-8">
        <h1 className="inline-block text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-black bg-yellow-400 px-6 py-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150">
          {APP_CONFIG.displayName.toUpperCase()}
        </h1>
      </div>

      {/* Another separator */}
      <div className="flex items-center justify-center mb-8">
        <div className="h-0.5 flex-1 max-w-xs bg-black/20"></div>
        <div className="mx-4 text-xs font-mono text-black/60 uppercase tracking-wider">Stack</div>
        <div className="h-0.5 flex-1 max-w-xs bg-black/20"></div>
      </div>

      {/* Tech stack badges - improved design */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto mb-8">
        {techStack.map((tech, idx) => (
          <div key={idx} className="group relative">
            <div className="absolute inset-0 bg-black transform translate-x-1 translate-y-1"></div>
            <div className="relative bg-white border-2 border-black p-3 hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150">
              <div className="flex flex-col items-center space-y-2">
                <div className="text-black">{tech.icon}</div>
                <span className="font-bold text-xs uppercase tracking-wider text-black text-center">
                  {tech.name}
                </span>
              </div>
              {/* Active indicator */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 border border-black"></div>
            </div>
          </div>
        ))}
      </div>

      {/* System info bar */}
      <div className="flex justify-center">
        <div className="inline-flex items-center space-x-6 px-6 py-3 bg-black text-yellow-400 font-mono text-xs uppercase">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 animate-pulse"></div>
            <span>Port: 5173</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 animate-pulse"></div>
            <span>API: 3001</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 animate-pulse"></div>
            <span>DB: false</span>
          </div>
        </div>
      </div>

      {/* Modern Footer with Precast branding */}
      <div className="mt-16 pt-8 border-t-4 border-black">
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-2">
            <span className="text-black font-mono text-sm">POWERED BY</span>
            <a
              href="https://precast.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center space-x-1"
            >
              <span className="text-black font-black text-lg bg-yellow-400 px-2 py-1 group-hover:bg-yellow-300 transition-colors">
                PRECAST.DEV
              </span>
              <svg
                className="w-4 h-4 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
          <div className="flex justify-center items-center space-x-2">
            <span className="text-xs text-black/60 font-mono uppercase">Color Scheme:</span>
            <span className="text-xs font-bold text-black bg-yellow-400/20 px-2 py-1 border border-black">
              shadcn
            </span>
          </div>
          <div className="text-black/60 font-mono text-xs">
            [BUILT WITH ❤️ FOR MODERN WEB DEVELOPMENT]
          </div>
        </div>
      </div>
    </div>
  );
}
