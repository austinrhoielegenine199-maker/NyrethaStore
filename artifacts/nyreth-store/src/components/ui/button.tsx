import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm font-display text-xs uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 mc-button shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-2 border-primary-foreground/20 hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground border-2 border-destructive-foreground/20 hover:bg-destructive/90",
        outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary/10",
        secondary: "bg-secondary text-secondary-foreground border-2 border-white/10 hover:bg-secondary/80",
        ghost: "shadow-none border-2 border-transparent hover:bg-secondary hover:text-secondary-foreground hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.5)]",
        link: "shadow-none text-primary underline-offset-4 hover:underline",
        accent: "bg-accent text-accent-foreground border-2 border-white/20 hover:bg-accent/90 shadow-[4px_4px_0_0_rgba(0,0,0,0.8)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-[10px]",
        lg: "h-12 px-8 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
