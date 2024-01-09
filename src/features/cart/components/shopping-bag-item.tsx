import Image from "next/image";

import Currency from "~/components/core/ui/currency";

import type { CartItem } from "~/types";

import { cn } from "~/utils/styles";

type TShoppingBagItemProps = {
  cartItem: CartItem;
};
const ShoppingBagItem = ({ cartItem }: TShoppingBagItemProps) => {
  return (
    <div className="grid w-full  grid-cols-12 items-start gap-x-8 gap-y-8 border-b border-gray-200 py-2">
      <div className="col-span-3">
        <div className="relative aspect-square w-20">
          <Image
            src={cartItem.product?.images[0]?.url ?? ""}
            layout="fill"
            objectFit="cover"
            alt="product"
          />
        </div>
      </div>
      <div className="col-span-5 ">
        {/* Common cart item data */}
        <h1 className="text-base font-bold text-gray-900">
          {cartItem.product.name} ({cartItem.quantity})
        </h1>
        {/* Handle potential variant data */}
        <div className="mt-1 flex w-full text-xs">
          {cartItem.variant?.values.split(", ").map((item, idx) => (
            <p
              className={cn(
                "  border-gray-200  text-gray-500",
                idx > 0 ? "ml-2 border-l pl-2" : ""
              )}
              key={idx}
            >
              {item}
            </p>
          ))}
        </div>
        {/* Price of the item */}
        <div className="mt-3 flex items-end justify-between">
          <Currency value={cartItem.product?.price} />
        </div>
      </div>
    </div>
  );
};

export default ShoppingBagItem;
