import { motion } from "framer-motion";

interface ComicPageSeparatorProps {
  topColor: string;
  bottomColor: string;
  text?: string;
  icon?: React.ReactNode;
  pageNumber?: number;
  textBgColor?: string;
  textColor?: string;
  nextSectionId?: string;
}

/**
 * Comic book style page separator that creates a visual transition between sections.
 * Features torn paper effect and optional action text.
 */
export function ComicPageSeparator({
  topColor,
  bottomColor,
  text,
  icon,
  pageNumber = 1,
  textBgColor = "var(--comic-yellow)",
  textColor = "var(--comic-white)",
  nextSectionId,
}: ComicPageSeparatorProps) {
  const handleClick = () => {
    if (nextSectionId) {
      const element = document.getElementById(nextSectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="relative w-full h-24 sm:h-32" style={{ marginBottom: "-1px" }}>
      {/* Torn edge transition */}
      <svg
        className="absolute top-0 w-full h-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 L0,40 C80,60 160,30 240,45 C320,60 400,30 480,45 C560,60 640,30 720,45 C800,60 880,30 960,45 C1040,60 1120,30 1200,45 L1200,0 Z"
          style={{ fill: topColor }}
        />
        <path
          d="M0,40 C80,60 160,30 240,45 C320,60 400,30 480,45 C560,60 640,30 720,45 C800,60 880,30 960,45 C1040,60 1120,30 1200,45 L1200,120 L0,120 Z"
          style={{ fill: bottomColor }}
        />
      </svg>

      {/* Action text in center */}
      {text && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", duration: 0.6 }}
          className="absolute top-1/2 left-4 sm:left-1/2 transform -translate-y-1/2 sm:-translate-x-1/2 z-20"
        >
          <motion.button
            onClick={handleClick}
            whileHover={{
              scale: 1.1,
              rotate: -2,
              boxShadow: "6px 6px 0 var(--comic-black), 12px 12px 0 rgba(0,0,0,0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            className="inline-block font-display uppercase px-2 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 rounded-full border-2 sm:border-4 border-comic-black shadow-2xl transform rotate-2 cursor-pointer transition-all"
            style={{
              backgroundColor: textBgColor,
              color: textColor,
              boxShadow: "4px 4px 0 var(--comic-black), 8px 8px 0 rgba(0,0,0,0.3)",
              fontSize: "clamp(0.875rem, 3vw, 1.875rem)",
              textShadow:
                "2px 2px 0 var(--comic-black), -1px -1px 0 var(--comic-black), 1px -1px 0 var(--comic-black), -1px 1px 0 var(--comic-black), 1px 1px 0 var(--comic-black)",
            }}
          >
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              {icon && <span style={{ fontSize: "1.2em" }}>{icon}</span>}
              <span className="whitespace-nowrap">{text}</span>
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* Page number style element - positioned to avoid overlap on mobile */}
      <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-6 bg-comic-white border border-comic-black sm:border-2 px-2 sm:px-3 py-0.5 sm:py-1 transform rotate-2 z-10">
        <span className="font-comic text-[10px] sm:text-xs text-comic-black font-bold">
          PAGE {pageNumber}
        </span>
      </div>
    </div>
  );
}
