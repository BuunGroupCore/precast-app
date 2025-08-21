"use client";

import { useState } from "react";
import { Terminal, Play, Database, Server, Package } from "lucide-react";

/**
 * Getting Started component - Console-style command reference
 */
export function GettingStarted() {
  const [activeTab, setActiveTab] = useState("development");

  const commands = {
    development: [
      { cmd: "bun run dev", desc: "Start all services", icon: <Play size={14} /> },
      { cmd: "bun run docker:up", desc: "Start Docker containers", icon: <Server size={14} /> },
      { cmd: "bun run db:migrate", desc: "Run database migrations", icon: <Database size={14} /> },
    ],
    production: [
      { cmd: "bun run build", desc: "Build for production", icon: <Package size={14} /> },
      { cmd: "bun run start", desc: "Start production server", icon: <Play size={14} /> },
      { cmd: "docker compose up -d", desc: "Deploy with Docker", icon: <Server size={14} /> },
    ],
    testing: [
      { cmd: "bun test", desc: "Run test suite", icon: <Terminal size={14} /> },
      { cmd: "bun run lint", desc: "Check code quality", icon: <Terminal size={14} /> },
      { cmd: "bun run type-check", desc: "TypeScript validation", icon: <Terminal size={14} /> },
    ],
  };

  const tabs = [
    { id: "development", label: "DEV", color: "bg-yellow-400" },
    { id: "production", label: "PROD", color: "bg-black" },
    { id: "testing", label: "TEST", color: "bg-white" },
  ];

  return (
    <section className="getting-started-section">
      <div className="container">
        {/* Section header */}
        <div className="section-header">
          <h2 className="brutalist-title">QUICK START</h2>
        </div>

        {/* Terminal window */}
        <div className="terminal-window">
          {/* Terminal header */}
          <div className="terminal-header">
            <div className="terminal-title-group">
              <Terminal size={16} className="icon-primary" />
              <span className="terminal-title">Command Reference</span>
            </div>

            {/* Tab buttons */}
            <div className="tab-buttons">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn`}
                  data-active={activeTab === tab.id}
                  data-type={tab.id}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal content */}
          <div className="terminal-content">
            <div className="commands-list">
              {commands[activeTab as keyof typeof commands].map((item, idx) => (
                <div key={idx} className="command-item">
                  <div className="command-icon">{item.icon}</div>
                  <div className="command-content">
                    <div className="command-line">
                      <span className="prompt">$</span>
                      <code className="command-text">{item.cmd}</code>
                    </div>
                    <p className="command-desc"># {item.desc}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(item.cmd)}
                    className="copy-btn"
                  >
                    COPY
                  </button>
                </div>
              ))}
            </div>

            {/* Pro tip */}
            <div className="pro-tip">
              <div className="tip-content">
                <span className="tip-label">TIP:</span>
                <p className="tip-text">
                  Run <code className="inline-code">bun run docker:ps</code> to check container
                  status
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
