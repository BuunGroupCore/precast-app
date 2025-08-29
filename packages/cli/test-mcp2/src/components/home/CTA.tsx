import { ArrowRight, Github, BookOpen, Zap, Coffee } from 'lucide-react';

/**
 * Call-to-Action component - Brutalist style with strong messaging
 */
export function CTA() {
  return (
    <section className="mt-20 mb-20">
      <div className="max-w-4xl mx-auto">
        {/* Main CTA Card */}
        <div className="border-4 border-black bg-yellow-400 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
          {/* Corner accents */}
          <div className="absolute -top-2 -left-2 w-8 h-8 bg-black"></div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-black"></div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-black"></div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black"></div>

          <div className="p-12 text-center">
            <h2 className="text-5xl font-black uppercase text-black mb-4">SHIP FASTER</h2>
            <p className="text-xl text-black/80 mb-8 font-mono">
              YOUR STACK IS CONFIGURED. START BUILDING NOW.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="flex items-center space-x-2 px-3 py-1 bg-black text-yellow-400 font-bold text-xs uppercase">
                <Zap size={14} />
                <span>HOT RELOAD</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-black text-yellow-400 font-bold text-xs uppercase">
                <Coffee size={14} />
                <span>ZERO CONFIG</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-black text-yellow-400 font-bold text-xs uppercase">
                <BookOpen size={14} />
                <span>FULL DOCS</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://precast.dev/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-black text-yellow-400 font-bold uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
              >
                <BookOpen size={18} />
                <span>READ DOCS</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="https://github.com/BuunGroupCore/precast-app"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black border-2 border-black font-bold uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
              >
                <Github size={18} />
                <span>STAR ON GITHUB</span>
              </a>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="border-2 border-black bg-white p-4 text-center">
            <div className="text-2xl font-black text-black">100%</div>
            <div className="text-xs font-mono text-black/60 uppercase">Type Safe</div>
          </div>
          <div className="border-2 border-black bg-white p-4 text-center">
            <div className="text-2xl font-black text-black">0ms</div>
            <div className="text-xs font-mono text-black/60 uppercase">Setup Time</div>
          </div>
          <div className="border-2 border-black bg-white p-4 text-center">
            <div className="text-2xl font-black text-black">∞</div>
            <div className="text-xs font-mono text-black/60 uppercase">Possibilities</div>
          </div>
        </div>
      </div>
    </section>
  );
}
