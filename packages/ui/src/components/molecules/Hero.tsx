import { motion } from "framer-motion";
import { Button } from "../atoms/Button";

export interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export function Hero({ title, subtitle, ctaText, onCtaClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-20 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-transparent to-secondary-100 opacity-50" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-display font-bold text-gradient mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        )}

        {ctaText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              size="lg"
              onClick={onCtaClick}
              className="animate-bounce-slow"
            >
              {ctaText}
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
