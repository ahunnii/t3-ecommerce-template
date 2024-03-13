import { forwardRef, type ElementRef, type HTMLAttributes } from "react";
import { cn } from "~/utils/styles";

export const PageHeader = forwardRef<
  ElementRef<"h1">,
  HTMLAttributes<ElementRef<"h1">>
>(({ className, children, ...props }, ref) => {
  return (
    <h1
      className={cn(
        "mb-6 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </h1>
  );
});

PageHeader.displayName = "PageHeader";
