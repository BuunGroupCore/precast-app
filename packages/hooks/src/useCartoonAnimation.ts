import { useAnimation, AnimationControls } from "framer-motion";
import { useEffect, useRef } from "react";

export type AnimationType = "bounce" | "wiggle" | "float" | "wave" | "blob";

export function useCartoonAnimation(type: AnimationType): AnimationControls {
  const controls = useAnimation();
  const isAnimating = useRef(false);

  useEffect(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const animations = {
      bounce: async () => {
        await controls.start({
          y: [0, -20, 0],
          transition: { duration: 0.5, repeat: Infinity, repeatDelay: 1.5 },
        });
      },
      wiggle: async () => {
        await controls.start({
          rotate: [-3, 3, -3],
          transition: { duration: 0.2, repeat: Infinity, repeatDelay: 0.8 },
        });
      },
      float: async () => {
        await controls.start({
          y: [0, -10, 0],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        });
      },
      wave: async () => {
        await controls.start({
          rotate: [0, 14, -8, 14, -4, 10, 0],
          transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
        });
      },
      blob: async () => {
        await controls.start({
          scale: [1, 1.1, 0.9, 1],
          x: [0, 30, -20, 0],
          y: [0, -50, 20, 0],
          transition: { duration: 7, repeat: Infinity },
        });
      },
    };

    animations[type]();

    return () => {
      isAnimating.current = false;
      controls.stop();
    };
  }, [type, controls]);

  return controls;
}
