import { useEffect, useRef, useState } from "react";

interface IntersectionState {
  isIntersecting: boolean;
  hasIntersected: boolean;
}

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation(
  options: UseScrollAnimationOptions = {},
): [React.RefObject<HTMLElement>, IntersectionState] {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;

  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<IntersectionState>({
    isIntersecting: false,
    hasIntersected: false,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;

        setState((prev) => ({
          isIntersecting,
          hasIntersected: prev.hasIntersected || isIntersecting,
        }));

        if (triggerOnce && isIntersecting) {
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, state];
}
