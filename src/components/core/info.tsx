"use client";

import { ShoppingCart } from "lucide-react";

import { useState } from "react";
import Button from "~/components/core/ui/button";
import Currency from "~/components/core/ui/currency";
import useCart from "~/hooks/core/use-cart";
import type { Product, Variation } from "~/types";
import VariantSelector from "./product/variant-selector";

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const [variant, setVariant] = useState<Variation | null>(null);

  const [quantity, setQuantity] = useState<number>(0);
  const cart = useCart();

  const onAddToCart = () => {
    cart.addCartItem({ product: data, variant: variant!, quantity });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl text-gray-900">
          <Currency value={data?.price} />
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <VariantSelector
          attributes={data?.category?.attributes}
          variants={data?.variants}
          variant={variant}
          setVariant={setVariant}
          setQuantity={setQuantity}
        />
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button
          onClick={onAddToCart}
          className="flex items-center gap-x-2"
          disabled={data?.variants?.length > 0 ? variant === null : false}
        >
          Add To Cart
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Info;
