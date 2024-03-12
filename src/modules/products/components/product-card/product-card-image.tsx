import { cva, type VariantProps } from "class-variance-authority";
import { useContext, type ElementRef, type HTMLAttributes } from "react";
import { ContentSwitchWrapper } from "~/packages/ui/components/content-switch-wrapper";
import { cn } from "~/utils/styles";
import { ProductCardContext } from "./product-card-wrapper";

export const productCardImageVariants = cva("", {
  variants: {
    size: {
      default: "aspect-[1/1.6] h-auto w-auto",
      square: "relative aspect-square h-60 w-60 rounded-xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface TProductCardImage
  extends HTMLAttributes<ElementRef<"div">>,
    VariantProps<typeof productCardImageVariants> {
  primaryContentUrl: string;
  secondaryContentUrl?: string;
  children: React.ReactNode;
}

export const ProductCardImage = ({
  primaryContentUrl,
  secondaryContentUrl,
  className,
  children,
  ...props
}: TProductCardImage) => {
  const handleOnClick = useContext(ProductCardContext);

  return (
    <ContentSwitchWrapper
      primaryContentUrl={primaryContentUrl}
      secondaryContentUrl={secondaryContentUrl}
      variant={"image"}
      overlay={"default"}
      onClick={handleOnClick}
      className={cn(productCardImageVariants({ size: props.size }), className)}
      {...props}
    >
      {children}
    </ContentSwitchWrapper>
  );
};
