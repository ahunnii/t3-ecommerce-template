import { ShoppingBag } from "lucide-react";

import Image from "next/image";

import { useRouter } from "next/navigation";

import Currency from "~/components/core/ui/currency";

import { Button } from "~/components/ui/button";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Separator } from "~/components/ui/separator";
import useCart from "~/features/cart/hooks/use-cart";
import { cn } from "~/utils/styles";
import ShoppingBagBtn from "./shopping-bag-btn";

const CartShoppingBag = () => {
  const cart = useCart();

  const cartItems = cart.getQuantity();
  const cartTotal = cart.getTotal();

  return (
    <HoverCard>
      <HoverCardTrigger>
        <ShoppingBagBtn quantity={cartItems} />
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-1">
          <h4 className="text-lg font-semibold">Cart ({cartItems}) items</h4>

          <Separator />

          {cartItems &&
            cart.cartItems.map((item, idx) => (
              <div
                className="grid w-full  grid-cols-12 items-start gap-x-8 gap-y-8 border-b border-gray-200 py-2"
                key={idx}
              >
                <div className="col-span-3">
                  <div className="relative aspect-square w-20">
                    <Image
                      src={item.product?.images[0]?.url ?? ""}
                      layout="fill"
                      objectFit="cover"
                      alt="product"
                    />
                  </div>
                </div>
                <div className="col-span-5 ">
                  <h1 className="text-base font-bold text-gray-900">
                    {item.product.name} ({item.quantity})
                  </h1>
                  <div className="mt-1 flex w-full text-xs">
                    {item.variant?.values.split(", ").map((item, idx) => (
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
                  <div className="mt-3 flex items-end justify-between">
                    {/* <p className="text-sm text-gray-900"> */}
                    <Currency value={item.product?.price} />
                    {/* </p> */}
                  </div>
                </div>
              </div>
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
