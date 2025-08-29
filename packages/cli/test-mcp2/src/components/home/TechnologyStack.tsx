import { Code2, Layers, Package2 } from 'lucide-react';
import { SiReact, SiVite, SiTailwindcss, SiTypescript, SiBun } from 'react-icons/si';

/**
 * Technology Stack component - Grid layout with brutalist cards
 */
export function TechnologyStack() {
  const technologies = [
    {
      category: 'FRONTEND',
      items: [
        { name: 'React', icon: <SiReact size={24} />, version: '18.3', port: '5173' },
        { name: 'Vite', icon: <SiVite size={24} />, version: '5.4', build: 'FAST' },
        { name: 'Tailwind', icon: <SiTailwindcss size={24} />, version: '3.4', jit: 'ON' },
        { name: 'TypeScript', icon: <SiTypescript size={24} />, version: '5.7', strict: 'YES' },
      ],
    },
    {
      category: 'BACKEND',
      items: [],
    },
    {
      category: 'TOOLING',
      items: [
        { name: 'Bun', icon: <SiBun size={24} />, version: '1.2', speed: 'ULTRA' },
        { name: 'Turbo', icon: <Package2 size={24} />, version: '1.12', cache: 'ENABLED' },
        { name: 'ESLint', icon: <Code2 size={24} />, version: '8.57', rules: 'STRICT' },
        { name: 'Prettier', icon: <Layers size={24} />, version: '3.0', format: 'AUTO' },
      ],
    },
  ];

  return (
    <section className="mb-20">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-12 text-center">
          <h2 className="inline-block text-3xl font-black uppercase text-black bg-yellow-400 px-6 py-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            TECHNOLOGY MATRIX
          </h2>
        </div>

        {/* Tech grid */}
        <div className="space-y-8">
          {technologies.map((category, catIdx) => (
            <div key={catIdx}>
              {/* Category header */}
              <div className="mb-4 flex items-center">
                <div className="bg-black text-yellow-400 px-3 py-1 font-bold text-xs uppercase tracking-wider">
                  {category.category}
                </div>
                <div className="flex-1 h-0.5 bg-black ml-3"></div>
              </div>

              {/* Tech cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.items.map((tech, idx) => (
                  <div key={idx} className="group relative">
                    {/* Shadow effect */}
                    <div className="absolute inset-0 bg-black transform translate-x-1 translate-y-1"></div>

                    {/* Card content */}
                    <div className="relative bg-white border-2 border-black hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150 cursor-pointer">
                      {/* Status indicator */}
                      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-yellow-400 border border-black"></div>

                      <div className="p-4">
                        {/* Icon and name header */}
                        <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-black">
                          <div className="text-black">{tech.icon}</div>
                          <span className="font-black text-xs uppercase text-black">
                            {tech.name}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="space-y-1 font-mono text-xs">
                          {Object.entries(tech).map(([key, value]) => {
                            if (key === 'name' || key === 'icon') return null;
                            return (
                              <div key={key} className="flex justify-between items-center">
                                <span className="text-black/60 uppercase text-[10px]">{key}:</span>
                                <span className="text-black font-bold bg-yellow-400/20 px-1">
                                  {value as string}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bottom accent bar */}
                      <div className="h-2 bg-black group-hover:bg-yellow-400 transition-colors"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* System diagram */}
        <div className="mt-12 p-6 border-4 border-black bg-yellow-400">
          <div className="flex items-center justify-center space-x-8 font-mono text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-black"></div>
              <span className="text-black font-bold">FRONTEND</span>
            </div>
            <span className="text-black">→</span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-black"></div>
              <span className="text-black font-bold">API</span>
            </div>
            <span className="text-black">→</span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-black"></div>
              <span className="text-black font-bold">DATABASE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
