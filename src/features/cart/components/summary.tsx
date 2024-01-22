import Button from "~/components/core/ui/button";
import Currency from "~/components/core/ui/currency";

import useCart from "~/features/cart/hooks/use-cart";

import { cn } from "~/utils/styles";
import useCheckout from "../hooks/use-checkout";

const Summary = ({ type = "default" }: { type: "default" | "dark" }) => {
  const { onCheckout, totalPrice, calculateShippingCost } = useCheckout();

  const { cartItems } = useCart((state) => state);

  return (
    <div
      className={cn(
        "mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8",
        type === "dark" ? "bg-purple-300" : "bg-gray-50"
      )}
    >
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between   ">
          <div className="text-base font-medium text-gray-500">Subtotal</div>
          <Currency value={totalPrice} />
        </div>
        <div className="flex items-center justify-between   ">
          <div className="text-base font-medium text-gray-500">Shipping</div>
          {typeof calculateShippingCost === "string" ? (
            calculateShippingCost
          ) : (
            <Currency value={calculateShippingCost ?? 0} />
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">
            *Order total
          </div>
          <Currency
            value={
              totalPrice +
              ((calculateShippingCost as string) === "FREE"
                ? 0
                : (calculateShippingCost as number))
            }
          />
        </div>
      </div>
      <Button
        onClick={() => void onCheckout()}
        disabled={cartItems.length === 0}
        className={cn("mt-6 w-full", type === "dark" ? "bg-purple-500" : "")}
      >
        Checkout
      </Button>
      <p className="mt-3 w-full text-center text-muted-foreground">
        * Shipping and taxes calculated at checkout
      </p>
    </div>
  );
};

export default Summary;
