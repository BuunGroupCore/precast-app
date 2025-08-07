import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  effect?: string;
  dropdown?: {
    items: {
      label: string;
      href?: string;
      onClick?: () => void;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  };
}

export interface HeaderProps {
  logo?: string | ReactNode;
  logoSrc?: string;
  links?: NavItem[];
  onLogoClick?: () => void;
  currentPath?: string;
  rightContent?: ReactNode;
}

export function Header({
  logo = "PRECAST",
  logoSrc,
  links = [],
  onLogoClick,
  currentPath,
  rightContent,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div
            className="relative border-4 rounded-lg px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between bg-white"
            style={
              {
                borderColor: "var(--comic-black)",
                backgroundColor: "var(--comic-white)",
                boxShadow: "2px 2px 0 var(--comic-black), 4px 4px 0 rgba(0, 0, 0, 0.5)",
              } as React.CSSProperties
            }
          >
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={onLogoClick}>
              {logoSrc && (
                <img
                  src={logoSrc}
                  alt="Logo"
                  className="h-10 transition-transform"
                  style={{
                    filter: "hue-rotate(340deg) saturate(2) brightness(1.2)",
                  }}
                />
              )}
              {typeof logo === "string" ? (
                <span className="font-display text-2xl text-comic-red hidden sm:inline-block">
                  {logo}
                </span>
              ) : (
                logo
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2 sm:gap-4">
              {links.map((item) => {
                const isActive = currentPath === item.href;
                const Icon = item.icon;
                const hasDropdown = item.dropdown && item.dropdown.items.length > 0;

                return (
                  <div key={item.label} className="relative">
                    {hasDropdown ? (
                      <div
                        className="relative group cursor-pointer"
                        onMouseEnter={() => setOpenDropdown(item.label)}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        <div
                          className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg
                            font-comic font-bold text-sm uppercase
                            border-2 transition-all duration-200
                          `}
                          style={{
                            backgroundColor: isActive
                              ? item.color || "var(--comic-red)"
                              : "var(--comic-white)",
                            borderColor: "var(--comic-black)",
                            color: isActive ? "var(--comic-white)" : "var(--comic-black)",
                            boxShadow: isActive
                              ? "3px 3px 0 var(--comic-black)"
                              : "2px 2px 0 var(--comic-black)",
                          }}
                        >
                          {Icon && <Icon className="text-lg" />}
                          <span>{item.label}</span>
                          <FaChevronDown
                            className={`text-xs transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                          />
                        </div>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {openDropdown === item.label && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-full left-0 mt-1 min-w-48 z-50"
                              onMouseEnter={() => setOpenDropdown(item.label)}
                              onMouseLeave={() => setOpenDropdown(null)}
                            >
                              <div
                                className="border-4 rounded-lg p-2 space-y-1"
                                style={{
                                  backgroundColor: "var(--comic-white)",
                                  borderColor: "var(--comic-black)",
                                  boxShadow: "4px 4px 0 var(--comic-black)",
                                }}
                              >
                                {item.dropdown?.items.map((dropdownItem) => {
                                  const DropdownIcon = dropdownItem.icon;
                                  return (
                                    <a
                                      key={dropdownItem.label}
                                      href={dropdownItem.href}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        dropdownItem.onClick?.();
                                        setOpenDropdown(null);
                                      }}
                                      className="flex items-center gap-3 px-3 py-2 rounded-lg font-comic font-bold text-sm transition-all hover:bg-comic-yellow"
                                      style={{ color: "var(--comic-black)" }}
                                    >
                                      {DropdownIcon && <DropdownIcon className="text-lg" />}
                                      <span>{dropdownItem.label}</span>
                                    </a>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          item.onClick?.();
                        }}
                        className="relative group cursor-pointer"
                      >
                        <div
                          className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg
                            font-comic font-bold text-sm uppercase
                            border-2 transition-all duration-200
                          `}
                          style={{
                            backgroundColor: isActive
                              ? item.color || "var(--comic-red)"
                              : "var(--comic-white)",
                            borderColor: "var(--comic-black)",
                            color: isActive ? "var(--comic-white)" : "var(--comic-black)",
                            boxShadow: isActive
                              ? "3px 3px 0 var(--comic-black)"
                              : "2px 2px 0 var(--comic-black)",
                          }}
                        >
                          {Icon && <Icon className="text-lg" />}
                          <span>{item.label}</span>
                        </div>
                        {isActive && item.effect && (
                          <div
                            className="absolute -top-3 -right-3 action-text text-xl pointer-events-none"
                            style={{ color: item.color || "var(--comic-red)" }}
                          >
                            {item.effect}
                          </div>
                        )}
                      </a>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2">
              {rightContent && <div className="hidden sm:block">{rightContent}</div>}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border-2"
                style={{
                  backgroundColor: "var(--comic-yellow)",
                  borderColor: "var(--comic-black)",
                  boxShadow: "2px 2px 0 var(--comic-black)",
                }}
              >
                <div className="flex flex-col justify-center items-center w-6 h-6">
                  <span
                    className={`bg-black block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                      isMobileMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
                    }`}
                    style={{ backgroundColor: "var(--comic-black)" }}
                  />
                  <span
                    className={`bg-black block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                      isMobileMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                    style={{ backgroundColor: "var(--comic-black)" }}
                  />
                  <span
                    className={`bg-black block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
                    }`}
                    style={{ backgroundColor: "var(--comic-black)" }}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4"
                style={{
                  backgroundColor: "var(--comic-white)",
                  borderColor: "var(--comic-black)",
                  boxShadow: "4px 4px 0 var(--comic-black)",
                }}
              >
                <div
                  className="border-4 rounded-lg p-4 space-y-2"
                  style={{ borderColor: "var(--comic-black)" }}
                >
                  {links.map((item) => {
                    const isActive = currentPath === item.href;
                    const Icon = item.icon;
                    const hasDropdown = item.dropdown && item.dropdown.items.length > 0;

                    if (hasDropdown) {
                      return (
                        <div key={item.label} className="space-y-2">
                          {/* Dropdown Header */}
                          <div
                            className="flex items-center gap-3 p-3 rounded-lg font-comic font-bold text-sm uppercase border-2"
                            style={{
                              backgroundColor: "var(--comic-white)",
                              borderColor: "var(--comic-black)",
                              color: "var(--comic-black)",
                              boxShadow: "2px 2px 0 var(--comic-black)",
                            }}
                          >
                            {Icon && <Icon className="text-lg" />}
                            <span>{item.label}</span>
                          </div>

                          {/* Dropdown Items */}
                          <div className="ml-4 space-y-2">
                            {item.dropdown?.items.map((dropdownItem) => {
                              const DropdownIcon = dropdownItem.icon;
                              return (
                                <a
                                  key={dropdownItem.label}
                                  href={dropdownItem.href}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    dropdownItem.onClick?.();
                                    setIsMobileMenuOpen(false);
                                  }}
                                  className="flex items-center gap-3 p-2 rounded-lg font-comic font-bold text-sm uppercase border-2 transition-all"
                                  style={{
                                    backgroundColor: "var(--comic-white)",
                                    borderColor: "var(--comic-black)",
                                    color: "var(--comic-black)",
                                    boxShadow: "1px 1px 0 var(--comic-black)",
                                  }}
                                >
                                  {DropdownIcon && <DropdownIcon className="text-base" />}
                                  <span>{dropdownItem.label}</span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          item.onClick?.();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 p-3 rounded-lg font-comic font-bold text-sm uppercase border-2 transition-all"
                        style={{
                          backgroundColor: isActive
                            ? item.color || "var(--comic-red)"
                            : "var(--comic-white)",
                          borderColor: "var(--comic-black)",
                          color: isActive ? "var(--comic-white)" : "var(--comic-black)",
                          boxShadow: "2px 2px 0 var(--comic-black)",
                        }}
                      >
                        {Icon && <Icon className="text-lg" />}
                        <span>{item.label}</span>
                        {isActive && item.effect && (
                          <span
                            className="action-text text-sm ml-auto"
                            style={{ color: "var(--comic-yellow)" }}
                          >
                            {item.effect}
                          </span>
                        )}
                      </a>
                    );
                  })}
                  {rightContent && (
                    <div className="pt-2 border-t-2" style={{ borderColor: "var(--comic-black)" }}>
                      {rightContent}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </header>
  );
}
