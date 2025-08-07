import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaHeart, FaFileContract, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

import { EXTERNAL_LINKS, APP_TAGLINE } from "@/config/constants";
import { footerNavigation, socialLinks } from "@/config/navigation";

/**
 * Footer component displaying project information, links, and resources.
 * Features a comic book aesthetic with social links, quick navigation, and support information.
 */
export function Footer() {
  return (
    <footer
      className="border-t-4 py-8 sm:py-12 px-4 relative overflow-hidden"
      style={{
        borderColor: "var(--comic-black)",
        backgroundColor: "var(--comic-black)",
      }}
    >
      <div className="absolute inset-0 opacity-5">
        <div className="halftone h-full" style={{ color: "var(--comic-yellow)" }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="space-y-4">
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
              <img
                src="https://brutalist.precast.dev/logo.png"
                alt="Precast Logo"
                className="h-12 filter brightness-0 invert"
              />
            </motion.div>
            <p className="font-comic text-comic-white text-sm">{APP_TAGLINE}</p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ scale: 1.2, rotate: index % 2 === 0 ? 5 : -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-comic-white hover:text-comic-yellow transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.name}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {footerNavigation.map((section, index) => {
            const sectionIconColors = ["text-comic-red", "text-comic-green", "text-comic-purple"];
            const SectionIcon = section.icon;

            return (
              <div key={section.title}>
                <h4 className="font-display text-comic-yellow text-xl mb-4 flex items-center gap-2">
                  {SectionIcon && (
                    <SectionIcon className={sectionIconColors[index % sectionIconColors.length]} />
                  )}
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => {
                    const iconColors = [
                      "text-comic-red",
                      "text-comic-blue",
                      "text-comic-green",
                      "text-comic-purple",
                    ];
                    const LinkIcon = link.icon;

                    return (
                      <li key={link.href}>
                        {link.external ? (
                          <a
                            href={link.href}
                            className="font-comic text-comic-white hover:text-comic-yellow transition-colors flex items-center gap-2"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {LinkIcon && (
                              <LinkIcon
                                className={iconColors[linkIndex % iconColors.length]}
                                size={14}
                              />
                            )}
                            {link.label}
                            <FaExternalLinkAlt size={10} />
                          </a>
                        ) : link.href.startsWith("mailto:") ? (
                          <a
                            href={link.href}
                            className="font-comic text-comic-white hover:text-comic-yellow transition-colors flex items-center gap-2"
                          >
                            {LinkIcon && (
                              <LinkIcon
                                className={iconColors[linkIndex % iconColors.length]}
                                size={14}
                              />
                            )}
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            to={link.href}
                            className="font-comic text-comic-white hover:text-comic-yellow transition-colors flex items-center gap-2"
                          >
                            {LinkIcon && (
                              <LinkIcon
                                className={iconColors[linkIndex % iconColors.length]}
                                size={14}
                              />
                            )}
                            {link.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="border-t border-comic-yellow/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="font-comic text-comic-white flex items-center gap-2">
                Built with <FaHeart className="text-comic-red animate-pulse" /> by
              </span>
              <motion.a
                href={EXTERNAL_LINKS.BUUN_GROUP}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src="https://buungroup.com/logo/logo.svg"
                  alt="Buun Group"
                  className="h-8 transition-all duration-300 group-hover:scale-110"
                />
                <span className="font-display text-comic-yellow group-hover:text-comic-white transition-colors">
                  BUUN GROUP
                </span>
              </motion.a>
            </div>
            <div className="font-comic text-comic-white text-sm flex items-center gap-4">
              <span>© 2025 PRECAST · All rights reserved</span>
              <div className="flex items-center gap-3 text-xs">
                <Link
                  to="/legal/terms"
                  className="hover:text-comic-yellow transition-colors flex items-center gap-1"
                >
                  <FaFileContract className="h-3 w-3" />
                  Terms
                </Link>
                <span className="text-comic-white/40">|</span>
                <Link
                  to="/legal/privacy"
                  className="hover:text-comic-yellow transition-colors flex items-center gap-1"
                >
                  <FaShieldAlt className="h-3 w-3" />
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
