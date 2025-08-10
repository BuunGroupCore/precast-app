interface NeonIconProps {
  className?: string;
}

export const NeonIcon: React.FC<NeonIconProps> = ({ className }) => (
  <img src="/icons/neon.svg" alt="Neon" className={`w-6 h-6 ${className || ""}`} />
);
