import {
  forwardRef,
  useContext,
  type ElementRef,
  type HTMLAttributes,
} from "react";

import { cn } from "~/utils/styles";
import { ProductCardContext } from "./product-card-wrapper";

type TProductCardDescription = {
  name: string;
  subheader?: string;
} & HTMLAttributes<ElementRef<"div">>;

export const ProductCardDescription = forwardRef<
  ElementRef<"div">,
  TProductCardDescription
>(({ name, subheader, className, children, ...props }, ref) => {
  const handleOnClick = useContext(ProductCardContext);
  return (
    <div
      className={cn(
        "flex h-full w-60 flex-col items-center justify-center text-center",
        className
      )}
      onClick={handleOnClick}
      ref={ref}
      {...props}
    >
      <p className="text-lg font-semibold text-white">{name}</p>
      <p className="text-sm text-gray-500">{subheader}</p>

      {children}
    </div>
  );
});

ProductCardDescription.displayName = "ProductCardDescription";
