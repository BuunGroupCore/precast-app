interface TursoIconProps {
  className?: string;
}

export const TursoIcon: React.FC<TursoIconProps> = ({ className }) => (
  <img src="/icons/turso.svg" alt="Turso" className={`w-6 h-6 ${className || ""}`} />
);
