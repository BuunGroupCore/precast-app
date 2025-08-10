import React from "react";
import { FaNpm, FaYarn, FaChevronDown } from "react-icons/fa";
import { SiBun, SiPnpm } from "react-icons/si";

interface PackageManagerSelectorProps {
  packageManager: string;
  setPackageManager: (pm: string) => void;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
}

const packageManagers = [
  { id: "npx", icon: FaNpm, name: "npx", color: "bg-red-600" },
  { id: "npm", icon: FaNpm, name: "npm", color: "bg-red-600" },
  { id: "yarn", icon: FaYarn, name: "yarn", color: "bg-blue-600" },
  { id: "pnpm", icon: SiPnpm, name: "pnpm", color: "bg-yellow-600" },
  { id: "bun", icon: SiBun, name: "bun", color: "bg-pink-600" },
];

export const PackageManagerSelector: React.FC<PackageManagerSelectorProps> = ({
  packageManager,
  setPackageManager,
  showDropdown,
  setShowDropdown,
}) => {
  const currentPm = packageManagers.find((pm) => pm.id === packageManager) || packageManagers[0];

  return (
    <>
      {/* Mobile Dropdown */}
      <div className="sm:hidden relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`w-full px-4 py-2 ${currentPm.color} text-white font-comic text-sm flex items-center justify-between border-b-2 border-comic-black`}
        >
          <div className="flex items-center gap-2">
            <currentPm.icon className="text-lg" />
            <span>{currentPm.name}</span>
          </div>
          <FaChevronDown
            className={`text-sm transition-transform ${showDropdown ? "rotate-180" : ""}`}
          />
        </button>
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 bg-comic-black border-2 border-t-0 border-comic-black z-10 shadow-lg">
            {packageManagers.map((pm) => (
              <button
                key={pm.id}
                onClick={() => {
                  setPackageManager(pm.id);
                  setShowDropdown(false);
                }}
                className={`w-full px-4 py-2 font-comic text-sm flex items-center gap-2 text-comic-white hover:bg-comic-gray/40 transition-colors ${
                  packageManager === pm.id ? "bg-comic-gray/50" : ""
                }`}
              >
                <pm.icon className="text-lg" />
                <span>{pm.name}</span>
                {packageManager === pm.id && <span className="ml-auto text-comic-yellow">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Tabs */}
      <div className="hidden sm:flex bg-gradient-to-r from-comic-darkGray to-comic-black border-b-2 border-comic-black">
        {packageManagers.map((pm, index) => (
          <button
            key={pm.id}
            onClick={() => setPackageManager(pm.id)}
            className={`flex-1 px-3 py-2 font-comic text-xs transition-all relative ${
              index < 4 ? "border-r-2 border-comic-black" : ""
            } ${
              packageManager === pm.id
                ? `${pm.color} text-white font-bold shadow-inner`
                : "bg-comic-darkGray/70 text-comic-white/70 hover:text-comic-white hover:bg-comic-darkGray"
            }`}
          >
            {packageManager === pm.id && (
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-comic-yellow"></div>
            )}
            <pm.icon className="inline mr-1" />
            {pm.name}
          </button>
        ))}
      </div>
    </>
  );
};
