import { ShoppingCart } from "lucide-react";

import { cva, type VariantProps } from "class-variance-authority";
import parse from "html-react-parser";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import Button from "~/components/core/ui/button";
import Currency from "~/components/core/ui/currency";
import useCart from "~/modules/cart/hooks/use-cart";
import type { DetailedProductFull, Variation } from "~/types";
import { cn } from "~/utils/styles";
import VariantSelector from "../../modules/products/core/variant-selector";

interface InfoProps extends VariantProps<typeof infoVariants> {
  data: DetailedProductFull;
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
      dark: "bg-purple-500 text-white",
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
  const cart = useCart();

  const onAddToCart = () => {
    cart.addCartItem({ product: props?.data, variant: variant!, quantity });
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
          <Currency value={props?.data?.price} />
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
          className={cn("flex items-center gap-x-2", btnStyles)}
          disabled={
            props?.data?.variants?.length > 0 ? variant === null : false
          }
        >
          Add To Cart <ShoppingCart size={20} />
        </Button>
      </div>

      <div className={cn("mt-10 gap-x-3", textStyles)}>
        <h3 className="text-lg font-bold">Description</h3>
        <div className={cn("", "")}>{parse(props?.data.description ?? "")}</div>
      </div>
    </div>
  );
};

export default Info;
