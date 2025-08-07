import { useState, useRef, useEffect } from "react";
import {
  FaRocket,
  FaShoppingCart,
  FaReact,
  FaBuilding,
  FaPalette,
  FaMobile,
  FaServer,
  FaFileCode,
  FaCube,
  FaChevronDown,
} from "react-icons/fa";

interface ProjectTypeDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Custom dropdown component for project types with icons.
 */
export function ProjectTypeDropdown({ value, onChange }: ProjectTypeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const projectTypes = [
    { value: "Full-Stack SaaS", icon: FaRocket, color: "text-comic-red" },
    { value: "E-commerce Platform", icon: FaShoppingCart, color: "text-comic-purple" },
    { value: "React + Node.js App", icon: FaReact, color: "text-comic-blue" },
    { value: "Enterprise Dashboard", icon: FaBuilding, color: "text-comic-green" },
    { value: "Design System", icon: FaPalette, color: "text-comic-purple" },
    { value: "Mobile PWA", icon: FaMobile, color: "text-comic-blue" },
    { value: "API Service", icon: FaServer, color: "text-comic-red" },
    { value: "Static Site", icon: FaFileCode, color: "text-comic-yellow" },
    { value: "Other", icon: FaCube, color: "text-comic-gray" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedType = projectTypes.find((t) => t.value === value);
  const SelectedIcon = selectedType?.icon || FaCube;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 pl-12 pr-12 border-4 border-comic-black rounded-lg font-comic text-lg text-left cursor-pointer"
        style={{
          backgroundColor: "var(--comic-white)",
          borderColor: "var(--comic-black)",
          boxShadow: "2px 2px 0 var(--comic-black)",
        }}
      >
        <div className="flex items-center gap-3">
          <SelectedIcon
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl ${
              selectedType?.color || "text-comic-gray"
            }`}
          />
          <span className={value ? "text-comic-black" : "text-comic-gray"}>
            {value || "Select your project type..."}
          </span>
          <FaChevronDown
            className={`absolute right-4 top-1/2 -translate-y-1/2 text-comic-black transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-2 border-4 border-comic-black rounded-lg overflow-hidden"
          style={{
            backgroundColor: "var(--comic-white)",
            boxShadow: "4px 4px 0 var(--comic-black)",
          }}
        >
          {projectTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => {
                  onChange(type.value);
                  setIsOpen(false);
                }}
                className="w-full p-3 font-comic text-lg text-left hover:bg-comic-yellow/20 transition-colors flex items-center gap-3"
              >
                <Icon className={`text-xl ${type.color}`} />
                <span className="text-comic-black">{type.value}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
