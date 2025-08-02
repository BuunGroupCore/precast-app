import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { motion } from "framer-motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-500 text-white shadow-cartoon hover:shadow-cartoon-hover hover:bg-primary-600 hover:-translate-y-0.5",
        secondary:
          "bg-secondary-500 text-white shadow-cartoon hover:shadow-cartoon-hover hover:bg-secondary-600 hover:-translate-y-0.5",
        accent:
          "bg-accent-500 text-white shadow-cartoon hover:shadow-cartoon-hover hover:bg-accent-600 hover:-translate-y-0.5",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
        outline:
          "border-2 border-primary-500 text-primary-600 hover:bg-primary-50",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
      },
      animated: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      animated: true,
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animated, children, ...props }, ref) => {
    const Component = animated ? motion.button : "button";

    return (
      <Component
        className={clsx(buttonVariants({ variant, size, animated, className }))}
        ref={ref}
        whileHover={animated ? { scale: 1.02 } : undefined}
        whileTap={animated ? { scale: 0.98 } : undefined}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Button.displayName = "Button";
