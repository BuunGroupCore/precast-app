import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { IconType } from "react-icons";

interface Option {
  id: string;
  name: string;
  icon?: IconType | React.FC<{ className?: string }> | string | null;
  color?: string;
}

interface ComicSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

/**
 * Comic-style select dropdown component with animated transitions.
 * Supports icons and custom colors for each option.
 */
export const ComicSelect: React.FC<ComicSelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderIcon = (option: Option) => {
    if (!option.icon) return null;

    if (typeof option.icon === "string") {
      return <img src={`/icons/${option.icon}.svg`} alt={option.name} className="w-5 h-5" />;
    } else {
      const Icon = option.icon as IconType;
      return <Icon className={`text-lg ${option.color || ""}`} />;
    }
  };

  return (
    <div ref={selectRef} className="relative">
      {label && <label className="block font-comic text-sm font-bold mb-1">{label}</label>}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="comic-select w-full text-left flex items-center gap-2"
      >
        {selectedOption ? (
          <>
            {renderIcon(selectedOption)}
            <span>{selectedOption.name}</span>
          </>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full bg-comic-white border-3 border-comic-black rounded-lg shadow-lg overflow-hidden"
            style={{ boxShadow: "4px 4px 0 var(--comic-black)" }}
          >
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 flex items-center gap-2 font-comic font-bold text-sm hover:bg-comic-yellow transition-colors ${
                  value === option.id ? "bg-comic-red text-comic-white" : "text-comic-black"
                }`}
              >
                {renderIcon(option)}
                <span>{option.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
