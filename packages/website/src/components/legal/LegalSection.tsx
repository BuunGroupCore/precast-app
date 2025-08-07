import { motion } from "framer-motion";

interface LegalSectionProps {
  icon: React.ReactNode;
  title: string;
  iconColor: string;
  delay?: number;
  gradient?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  children: React.ReactNode;
}

export function LegalSection({
  icon,
  title,
  iconColor,
  delay = 0,
  gradient = false,
  gradientFrom,
  gradientTo,
  children,
}: LegalSectionProps) {
  const backgroundClass =
    gradient && gradientFrom && gradientTo
      ? `bg-gradient-to-r ${gradientFrom} ${gradientTo}`
      : "bg-comic-white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`border-8 border-comic-black rounded-lg ${backgroundClass} shadow-2xl p-8`}
    >
      <div className="flex items-center mb-6">
        <div className={`h-8 w-8 ${iconColor} mr-4`}>{icon}</div>
        <h2 className="font-comic text-3xl font-bold text-comic-red">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}
