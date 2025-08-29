import { ArrowLeft, Home, Terminal, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

/**
 * 404 Not Found page - Brutalist terminal-style error page
 */
export function NotFoundPage() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const fullText = '> ERROR 404: RESOURCE_NOT_FOUND';

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
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Terminal window */}
        <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          {/* Terminal header */}
          <div className="bg-black px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal size={16} className="text-yellow-400" />
              <span className="text-yellow-400 font-mono text-sm uppercase tracking-wider">
                System Error
              </span>
            </div>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 border border-red-700"></div>
              <div className="w-3 h-3 bg-yellow-400 border border-yellow-600"></div>
              <div className="w-3 h-3 bg-green-500 border border-green-700"></div>
            </div>
          </div>

          {/* Terminal content */}
          <div className="p-8 font-mono">
            <div className="text-black text-lg mb-4">
              {typedText}
              <span className="animate-pulse">_</span>
            </div>

            {/* Error details */}
            <div className="space-y-2 text-sm mb-6">
              <div className="flex items-start space-x-2">
                <span className="text-red-600">[FAIL]</span>
                <span className="text-black">Route not found in application registry</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-600">[WARN]</span>
                <span className="text-black">Attempted to access: {window.location.pathname}</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-black/60">[INFO]</span>
                <span className="text-black">Timestamp: {new Date().toISOString()}</span>
              </div>
            </div>

            {/* ASCII art 404 */}
            <div className="bg-yellow-400 border-2 border-black p-4 mb-6">
              <pre className="text-black text-xs text-center font-mono">
                {`╔══════════════════════════════╗
║  ██╗  ██╗ ██████╗ ██╗  ██╗  ║
║  ██║  ██║██╔═████╗██║  ██║  ║
║  ███████║██║██╔██║███████║  ║
║  ╚════██║████╔╝██║╚════██║  ║
║       ██║╚██████╔╝     ██║  ║
║       ╚═╝ ╚═════╝      ╚═╝  ║
╚══════════════════════════════╝`}
              </pre>
            </div>

            {/* Error message */}
            <div className="border-2 border-black p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
                <div>
                  <h2 className="text-black font-bold uppercase text-lg mb-2">Page Not Found</h2>
                  <p className="text-black/70 text-sm">
                    The requested resource could not be located on this server. Please verify the
                    URL and try again.
                  </p>
                </div>
              </div>
            </div>

            {/* Stack trace (fake but fun) */}
            <details className="mb-6">
              <summary className="cursor-pointer text-xs text-black/60 hover:text-black uppercase tracking-wider">
                [Click to expand stack trace]
              </summary>
              <div className="mt-2 p-2 bg-black/5 border border-black/20 text-xs text-black/60 font-mono">
                <div>at Router.match (/src/router/index.ts:42:15)</div>
                <div>at Application.handleRequest (/src/app.tsx:128:23)</div>
                <div>at processRequest (/node_modules/react-router/route.js:95:12)</div>
                <div>at async Server.respond (/src/server.ts:67:5)</div>
              </div>
            </details>

            {/* Action prompt */}
            <div className="text-black text-sm mb-4">
              <span className="text-black/60">$</span> Select recovery option:
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="group flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-black border-2 border-black font-bold uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>GO BACK</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="group flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 text-black border-2 border-black font-bold uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
          >
            <Home size={16} />
            <span>HOME</span>
          </button>
        </div>

        {/* System status indicators */}
        <div className="flex justify-center items-center gap-4 mt-8 font-mono text-xs text-black/60">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 border border-black animate-pulse"></div>
            <span>SYSTEM: OK</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 border border-black animate-pulse"></div>
            <span>ROUTER: ERROR</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 border border-black animate-pulse"></div>
            <span>API: OK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
