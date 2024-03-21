import type { Discount } from "@prisma/client";
import { Expand, ShoppingCart } from "lucide-react";

import { useRouter } from "next/navigation";
import { type MouseEventHandler } from "react";

import type { VariantProps } from "class-variance-authority";
import useCart from "~/modules/cart/hooks/use-cart";
import { getBestDiscount } from "~/modules/discounts/utils/get-best-discount";
import { ProductCardDescription } from "~/modules/products/components/product-card/product-card-description";
import {
  ProductCardImage,
  type productCardImageVariants,
} from "~/modules/products/components/product-card/product-card-image";
import { ProductCardQuickActions } from "~/modules/products/components/product-card/product-card-quick-actions";
import {
  ProductCardWrapper,
  type productCardVariants,
} from "~/modules/products/components/product-card/product-card-wrapper";
import usePreviewModal from "~/modules/products/hooks/use-preview-modal";
import type { DetailedProductFull } from "~/types";
import { cn } from "~/utils/styles";
import { Button } from "../../../../components/ui/button";
import { ProductCardPrice } from "./product-card-price";
import { ProductCardSaleBadge } from "./product-card-sale-badge";

interface ProductCard
  extends VariantProps<typeof productCardVariants>,
    VariantProps<typeof productCardImageVariants> {
  data: DetailedProductFull;
  discounts: Discount[];
  className?: string;
}

const ProductCard: React.FC<ProductCard> = ({
  data,
  className,
  discounts,
  variant,
  size,
}) => {
  const previewModal = usePreviewModal();
  const cart = useCart();
  const router = useRouter();

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    previewModal.onOpen(data);
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    cart.addCartItem({
      product: data,
      quantity: 1,
      variant: null,
    });

    cart.setIsShoppingBagOpen(true);
  };

  const goToProduct = () => router.push(`/product/${data?.id}`);

  const quickActions = {
    preview: {
      icon: <Expand size={20} className="text-gray-600" />,
      onClick: onPreview,
      renderIf: true,
    },
    addToCart: {
      icon: <ShoppingCart size={20} className="text-gray-600" />,
      onClick: onAddToCart,
      renderIf: data.variants?.length === 0,
    },
  };

  const bestDiscount =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    discounts?.length > 0 ? getBestDiscount(data.price, discounts) : null;

  const primaryContentUrl =
    data?.featuredImage ?? data?.images?.[0]?.url ?? "/placeholder-image.webp";
  const secondaryContentUrl =
    data.images?.[1]?.url ?? data.images?.[0]?.url ?? "/placeholder-image.webp";

  return (
    <ProductCardWrapper
      variant={variant}
      className={cn(className)}
      handleOnClick={goToProduct}
    >
      <ProductCardImage
        size={size}
        primaryContentUrl={primaryContentUrl}
        secondaryContentUrl={secondaryContentUrl}
      >
        <ProductCardSaleBadge
          hasDiscount={data?.discounts?.length > 0 || discounts?.length > 0}
          className="bg-purple-500"
        />

        {/* Quick Actions */}
        <ProductCardQuickActions
          actions={[quickActions.preview, quickActions.addToCart]}
        />
      </ProductCardImage>
      <ProductCardDescription
        name={data.name}
        subheader={data?.category?.name ?? ""}
        className={cn(
          variant === "default" && "h-fit items-start justify-start text-left"
        )}
      >
        <ProductCardPrice
          price={data.price}
          discountedPrice={bestDiscount?.price}
        />
      </ProductCardDescription>

      {variant !== "marquee" && (
        <>
          {data?.variants?.length > 0 ? (
            <Button
              className="w-full bg-purple-700 hover:bg-purple-500"
              onClick={goToProduct}
            >
              View Product
            </Button>
          ) : (
            <Button
              className="w-full bg-purple-700 hover:bg-purple-500"
              onClick={onAddToCart}
            >
              Add to Cart
            </Button>
          )}
        </>
      )}
    </ProductCardWrapper>
  );
};

export default ProductCard;
