import Currency from "~/components/core/ui/currency";

import { Button } from "~/components/ui/button";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Separator } from "~/components/ui/separator";
import useCart from "~/features/cart/hooks/use-cart";

import ShoppingBagBtn from "./shopping-bag-btn";
import ShoppingBagItem from "./shopping-bag-item";

const CartShoppingBag = () => {
  const cart = useCart();

  const cartItems = cart.cartItems;
  const cartTotal = cart.getTotal();
  const cartItemCount = cart.getQuantity();

  return (
    <HoverCard>
      <HoverCardTrigger>
        <ShoppingBagBtn quantity={cartItemCount} />
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-1">
          <h4 className="text-lg font-semibold">
            Cart ({cartItemCount}) items
          </h4>

          <Separator />

          {cartItemCount &&
            cartItems.map((item, idx) => (
              <ShoppingBagItem key={idx} cartItem={item} />
            ))}

          <div className="flex w-full justify-between py-1 text-sm">
            <p>Subtotal:</p> <Currency value={cartTotal} />
          </div>
          <div className="flex items-center pt-2">
            <span className="text-xs text-muted-foreground">
              Shipping and sales tax calculated at checkout
            </span>
          </div>

          <Button className="w-full rounded-full">View cart & check out</Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default CartShoppingBag;
