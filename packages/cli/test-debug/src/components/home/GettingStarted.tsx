import { useState } from 'react';
import { Terminal, Play, Database, Package } from 'lucide-react';

/**
 * Getting Started component - Console-style command reference
 */
export function GettingStarted() {
  const [activeTab, setActiveTab] = useState('development');

  const commands = {
    development: [
      { cmd: 'bun run dev', desc: 'Start all services', icon: <Play size={14} /> },
      { cmd: 'bun run db:migrate', desc: 'Run database migrations', icon: <Database size={14} /> },
    ],
    production: [
      { cmd: 'bun run build', desc: 'Build for production', icon: <Package size={14} /> },
      { cmd: 'bun run start', desc: 'Start production server', icon: <Play size={14} /> },
    ],
    testing: [
      { cmd: 'bun test', desc: 'Run test suite', icon: <Terminal size={14} /> },
      { cmd: 'bun run lint', desc: 'Check code quality', icon: <Terminal size={14} /> },
      { cmd: 'bun run type-check', desc: 'TypeScript validation', icon: <Terminal size={14} /> },
    ],
  };

  const tabs = [
    { id: 'development', label: 'DEV', color: 'bg-yellow-400' },
    { id: 'production', label: 'PROD', color: 'bg-black' },
    { id: 'testing', label: 'TEST', color: 'bg-white' },
  ];

  return (
    <section className="mb-20">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-8">
          <h2 className="inline-block text-3xl font-black uppercase text-black bg-yellow-400 px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            QUICK START
          </h2>
        </div>

        {/* Terminal window */}
        <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {/* Terminal header */}
          <div className="bg-black px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal size={16} className="text-yellow-400" />
              <span className="text-yellow-400 font-mono text-sm uppercase tracking-wider">
                Command Reference
              </span>
            </div>

            {/* Tab buttons */}
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 transition-all duration-150 ${
                    activeTab === tab.id
                      ? `${tab.color} ${tab.id === 'production' ? 'text-yellow-400' : 'text-black'} border-yellow-400`
                      : 'bg-black text-gray-500 border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal content */}
          <div className="p-6 font-mono">
            <div className="space-y-3">
              {commands[activeTab as keyof typeof commands].map((item, idx) => (
                <div
                  key={idx}
                  className="group flex items-start space-x-3 p-3 border-2 border-black bg-white hover:bg-yellow-50 transition-colors"
                >
                  <div className="mt-0.5 text-yellow-600">{item.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-black/60 text-sm">$</span>
                      <code className="text-black font-bold text-sm">{item.cmd}</code>
                    </div>
                    <p className="text-xs text-black/60 mt-1"># {item.desc}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(item.cmd)}
                    className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-black text-yellow-400 text-xs font-bold uppercase transition-opacity"
                  >
                    COPY
                  </button>
                </div>
              ))}
            </div>

            {/* Pro tip */}
            <div className="mt-6 p-4 bg-yellow-400 border-2 border-black">
              <div className="flex items-start space-x-2">
                <span className="text-black font-bold text-xs uppercase">TIP:</span>
                <p className="text-xs text-black">
                  Use <code className="bg-black text-yellow-400 px-1">bun run dev</code> to start
                  the development server
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
