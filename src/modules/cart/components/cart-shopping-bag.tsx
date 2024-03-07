import Currency from "~/components/core/ui/currency";

import { Button } from "~/components/ui/button";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Separator } from "~/components/ui/separator";
import useCart from "~/modules/cart/hooks/use-cart";

import Link from "next/link";
import ShoppingBagBtn from "./shopping-bag-btn";
import ShoppingBagItem from "./shopping-bag-item";

const CartShoppingBag = ({ btnClassName }: { btnClassName?: string }) => {
  const cart = useCart();

  const cartItems = cart.cartItems;
  const cartTotal = cart.getTotal();
  const cartItemCount = cart.getQuantity();

  return (
    <HoverCard
      open={cart.isShoppingBagOpen}
      onOpenChange={cart.setIsShoppingBagOpen}
      openDelay={50}
      closeDelay={50}
    >
      <HoverCardTrigger>
        <ShoppingBagBtn quantity={cartItemCount} className={btnClassName} />
      </HoverCardTrigger>
      <HoverCardContent className="w-80  border-purple-500 bg-zinc-950 text-white">
        <div className="space-y-1">
          <h4 className="text-lg font-semibold">
            Cart ({cartItemCount}) items
          </h4>

          <Separator className="bg-purple-500" />

          {cartItemCount > 0 &&
            cartItems.map((item, idx) => (
              <ShoppingBagItem key={idx} cartItem={item} />
            ))}

          <div className="flex w-full justify-between py-1 text-sm">
            <p>Subtotal:</p> <Currency value={cartTotal} />
          </div>
          <div className="flex items-center pt-2">
            <span className="text-xs text-zinc-400">
              Shipping and sales tax calculated at checkout
            </span>
          </div>

          <Link href="/cart">
            <Button
              className="text mt-4 w-full rounded-full bg-purple-700 hover:bg-purple-500"
              type="button"
            >
              View cart & check out
            </Button>
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default CartShoppingBag;
