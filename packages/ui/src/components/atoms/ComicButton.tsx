import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const comicButtonVariants = cva(
  "font-comic uppercase transition-all duration-200 active:translate-y-0",
  {
    variants: {
      variant: {
        action:
          "bg-action-pow text-white border-4 border-comic-black shadow-comic hover:shadow-comic-lg hover:-translate-y-1",
        speech:
          "bg-white text-comic-black border-3 border-comic-black shadow-speech hover:shadow-comic hover:-translate-y-0.5",
        hero: "bg-comic-blue text-white border-4 border-comic-black shadow-comic-lg hover:bg-comic-red hover:-translate-y-1",
        villain:
          "bg-comic-black text-comic-yellow border-4 border-comic-yellow shadow-comic-lg hover:bg-action-boom hover:-translate-y-1",
      },
      size: {
        sm: "px-4 py-2 text-lg",
        md: "px-6 py-3 text-xl",
        lg: "px-8 py-4 text-2xl",
        xl: "px-10 py-5 text-3xl",
      },
    },
    defaultVariants: {
      variant: "action",
      size: "md",
    },
  },
);

export interface ComicButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof comicButtonVariants> {}

export const ComicButton = forwardRef<HTMLButtonElement, ComicButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        className={clsx(comicButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);

ComicButton.displayName = "ComicButton";
