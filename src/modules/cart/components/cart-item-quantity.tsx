import { useEffect, useRef, useState, type FC } from "react";
import { Button } from "~/components/ui/button";

import { Input } from "~/components/ui/input";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const [quantity, setQuantity] = useState<number>(cartItem.quantity);

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => prev - 1);
  };

  useEffect(() => {
    if (
      Number(quantity) >
      (cartItem.variant
        ? cartItem.variant?.quantity - 1
        : cartItem.product?.quantity - 1)
    ) {
      onQuantityMax();
    }

    onQuantityChange(Number(quantity));

    if (Number(quantity) === 0) onQuantityEmpty();
  }, [quantity, cartItem]);

  if (!cartItem) return null;
  return (
    <div className="relative w-36 rounded-md border border-slate-100 ">
      <div className=" absolute inset-y-0 left-0 z-30 flex items-center">
        <Button
          variant={"ghost"}
          type="button"
          onClick={decrementQuantity}
          disabled={quantity === 0}
        >
          -
        </Button>
      </div>
      <Input
        ref={inputRef}
        type="text"
        min={0}
        value={quantity}
        max={
          cartItem.variant
            ? cartItem.variant?.quantity
            : cartItem.product?.quantity
        }
        defaultValue={cartItem.quantity}
        onChange={(e) => {
          setQuantity(Number(e.target.value));
        }}
        inputMode="numeric"
        className="z-10 block  rounded-md px-12 py-1.5  text-center     text-gray-900 sm:text-sm sm:leading-6"
      />

      <div className=" absolute inset-y-0 right-0 z-30 flex items-center">
        <Button
          variant={"ghost"}
          type="button"
          className="disabled:text-slate-300"
          onClick={incrementQuantity}
          disabled={
            quantity ===
            (cartItem.variant
              ? cartItem.variant?.quantity
              : cartItem.product?.quantity)
          }
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default CartItemQuantity;
