import { motion } from "framer-motion";
import { Button } from "../atoms/Button";

export interface HeaderProps {
  logo?: string;
  links?: Array<{ label: string; href: string }>;
  onLogoClick?: () => void;
}

export function Header({
  logo = "Precast",
  links = [],
  onLogoClick,
}: HeaderProps) {
  return (
    <motion.header
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex-shrink-0 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogoClick}
          >
            <h1 className="text-2xl font-display font-bold text-gradient">
              {logo}
            </h1>
          </motion.div>

          <nav className="hidden md:flex space-x-8">
            {links.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                whileHover={{ y: -2 }}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
