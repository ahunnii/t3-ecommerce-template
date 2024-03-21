import type { Discount } from "@prisma/client";
import { cva, type VariantProps } from "class-variance-authority";

import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";

import { Separator } from "~/components/ui/separator";
import useCart from "~/modules/cart/hooks/use-cart";
import { getBestDiscount } from "~/modules/discounts/utils/get-best-discount";
import type { DetailedProductFull } from "~/modules/products/types";
import { cn } from "~/utils/styles";
import VariantSelector from "../../core/variant-selector";
import type { ProductVariant } from "../../types";
import { ProductAddToCartButton } from "./product-add-to-cart-button";
import { ProductDiscountLabel } from "./product-discount-label";
import { ProductMaterialsSection } from "./product-materials.section";
import { ProductPrice } from "./product-price";
import { ProductTagsSection } from "./product-tags.section";

interface InfoProps extends VariantProps<typeof infoVariants> {
  data: DetailedProductFull;
  discounts: Discount[];
  descriptionStyle?: string;
}

const infoVariants = cva("", {
  variants: {
    variant: {
      default: "text-gray-900",
      dark: "text-white",
    },
    button: {
      default: "",
      dark: "bg-black text-white",
    },
  },
  defaultVariants: {
    variant: "default",
    button: "default",
  },
});

const ProductPageInfo: React.FC<InfoProps> = (props) => {
  const [variant, setVariant] = useState<ProductVariant | null>(null);

  const [quantity, setQuantity] = useState<number>(0);

  const discount = useMemo(() => {
    return props.discounts?.length > 0
      ? getBestDiscount(variant?.price ?? props?.data?.price, props.discounts)
      : null;
  }, [props.discounts, props?.data?.price, variant?.price]);

  const cart = useCart();

  const onAddToCart = () => {
    cart.addCartItem({
      product: props?.data,
      variant: variant!,
      quantity,
      discountBundle: discount,
    });
  };

  const textStyles = infoVariants({ variant: props?.variant ?? "default" });

  return (
    <div>
      <h1 className={cn("text-3xl font-bold", textStyles)}>
        {props?.data.name}
      </h1>
      <div className="mt-3 flex items-end justify-between">
        <div className={cn("text-2xl ", textStyles)}>
          <ProductPrice
            selectedVariant={variant}
            variants={props?.data?.variants}
            price={props?.data?.price}
            discountPrice={discount?.price}
          />

          <ProductDiscountLabel
            discountDescription={discount?.discount?.description}
          />
        </div>
      </div>
      <Separator className="my-4 bg-zinc-900/20" />
      <div className="flex flex-col gap-y-6">
        <VariantSelector
          product={props?.data}
          variant={variant}
          setVariant={setVariant}
          setQuantity={setQuantity}
          labels={props?.variant ?? "default"}
        />
      </div>
      <ProductAddToCartButton
        onClick={onAddToCart}
        className="mt-10"
        isDisabled={
          props?.data?.variants?.length > 0 ? variant === null : false
        }
      />

      <div className={cn("mt-10 gap-x-3 space-y-4", textStyles)}>
        <LazyProductDescription description={props?.data?.description} />
        <ProductMaterialsSection materials={props?.data?.materials} />
        <ProductTagsSection tags={props?.data?.tags} />
      </div>
    </div>
  );
};

const LazyProductDescription = dynamic(() =>
  import("./product-description.section").then(
    (mod) => mod.ProductDescriptionSection
  )
);

export default ProductPageInfo;
