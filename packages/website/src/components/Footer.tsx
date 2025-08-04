import { Link } from "react-router-dom";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaDiscord,
  FaExternalLinkAlt,
  FaBook,
  FaRocket,
  FaCode,
  FaCube,
  FaTerminal,
  FaEnvelope,
  FaHeart,
} from "react-icons/fa";
import { SiNpm } from "react-icons/si";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer
      className="border-t-4 py-8 sm:py-12 px-4 relative overflow-hidden"
      style={{
        borderColor: "var(--comic-black)",
        backgroundColor: "var(--comic-black)",
      }}
    >
      {/* Comic book effect dots */}
      <div className="absolute inset-0 opacity-5">
        <div className="halftone h-full" style={{ color: "var(--comic-yellow)" }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
              <img
                src="https://brutalist.precast.dev/logo.png"
                alt="Precast Logo"
                className="h-12 filter brightness-0 invert"
              />
            </motion.div>
            <p className="font-comic text-comic-white text-sm">
              The superhero CLI builder for modern web projects.
            </p>
            <div className="flex gap-3">
              <motion.a
                href="https://github.com/BuunGroupCore/precast-app"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="text-comic-white hover:text-comic-yellow transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub size={20} />
              </motion.a>
              <motion.a
                href="https://www.npmjs.com/package/create-precast-app"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="text-comic-white hover:text-comic-red transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiNpm size={20} />
              </motion.a>
              <motion.a
                href="https://x.com/buungroup"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="text-comic-white hover:text-comic-yellow transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter size={20} />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/company/buun-group"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="text-comic-white hover:text-comic-yellow transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin size={20} />
              </motion.a>
              <motion.a
                href="https://discord.gg/4Wen9Pg3rG"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="text-comic-white hover:text-comic-yellow transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaDiscord size={20} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-comic-yellow text-xl mb-4 flex items-center gap-2">
              <FaRocket className="text-comic-red" />
              QUICK ACCESS
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/builder"
                  className="font-comic text-comic-white hover:text-comic-yellow transition-colors flex items-center gap-2 group"
                >
                  <FaTerminal className="text-comic-blue group-hover:text-comic-yellow" />
                  <span>Builder</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/components"
                  className="font-comic text-comic-white hover:text-comic-yellow transition-colors flex items-center gap-2 group"
                >
                  <FaCube className="text-comic-green group-hover:text-comic-yellow" />
                  <span>Components</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/docs"
                  className="font-comic text-comic-white hover:text-comic-yellow transition-colors flex items-center gap-2 group"
                >
                  <FaBook className="text-comic-purple group-hover:text-comic-yellow" />
                  <span>Documentation</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-comic-yellow text-xl mb-4 flex items-center gap-2">
              <FaCode className="text-comic-green" />
              RESOURCES
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/docs/getting-started"
                  className="font-comic text-comic-white hover:text-comic-yellow transition-colors flex items-center gap-2"
                >
                  <span className="text-comic-red">→</span>
                  Getting Started
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  className="font-comic text-comic-white hover:text-comic-yellow transition-colors flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-comic-blue">→</span>
                  GitHub
                  <FaExternalLinkAlt size={10} />
                </a>
              </li>
              <li>
                <a
                  href="/docs/api"
                  className="font-comic text-comic-white hover:text-comic-yellow transition-colors flex items-center gap-2"
                >
                  <span className="text-comic-green">→</span>
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="https://brutalist.precast.dev"
                  className="font-comic text-comic-white hover:text-comic-yellow transition-colors flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-comic-purple">→</span>
                  UI Library
                  <FaExternalLinkAlt size={10} />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-display text-comic-yellow text-xl mb-4 flex items-center gap-2">
              <FaEnvelope className="text-comic-purple" />
              SUPPORT
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@precast.dev"
                  className="font-comic text-comic-white hover:text-comic-yellow transition-colors"
                >
                  support@precast.dev
                </a>
              </li>
              <li>
                <a
                  href="https://discord.com"
                  className="font-comic text-comic-white hover:text-comic-yellow transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Discord Community
                </a>
              </li>
              <li>
                <a
                  href="/docs/faq"
                  className="font-comic text-comic-white hover:text-comic-yellow transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-comic-yellow/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="font-comic text-comic-white flex items-center gap-2">
                Built with <FaHeart className="text-comic-red animate-pulse" /> by
              </span>
              <motion.a
                href="https://buungroup.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group"
                whileHover={{ scale: 1.05 }}
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
              </motion.a>
            </div>
            <div className="font-comic text-comic-white text-sm">
              © 2025 PRECAST · All rights reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
