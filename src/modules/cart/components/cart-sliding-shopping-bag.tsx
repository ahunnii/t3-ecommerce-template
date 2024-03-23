import Link from "next/link";
import Currency from "~/components/common/currency";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import useCart from "../hooks/use-cart";
import ShoppingBagBtn from "./shopping-bag-btn";
import ShoppingBagItem from "./shopping-bag-item";

export function CartSlidingShoppingBag({
  btnClassName,
}: {
  btnClassName?: string;
}) {
  const cart = useCart();

  const cartItems = cart.cartItems;
  const cartTotal = cart.getTotal();
  const cartItemCount = cart.getQuantity();

  return (
    <Sheet>
      <SheetTrigger>
        {/* <Button variant="outline">Open</Button> */}
        <ShoppingBagBtn quantity={cartItemCount} className={btnClassName} />
      </SheetTrigger>
      <SheetContent className="flex h-full max-h-svh flex-col space-y-1 border-purple-500 bg-zinc-950 text-white">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold text-white">
            Cart ({cartItemCount}) items
          </SheetTitle>
        </SheetHeader>
        <Separator className="bg-purple-500" />
        <section className="flex h-full flex-col justify-between">
          <ScrollArea className="max-h-96">
            {cartItemCount > 0 &&
              cartItems.map((item, idx) => (
                <ShoppingBagItem key={idx} cartItem={item} />
              ))}
          </ScrollArea>

          <div className="flex flex-col space-y-1">
            {" "}
            <div className="mt-auto flex w-full justify-between py-1 text-sm">
              <p>Subtotal:</p> <Currency value={cartTotal} />
            </div>
            <div className="flex items-center pt-2">
              <span className="text-xs text-zinc-400">
                Shipping and sales tax calculated at checkout
              </span>
            </div>
            <SheetFooter className="mt-auto border-t border-purple-500">
              <Link href="/cart" className="w-full">
                <Button
                  className="text mt-4 w-full rounded-full bg-purple-700 hover:bg-purple-500"
                  type="button"
                >
                  View cart & check out
                </Button>
              </Link>
            </SheetFooter>
          </div>
        </section>
      </SheetContent>
    </Sheet>
  );
}
