import { ShoppingCart } from "lucide-react";
import { forwardRef, type ElementRef, type HTMLAttributes } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/utils/styles";

type Props = {
  isDisabled: boolean;
} & HTMLAttributes<ElementRef<"button">>;

export const ProductAddToCartButton = forwardRef<ElementRef<"button">, Props>(
  ({ isDisabled, className, ...props }, ref) => {
    return (
      <Button
        onClick={props.onClick}
        size={"lg"}
        className={cn(
          "flex w-full items-center justify-center gap-x-2 rounded-full text-center text-base",
          className
        )}
        disabled={isDisabled}
        ref={ref}
      >
        Add To Cart <ShoppingCart size={20} />
      </Button>
    );
  }
);

ProductAddToCartButton.displayName = "ProductAddToCartButton";
