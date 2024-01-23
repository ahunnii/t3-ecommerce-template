import type { FC } from "react";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { CartItem } from "~/types";

type TCartItemQuantityProps = {
  cartItem: CartItem;
  onQuantityEmpty: () => void;
  onQuantityMax: () => void;
  onQuantityChange: (value: number) => void;
};

//Handles the quantity logic of each cart item
const CartItemQuantity: FC<TCartItemQuantityProps> = ({
  cartItem,
  onQuantityEmpty,
  onQuantityMax,
  onQuantityChange,
}) => {
  if (!cartItem) return null;
  return (
    <div className="flex space-y-2 max-sm:items-center max-sm:gap-2 md:flex-col">
      <Label>Quantity</Label>{" "}
      <Input
        type="number"
        min={0}
        max={
          cartItem.variant
            ? cartItem.variant?.quantity
            : cartItem.product?.quantity
        }
        defaultValue={cartItem.quantity}
        onChange={(e) => {
          if (
            Number(e.target.value) >
            (cartItem.variant
              ? cartItem.variant?.quantity - 1
              : cartItem.product?.quantity - 1)
          ) {
            onQuantityMax();
          }

          onQuantityChange(Number(e.target.value));

          if (Number(e.target.value) === 0) onQuantityEmpty();
        }}
      />
    </div>
  );
};

export default CartItemQuantity;
