import { ArrowRight, Github, BookOpen, Zap, Coffee } from "lucide-react";

/**
 * Call-to-Action component - Brutalist style with strong messaging
 */
export function CTA() {
  return (
    <section className="cta-section">
      <div className="container">
        {/* Main CTA Card */}
        <div className="cta-card">
          {/* Corner accents */}
          <div className="corner-accent corner-tl"></div>
          <div className="corner-accent corner-tr"></div>
          <div className="corner-accent corner-bl"></div>
          <div className="corner-accent corner-br"></div>

          <div className="cta-content">
            <h2 className="cta-title">SHIP FASTER</h2>
            <p className="cta-description">YOUR STACK IS CONFIGURED. START BUILDING NOW.</p>

            {/* Feature badges */}
            <div className="feature-badges">
              <div className="feature-badge">
                <Zap size={14} />
                <span>HOT RELOAD</span>
              </div>
              <div className="feature-badge">
                <Coffee size={14} />
                <span>ZERO CONFIG</span>
              </div>
              <div className="feature-badge">
                <BookOpen size={14} />
                <span>FULL DOCS</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="cta-buttons">
              <a
                href="https://precast.dev/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <BookOpen size={18} />
                <span>READ DOCS</span>
                <ArrowRight size={18} className="btn-arrow" />
              </a>

              <a
                href="https://github.com/BuunGroupCore/precast-app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <Github size={18} />
                <span>STAR ON GITHUB</span>
              </a>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">100%</div>
            <div className="stat-label">Type Safe</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">0ms</div>
            <div className="stat-label">Setup Time</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">∞</div>
            <div className="stat-label">Possibilities</div>
          </div>
        </div>
      </div>
    </section>
  );
}
