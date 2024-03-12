import { forwardRef, type ElementRef, type HTMLAttributes } from "react";

import { cn } from "~/utils/styles";

type TProductCardSaleBadge = {
  hasDiscount: boolean;
} & HTMLAttributes<ElementRef<"span">>;

export const ProductCardSaleBadge = forwardRef<
  ElementRef<"span">,
  TProductCardSaleBadge
>(({ hasDiscount, className, ...props }, ref) => {
  if (!hasDiscount) return null;
  return (
    <span
      className={cn(
        "absolute right-3 top-3 z-50 rounded-md border border-white bg-red-500 px-2 py-1 text-xs font-semibold text-white shadow",
        className
      )}
      ref={ref}
      {...props}
    >
      SALE
    </span>
  );
});

ProductCardSaleBadge.displayName = "ProductCardSaleBadge";
