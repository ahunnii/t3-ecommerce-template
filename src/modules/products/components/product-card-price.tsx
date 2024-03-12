import { forwardRef, type ElementRef, type HTMLAttributes } from "react";
import Currency from "~/components/core/ui/currency";
import { cn } from "~/utils/styles";

type TProductCardPrice = {
  price: number;
  discountedPrice?: number;
} & HTMLAttributes<ElementRef<"div">>;

export const ProductCardPrice = forwardRef<
  ElementRef<"div">,
  TProductCardPrice
>(({ price, discountedPrice, className, ...props }, ref) => {
  return (
    <div className={cn("flex gap-2", className)} ref={ref} {...props}>
      <div className="flex gap-2">
        {discountedPrice && (
          <Currency
            value={discountedPrice}
            className="mt-2  font-extrabold text-white"
          />
        )}

        <Currency
          value={price}
          className={cn(
            "mt-2  font-extrabold text-white",
            discountedPrice && "font-medium text-muted-foreground line-through"
          )}
        />
      </div>
    </div>
  );
});

ProductCardPrice.displayName = "ProductCardPrice";
