import { type VariantProps, cva } from "class-variance-authority";

import {
  type ElementRef,
  type HTMLAttributes,
  useEffect,
  useState,
} from "react";

import { cn } from "~/utils/styles";

import { createContext } from "react";

type ProductContextType = () => void;
export const ProductCardContext = createContext<ProductContextType>(
  () => void 0
);

export const productCardVariants = cva(
  "group cursor-pointer space-y-4 rounded-xl border border-white/50 bg-black p-3",
  {
    variants: {
      variant: {
        default:
          "group cursor-pointer space-y-4 rounded-xl  border border-white/50 bg-black p-3",
        marquee: "flex h-60 items-center mx-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ProductCard
  extends HTMLAttributes<ElementRef<"div">>,
    VariantProps<typeof productCardVariants> {
  handleOnClick: () => void;
  className?: string;
  imgClassName?: string;
}

export const ProductCardWrapper: React.FC<ProductCard> = ({
  handleOnClick,
  className,
  children,
  ...props
}) => {
  const [productCard, setProductCard] = useState<ProductContextType>(
    () => void 0
  );

  useEffect(() => {
    if (handleOnClick) setProductCard(() => handleOnClick);
  }, [handleOnClick]);
  return (
    <ProductCardContext.Provider value={productCard}>
      <div
        className={cn(
          productCardVariants({ variant: props.variant }),
          className,
          "group"
        )}
        {...props}
      >
        {children}
      </div>
    </ProductCardContext.Provider>
  );
};
