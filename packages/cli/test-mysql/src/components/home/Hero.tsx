"use client";

import { APP_CONFIG } from "@/config/constants";
import { Terminal, Zap, Database, Server } from "lucide-react";
import { SiReact, SiTypescript } from "react-icons/si";
import { useState, useEffect } from "react";

/**
 * Hero section component - Brutalist console-inspired design
 */
export function Hero() {
  const [typedText, setTypedText] = useState("");
  const appName = APP_CONFIG?.displayName || "test-mysql";
  const fullText = `> INITIALIZING ${appName.toUpperCase()}...`;

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

  const techStack = [
    { name: "REACT", icon: <SiReact size={20} />, color: "text-black" },
    { name: "TYPESCRIPT", icon: <SiTypescript size={20} />, color: "text-black" },
  ];

  return (
    <div className="hero-section">
      {/* Terminal-style header */}
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-title-group">
            <Terminal size={16} className="icon-primary" />
            <span className="terminal-title">System Terminal v1.0</span>
          </div>
          <div className="terminal-controls">
            <div className="control-dot"></div>
            <div className="control-dot"></div>
            <div className="control-dot"></div>
          </div>
        </div>

        <div className="terminal-content">
          <div className="terminal-output">
            {typedText}
            <span className="terminal-cursor">_</span>
          </div>

          <div className="system-status">
            <div className="status-line">
              <span className="status-ok">[OK]</span>
              <span className="status-text">Loading React framework...</span>
              <Zap size={14} className="icon-primary" />
            </div>
            <div className="status-line">
              <span className="status-ok">[OK]</span>
              <span className="status-text">Connecting to none API...</span>
              <Server size={14} className="icon-primary" />
            </div>
            <div className="status-line">
              <span className="status-ok">[OK]</span>
              <span className="status-text">Database connection established...</span>
              <Database size={14} className="icon-primary" />
            </div>
            <div className="status-summary">
              <span className="status-label">STATUS: </span>
              <span className="status-operational">OPERATIONAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Separator line */}
      <div className="section-separator">
        <div className="separator-line"></div>
        <div className="separator-diamond"></div>
        <div className="separator-line"></div>
      </div>

      {/* Project title with brutalist style - reduced size */}
      <div className="project-title">
        <h1 className="hero-title">{appName.toUpperCase()}</h1>
      </div>

      {/* Another separator */}
      <div className="section-separator">
        <div className="separator-line-thin"></div>
        <div className="separator-text">Stack</div>
        <div className="separator-line-thin"></div>
      </div>

      {/* Tech stack badges - improved design */}
      <div className="tech-stack-grid">
        {techStack.map((tech, idx) => (
          <div key={idx} className="tech-card">
            <div className="tech-card-shadow"></div>
            <div className="tech-card-content">
              <div className="tech-card-inner">
                <div className="tech-icon">{tech.icon}</div>
                <span className="tech-name">{tech.name}</span>
              </div>
              {/* Active indicator */}
              <div className="tech-indicator"></div>
            </div>
          </div>
        ))}
      </div>

      {/* System info bar */}
      <div className="system-info">
        <div className="system-bar">
          <div className="system-item">
            <div className="status-dot"></div>
            <span>Port: 5173</span>
          </div>
          <div className="system-item">
            <div className="status-dot"></div>
            <span>API: 3001</span>
          </div>
          <div className="system-item">
            <div className="status-dot"></div>
            <span>DB: false</span>
          </div>
        </div>
      </div>
    </div>
  );
}
