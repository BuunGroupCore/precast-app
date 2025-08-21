import { Code2, Layers, Package2 } from "lucide-react";
import { SiReact, SiTypescript, SiBun, SiDocker } from "react-icons/si";

/**
 * Technology Stack component - Grid layout with brutalist cards
 */
export function TechnologyStack() {
  const technologies = [
    {
      category: "FRONTEND",
      items: [
        { name: "React", icon: <SiReact size={24} />, version: "18.3", port: "5173" },
        { name: "TypeScript", icon: <SiTypescript size={24} />, version: "5.7", strict: "YES" },
      ],
    },
    {
      category: "BACKEND",
      items: [{ name: "Docker", icon: <SiDocker size={24} />, version: "25", status: "RUNNING" }],
    },
    {
      category: "TOOLING",
      items: [
        { name: "Bun", icon: <SiBun size={24} />, version: "1.2", speed: "ULTRA" },
        { name: "Turbo", icon: <Package2 size={24} />, version: "1.12", cache: "ENABLED" },
        { name: "ESLint", icon: <Code2 size={24} />, version: "8.57", rules: "STRICT" },
        { name: "Prettier", icon: <Layers size={24} />, version: "3.0", format: "AUTO" },
      ],
    },
  ];

  return (
    <section className="technology-section">
      <div className="container">
        {/* Section header */}
        <div className="section-header">
          <h2 className="brutalist-title">TECHNOLOGY MATRIX</h2>
        </div>

        {/* Tech grid */}
        <div className="tech-grid">
          {technologies.map((category, catIdx) => (
            <div key={catIdx}>
              {/* Category header */}
              <div className="category-header">
                <div className="category-label">{category.category}</div>
                <div className="category-line"></div>
              </div>

              {/* Tech cards */}
              <div className="tech-cards">
                {category.items.map((tech, idx) => (
                  <div key={idx} className="tech-card">
                    {/* Shadow effect */}
                    <div className="card-shadow"></div>

                    {/* Card content */}
                    <div className="card-content">
                      {/* Status indicator */}
                      <div className="status-indicator"></div>

                      <div className="card-inner">
                        {/* Icon and name header */}
                        <div className="card-header">
                          <div className="tech-icon">{tech.icon}</div>
                          <span className="tech-name">{tech.name}</span>
                        </div>

                        {/* Stats */}
                        <div className="tech-stats">
                          {Object.entries(tech).map(([key, value]) => {
                            if (key === "name" || key === "icon") return null;
                            return (
                              <div key={key} className="stat-row">
                                <span className="stat-key">{key}:</span>
                                <span className="stat-value">{value as string}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bottom accent bar */}
                      <div className="accent-bar"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* System diagram */}
        <div className="system-diagram">
          <div className="diagram-content">
            <div className="diagram-item">
              <div className="diagram-icon"></div>
              <span className="diagram-label">FRONTEND</span>
            </div>
            <span className="diagram-arrow">→</span>
            <div className="diagram-item">
              <div className="diagram-icon"></div>
              <span className="diagram-label">API</span>
            </div>
            <span className="diagram-arrow">→</span>
            <div className="diagram-item">
              <div className="diagram-icon"></div>
              <span className="diagram-label">DATABASE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
