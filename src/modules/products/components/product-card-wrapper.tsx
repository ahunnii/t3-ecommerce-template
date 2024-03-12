import { VariantProps, cva } from "class-variance-authority";
import { Expand, ShoppingCart } from "lucide-react";

import { useRouter } from "next/navigation";
import {
  ElementRef,
  HTMLAttributes,
  useEffect,
  useState,
  type MouseEventHandler,
} from "react";

import useCart from "~/modules/cart/hooks/use-cart";
import { ProductCardDescription } from "~/modules/products/components/product-card-description";
import { ProductCardImage } from "~/modules/products/components/product-card-image";
import { ProductCardQuickActions } from "~/modules/products/components/product-card-quick-actions";
import usePreviewModal from "~/modules/products/hooks/use-preview-modal";

import type { DetailedProductFull } from "~/types";
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
