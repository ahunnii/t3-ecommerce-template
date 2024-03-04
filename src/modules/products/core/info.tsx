import { ShoppingCart, Tag } from "lucide-react";

import { Discount } from "@prisma/client";
import { cva, type VariantProps } from "class-variance-authority";
import parse from "html-react-parser";
import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import Button from "~/components/core/ui/button";
import Currency from "~/components/core/ui/currency";
import useCart from "~/modules/cart/hooks/use-cart";
import { getBestDiscount } from "~/modules/discounts/utils/get-best-discount";
import type { DetailedProductFull, Variation } from "~/types";
import { cn } from "~/utils/styles";
import VariantSelector from "./variant-selector";

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

const Info: React.FC<InfoProps> = (props) => {
  const [variant, setVariant] = useState<Variation | null>(null);

  const [quantity, setQuantity] = useState<number>(0);

  const discount = useMemo(() => {
    return props.discounts?.length > 0
      ? getBestDiscount(variant?.price ?? props?.data?.price, props.discounts)
      : null;
  }, [props.discounts, props?.data?.price, variant?.price]);

  const cart = useCart();

  const getPriceRange = useMemo(() => {
    if (props?.data?.variants?.length === 0) {
      return { min: props?.data?.price, max: null };
    }

    const prices = props?.data?.variants?.map((variant) => variant.price);

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return { min, max };
  }, [props?.data?.variants, props?.data?.price]);

  const onAddToCart = () => {
    cart.addCartItem({
      product: props?.data,
      variant: variant!,
      quantity,
      discountBundle: discount,
    });
  };

  const textStyles = infoVariants({ variant: props?.variant ?? "default" });
  const btnStyles = infoVariants({ button: props?.button ?? "default" });

  // console.log({ product: data, variant: variant!, quantity });

  return (
    <div>
      <h1 className={cn("text-3xl font-bold", textStyles)}>
        {props?.data.name}
      </h1>
      <div className="mt-3 flex items-end justify-between">
        <p className={cn("text-2xl ", textStyles)}>
          <div className="flex gap-2">
            {discount && (
              <div className="flex items-center">
                <Currency
                  value={discount.price}
                  className="font-extrabold text-slate-800"
                />
                <span>{getPriceRange.max && !variant && "+"}</span>
              </div>
            )}

            <div className="flex">
              <Currency
                value={variant ? variant.price : props?.data?.price}
                className={cn(
                  discount && "font-medium text-muted-foreground line-through"
                )}
              />

              <span
                className={cn(
                  discount && "font-medium text-muted-foreground line-through"
                )}
              >
                {getPriceRange.max && !variant && "+"}
              </span>
            </div>
          </div>

          {discount && (
            <p className="flex items-center gap-2 py-2 text-sm">
              <Tag size={16} /> Discount: {discount?.discount?.description}
            </p>
          )}
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <VariantSelector
          product={props?.data}
          variant={variant}
          setVariant={setVariant}
          setQuantity={setQuantity}
          labels={props?.variant ?? "default"}
        />
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button
          onClick={onAddToCart}
          className={cn(
            "flex w-full items-center justify-center gap-x-2 text-center",
            btnStyles
          )}
          disabled={
            props?.data?.variants?.length > 0 ? variant === null : false
          }
        >
          Add To Cart <ShoppingCart size={20} />
        </Button>
      </div>

      <div className={cn("mt-10 gap-x-3 space-y-4", textStyles)}>
        <div>
          <h3 className="text-lg font-bold">Description</h3>

          {props?.data?.description === "" ||
          props?.data.description === null ||
          props?.data?.description?.length === 0 ? (
            <div className={cn("", "")}>
              <p>No description provided.</p>
            </div>
          ) : (
            <div className={cn("", "")}>{parse(props?.data.description)}</div>
          )}
        </div>
        {props?.data?.materials?.length > 0 && (
          <div>
            <h3 className="text-lg font-bold">Materials</h3>
            <div className={cn("", "")}>
              {props?.data?.materials?.map((material, idx) => {
                return (
                  <>
                    <span key={idx} className="text-black">
                      {material.name}
                    </span>
                  </>
                );
              })}
            </div>
          </div>
        )}
        {props?.data?.tags?.length > 0 && (
          <div>
            <h3 className="text-lg font-bold">Tags</h3>
            <div className={cn("", "")}>
              {props?.data?.tags?.map((tag) => tag.name).join(", ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Info;
