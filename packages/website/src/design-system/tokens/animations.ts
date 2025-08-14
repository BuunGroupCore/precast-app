/**
 * Design system animation tokens.
 * Consistent timing and easing for smooth, comic book-inspired animations.
 */

export const animations = {
  // Timing functions
  timing: {
    instant: "0ms",
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
  },

  // Easing functions
  easing: {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    // Comic book style easing
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    snap: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    whoosh: "cubic-bezier(0.19, 1, 0.22, 1)",
    pow: "cubic-bezier(0.77, 0, 0.175, 1)",
  },

  // Keyframe animations
  keyframes: {
    fadeIn: {
      from: { opacity: "0" },
      to: { opacity: "1" },
    },
    fadeOut: {
      from: { opacity: "1" },
      to: { opacity: "0" },
    },
    slideInUp: {
      from: { transform: "translateY(100%)", opacity: "0" },
      to: { transform: "translateY(0)", opacity: "1" },
    },
    slideInDown: {
      from: { transform: "translateY(-100%)", opacity: "0" },
      to: { transform: "translateY(0)", opacity: "1" },
    },
    slideInLeft: {
      from: { transform: "translateX(-100%)", opacity: "0" },
      to: { transform: "translateX(0)", opacity: "1" },
    },
    slideInRight: {
      from: { transform: "translateX(100%)", opacity: "0" },
      to: { transform: "translateX(0)", opacity: "1" },
    },
    scaleIn: {
      from: { transform: "scale(0.8)", opacity: "0" },
      to: { transform: "scale(1)", opacity: "1" },
    },
    scaleOut: {
      from: { transform: "scale(1)", opacity: "1" },
      to: { transform: "scale(0.8)", opacity: "0" },
    },
    bounce: {
      "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
      "40%": { transform: "translateY(-6px)" },
      "60%": { transform: "translateY(-3px)" },
    },
    pulse: {
      "0%, 100%": { opacity: "1" },
      "50%": { opacity: "0.5" },
    },
    shake: {
      "0%, 100%": { transform: "translateX(0)" },
      "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
      "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
    },
    spin: {
      from: { transform: "rotate(0deg)" },
      to: { transform: "rotate(360deg)" },
    },
    // Comic book specific animations
    pow: {
      "0%": { transform: "scale(1) rotate(0deg)" },
      "25%": { transform: "scale(1.1) rotate(-2deg)" },
      "50%": { transform: "scale(1.2) rotate(2deg)" },
      "75%": { transform: "scale(1.1) rotate(-1deg)" },
      "100%": { transform: "scale(1) rotate(0deg)" },
    },
    zap: {
      "0%, 100%": { transform: "translateX(0)" },
      "20%": { transform: "translateX(-2px) translateY(-1px)" },
      "40%": { transform: "translateX(2px) translateY(1px)" },
      "60%": { transform: "translateX(-1px) translateY(-2px)" },
      "80%": { transform: "translateX(1px) translateY(2px)" },
    },
    boom: {
      "0%": { transform: "scale(1)" },
      "30%": { transform: "scale(1.25)" },
      "60%": { transform: "scale(0.9)" },
      "100%": { transform: "scale(1)" },
    },
  },

  // Transition presets
  transitions: {
    all: "all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    colors:
      "color 150ms ease-in-out, background-color 150ms ease-in-out, border-color 150ms ease-in-out",
    transform: "transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    opacity: "opacity 150ms ease-in-out",
    shadow: "box-shadow 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    // Comic specific transitions
    comic: "all 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    comicHover: "transform 150ms cubic-bezier(0.68, -0.55, 0.265, 1.55), box-shadow 150ms ease-out",
  },
} as const;

export type AnimationTokens = typeof animations;
export type TimingTokens = keyof AnimationTokens["timing"];
export type EasingTokens = keyof AnimationTokens["easing"];
export type KeyframeTokens = keyof AnimationTokens["keyframes"];
export type TransitionTokens = keyof AnimationTokens["transitions"];
