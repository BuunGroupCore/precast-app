import { createElement, ElementType, ComponentType } from "react";
import { IconType } from "react-icons";

interface BuilderIconProps {
  icon:
    | IconType
    | ComponentType<Record<string, unknown>>
    | ElementType<Record<string, unknown>>
    | string;
  className?: string;
  size?: number | string;
  forceWhite?: boolean;
}

/**
 * Monochrome icon wrapper for builder components
 * Ensures all icons are displayed without color for consistency
 */
export function BuilderIcon({
  icon: Icon,
  className = "",
  size = 20,
  forceWhite = false,
}: BuilderIconProps) {
  // For Epic Stack (blue background), force white icons
  const isWhiteText = className.includes("text-white");

  // Handle string icons (HTML elements) by returning null or a placeholder
  if (typeof Icon === "string") {
    return (
      <div
        className={`inline-flex items-center justify-center ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: "currentColor",
          opacity: 0.7,
        }}
      />
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        filter:
          forceWhite || isWhiteText ? "brightness(0) invert(1)" : "grayscale(100%) contrast(100%)",
        opacity: forceWhite || isWhiteText ? 1 : 0.9,
      }}
    >
      {createElement(
        Icon as ComponentType<{ size?: number | string; style?: React.CSSProperties }>,
        {
          size,
          style: {
            color: "currentColor",
            fill: "currentColor",
          },
        }
      )}
    </div>
  );
}

/**
 * Wrapper for image icons to apply monochrome filter
 */
export function BuilderImageIcon({
  src,
  alt,
  className = "",
  size = 20,
}: {
  src: string;
  alt: string;
  className?: string;
  size?: number;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${className}`}
      style={{
        width: size,
        height: size,
        filter: "grayscale(100%) brightness(0) invert(0.3)",
        opacity: 0.8,
      }}
    />
  );
}

/**
 * SVG icon wrapper for custom SVG components
 */
export function BuilderSvgIcon({
  children,
  className = "",
  size = 20,
}: {
  children: React.ReactNode;
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${className}`}
      style={{
        color: "currentColor",
      }}
    >
      {children}
    </svg>
  );
}
