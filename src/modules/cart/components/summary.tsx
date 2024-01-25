import Button from "~/components/core/ui/button";
import Currency from "~/components/core/ui/currency";

import useCart from "~/modules/cart/hooks/use-cart";

import { cn } from "~/utils/styles";
import useCheckout from "../hooks/use-checkout";

const Summary = ({ type = "default" }: { type: "default" | "dark" }) => {
  const { onCheckout, totalPrice, calculateShippingCost } = useCheckout();

  const { cartItems } = useCart((state) => state);

  return (
    <div
      className={cn(
        "mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8",
        type === "dark" ? "bg-black" : "bg-gray-50"
      )}
    >
      <h2
        className={cn(
          "text-lg font-medium ",
          type === "dark" ? "text-white" : "text-gray-900"
        )}
      >
        Order summary
      </h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between   ">
          <div
            className={cn(
              "text-base font-medium ",
              type === "dark" ? "text-white/50" : "text-gray-500"
            )}
          >
            Subtotal
          </div>
          <Currency
            value={totalPrice}
            className={type === "dark" ? "text-white" : ""}
          />
        </div>
        <div className="flex items-center justify-between   ">
          <div
            className={cn(
              "text-base font-medium ",
              type === "dark" ? "text-white/50" : "text-gray-500"
            )}
          >
            Shipping
          </div>
          {typeof calculateShippingCost === "string" ? (
            <span className={cn(type === "dark" ? "text-white" : "")}>
              {calculateShippingCost}
            </span>
          ) : (
            <Currency
              value={calculateShippingCost ?? 0}
              className={type === "dark" ? "text-white" : ""}
            />
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div
            className={cn(
              "text-base font-medium ",
              type === "dark" ? "text-white" : "text-gray-900"
            )}
          >
            *Order total
          </div>
          <Currency
            value={
              totalPrice +
              ((calculateShippingCost as string) === "FREE"
                ? 0
                : (calculateShippingCost as number))
            }
            className={type === "dark" ? "text-white" : ""}
          />
        </div>
      </div>
      <Button
        onClick={() => void onCheckout()}
        disabled={cartItems.length === 0}
        className={cn(
          "mt-6 w-full",
          type === "dark" ? "bg-white text-black" : ""
        )}
      >
        Checkout
      </Button>
      <p
        className={cn(
          "mt-3 w-full text-center",
          type === "dark" ? "text-white/75" : "text-muted-foreground"
        )}
      >
        * Shipping and taxes calculated at checkout
      </p>
    </div>
  );
};

export default Summary;
