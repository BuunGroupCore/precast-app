import { ArrowLeft, Home, Terminal, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

/**
 * 404 Not Found page - Brutalist terminal-style error page
 */
export function NotFoundPage() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const fullText = "> ERROR 404: RESOURCE_NOT_FOUND";

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
    <div className="error-page">
      <div className="error-container">
        {/* Terminal window */}
        <div className="error-terminal">
          {/* Terminal header */}
          <div className="terminal-header">
            <div className="terminal-title-group">
              <Terminal size={16} className="icon-primary" />
              <span className="terminal-title">System Error</span>
            </div>
            <div className="terminal-controls">
              <div className="control-dot control-red"></div>
              <div className="control-dot control-yellow"></div>
              <div className="control-dot control-green"></div>
            </div>
          </div>

          {/* Terminal content */}
          <div className="error-details">
            <div className="terminal-prompt">
              {typedText}
              <span className="terminal-cursor">_</span>
            </div>

            {/* Error details */}
            <div className="error-logs">
              <div className="log-item">
                <span className="error-status error-fail">[FAIL]</span>
                <span className="log-message">Route not found in application registry</span>
              </div>
              <div className="log-item">
                <span className="error-status error-warn">[WARN]</span>
                <span className="log-message">Attempted to access: {window.location.pathname}</span>
              </div>
              <div className="log-item">
                <span className="error-status error-info">[INFO]</span>
                <span className="log-message">Timestamp: {new Date().toISOString()}</span>
              </div>
            </div>

            {/* ASCII art 404 */}
            <div className="ascii-box">
              <pre className="ascii-art">
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
            <div className="error-message-box">
              <div className="error-message-content">
                <AlertTriangle className="icon-warning" size={20} />
                <div>
                  <h2 className="error-title">Page Not Found</h2>
                  <p className="error-description">
                    The requested resource could not be located on this server. Please verify the
                    URL and try again.
                  </p>
                </div>
              </div>
            </div>

            {/* Stack trace (fake but fun) */}
            <details className="stack-trace">
              <summary className="stack-trace-summary">[Click to expand stack trace]</summary>
              <div className="stack-trace-content">
                <div>at Router.match (/src/router/index.ts:42:15)</div>
                <div>at Application.handleRequest (/src/app.tsx:128:23)</div>
                <div>at processRequest (/node_modules/react-router/route.js:95:12)</div>
                <div>at async Server.respond (/src/server.ts:67:5)</div>
              </div>
            </details>

            {/* Action prompt */}
            <div className="action-prompt">
              <span className="prompt-symbol">$</span> Select recovery option:
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="action-buttons">
          <button onClick={() => navigate(-1)} className="btn-brutalist btn-brutalist-white">
            <ArrowLeft size={16} className="btn-icon" />
            <span>GO BACK</span>
          </button>

          <button onClick={() => navigate("/")} className="btn-brutalist">
            <Home size={16} />
            <span>HOME</span>
          </button>
        </div>

        {/* System status indicators */}
        <div className="system-status">
          <div className="system-bar">
            <div className="status-item">
              <div className="status-indicator status-ok"></div>
              <span>SYSTEM: OK</span>
            </div>
            <div className="status-item">
              <div className="status-indicator status-warning"></div>
              <span>ROUTER: ERROR</span>
            </div>
            <div className="status-item">
              <div className="status-indicator status-ok"></div>
              <span>API: OK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
