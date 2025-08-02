import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import {
  FaRocket,
  FaCode,
  FaCog,
  FaTerminal,
  FaGithub,
  FaBolt,
  FaTwitter,
  FaLinkedin,
  FaDiscord,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { BiCommand } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi";

export function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: FaRocket,
      title: "ROCKET SPEED",
      description: "Launch your project faster than a speeding bullet!",
      color: "var(--comic-red)",
      textColor: "var(--comic-white)",
      effect: "POW!",
    },
    {
      icon: FaCog,
      title: "SUPER CONFIG",
      description: "Configure your stack with superhero precision!",
      color: "var(--comic-blue)",
      textColor: "var(--comic-white)",
      effect: "ZAP!",
    },
    {
      icon: FaCode,
      title: "CLEAN CODE",
      description: "Write code that would make heroes proud!",
      color: "var(--comic-green)",
      textColor: "var(--comic-black)",
      effect: "BAM!",
    },
    {
      icon: HiSparkles,
      title: "TYPE POWER",
      description: "TypeScript superpowers at your fingertips!",
      color: "var(--comic-purple)",
      textColor: "var(--comic-white)",
      effect: "BOOM!",
    },
  ];

  return (
    <div className="min-h-screen comic-cursor overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 right-0 z-50 p-4">
        <ThemeSwitcher />
      </header>
      {/* Hero Section */}
      <section className="relative">
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Logo with Comic Effect */}
            <div className="relative inline-block mb-8">
              <img
                src="https://brutalist.precast.dev/logo.png"
                alt="Precast Logo"
                className="h-32 mx-auto filter drop-shadow-lg"
                style={{
                  filter: "hue-rotate(340deg) saturate(2) brightness(1.2)",
                }}
              />
            </div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <span className="action-text text-7xl md:text-9xl text-comic-red">
                PRECAST
              </span>
              <br />
              <span className="font-display text-4xl md:text-5xl text-comic-black">
                The Superhero CLI Builder
              </span>
            </motion.h1>

            {/* Subtitle in Speech Bubble */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-block mb-12"
            >
              <div className="speech-bubble max-w-2xl">
                <p className="font-comic text-xl md:text-2xl">
                  Build TypeScript projects with{" "}
                  <strong>SUPERHUMAN SPEED!</strong>
                  Choose your stack, configure your powers, and launch into
                  action!
                </p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <motion.button
                onClick={() => navigate("/builder")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-pow flex items-center gap-3"
              >
                <FaTerminal className="text-2xl" />
                <span>OPEN BUILDER</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-bam"
              >
                READ ORIGIN STORY
              </motion.button>
            </motion.div>

            {/* Quick Start Terminal */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-16 max-w-3xl mx-auto"
            >
              <div className="comic-panel p-6 bg-comic-black">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-comic-red border border-comic-black" />
                    <div className="w-3 h-3 rounded-full bg-comic-yellow border border-comic-black" />
                    <div className="w-3 h-3 rounded-full bg-comic-green border border-comic-black" />
                  </div>
                  <span className="font-display text-comic-green">
                    QUICK START
                  </span>
                </div>
                <div className="font-mono text-lg">
                  <span className="text-comic-yellow">$</span>{" "}
                  <span className="text-comic-green">
                    npx create-precast-app
                  </span>{" "}
                  <span className="text-comic-blue">my-super-app</span>
                  <span className="animate-pulse text-comic-green ml-2">_</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative" style={{ backgroundColor: 'var(--comic-yellow)' }}>
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="action-text text-5xl md:text-7xl text-comic-black mb-4">
              SUPER POWERS
            </h2>
            <p className="font-comic text-xl md:text-2xl text-comic-black">
              Every hero needs their special abilities!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div
                  className="comic-card text-center"
                  style={{ backgroundColor: feature.color, color: feature.textColor }}
                >
                  <div className="absolute -top-6 -right-6 action-text text-3xl text-comic-red opacity-50">
                    {feature.effect}
                  </div>
                  <feature.icon className="text-6xl mx-auto mb-4" />
                  <h3 className="font-display text-2xl mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-comic">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack Preview */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">
              <span className="action-text text-5xl md:text-7xl text-comic-purple">
                CHOOSE YOUR ARSENAL
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="comic-panel bg-comic-white p-8 md:p-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="action-text text-3xl text-comic-red">
                  FRONTEND
                </div>
                <div className="space-y-1">
                  <p className="font-comic font-bold">React</p>
                  <p className="font-comic font-bold">Vue</p>
                  <p className="font-comic font-bold">Angular</p>
                  <p className="font-comic font-bold">Next.js</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="action-text text-3xl text-comic-blue">
                  BACKEND
                </div>
                <div className="space-y-1">
                  <p className="font-comic font-bold">Node.js</p>
                  <p className="font-comic font-bold">Express</p>
                  <p className="font-comic font-bold">FastAPI</p>
                  <p className="font-comic font-bold">Hono</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="action-text text-3xl text-comic-green">
                  DATABASE
                </div>
                <div className="space-y-1">
                  <p className="font-comic font-bold">PostgreSQL</p>
                  <p className="font-comic font-bold">MongoDB</p>
                  <p className="font-comic font-bold">MySQL</p>
                  <p className="font-comic font-bold">Supabase</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="action-text text-3xl text-comic-purple">
                  STYLE
                </div>
                <div className="space-y-1">
                  <p className="font-comic font-bold">Tailwind CSS</p>
                  <p className="font-comic font-bold">CSS/SCSS</p>
                  <p className="font-comic font-bold">Styled</p>
                  <p className="font-comic font-bold">Components</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/builder")}
              className="btn-zap mx-auto mt-8 flex items-center gap-2"
            >
              <FaBolt />
              BUILD YOUR STACK
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--comic-red)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <h2 className="action-text text-5xl md:text-7xl text-comic-yellow mb-6">
            READY FOR ACTION?
          </h2>

          <div className="speech-bubble bg-comic-white text-comic-black max-w-2xl mx-auto mb-8">
            <p className="font-comic text-xl">
              Join the <strong>LEAGUE OF EXTRAORDINARY DEVELOPERS</strong> and
              build amazing projects with superhero speed!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate("/builder")}
              className="btn-comic bg-comic-yellow text-comic-black hover:bg-comic-darkYellow flex items-center gap-2 justify-center"
            >
              <FaRocket />
              START YOUR MISSION
            </button>

            <a
              href="https://github.com"
              className="btn-comic bg-comic-white text-comic-black hover:bg-gray-100 flex items-center gap-2 justify-center"
            >
              <FaGithub />
              JOIN THE TEAM
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 py-12 px-4" style={{ borderColor: 'var(--comic-black)', backgroundColor: 'var(--comic-black)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <img
                src="https://brutalist.precast.dev/logo.png"
                alt="Precast Logo"
                className="h-12 filter brightness-0 invert"
              />
              <p className="font-comic text-comic-white text-sm">
                The superhero CLI builder for modern web projects.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display text-comic-yellow text-xl mb-4">
                QUICK LINKS
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/builder"
                    className="font-comic text-comic-white hover:text-comic-yellow transition-colors"
                  >
                    Builder
                  </a>
                </li>
                <li>
                  <a
                    href="https://brutalist.precast.dev"
                    className="font-comic text-comic-white hover:text-comic-yellow transition-colors flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Component Library <FaExternalLinkAlt size={12} />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-comic text-comic-white hover:text-comic-yellow transition-colors"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-display text-comic-yellow text-xl mb-4">
                RESOURCES
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="font-comic text-comic-white hover:text-comic-yellow transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    className="font-comic text-comic-white hover:text-comic-yellow transition-colors"
                  >
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-comic text-comic-white hover:text-comic-yellow transition-colors"
                  >
                    API Reference
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-display text-comic-yellow text-xl mb-4">
                CONNECT
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://github.com"
                  className="text-comic-white hover:text-comic-yellow transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub size={24} />
                </a>
                <a
                  href="https://twitter.com"
                  className="text-comic-white hover:text-comic-yellow transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="https://linkedin.com"
                  className="text-comic-white hover:text-comic-yellow transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="https://discord.com"
                  className="text-comic-white hover:text-comic-yellow transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaDiscord size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-comic-yellow/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="font-comic text-comic-white">
                  Built & Designed by
                </span>
                <a
                  href="https://buungroup.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group"
                >
                  <img
                    src="https://buungroup.com/logo/logo.svg"
                    alt="Buun Group"
                    className="h-8 transition-all duration-300 group-hover:scale-110"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(93%) sepia(88%) saturate(1594%) hue-rotate(358deg) brightness(106%) contrast(104%)",
                    }}
                  />
                  <span className="font-display text-comic-yellow group-hover:text-comic-white transition-colors">
                    BUUN GROUP
                  </span>
                </a>
              </div>
              <div className="font-comic text-comic-white text-sm">
                © 2025 PRECAST · All rights reserved
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
