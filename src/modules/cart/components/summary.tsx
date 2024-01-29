import Button from "~/components/core/ui/button";
import Currency from "~/components/core/ui/currency";

import { useConfig } from "~/providers/style-config-provider";

import { CreditCard } from "lucide-react";
import { cn } from "~/utils/styles";
import useCheckout from "../hooks/use-checkout";

const Summary = ({ cartSize }: { cartSize: number }) => {
  const { onCheckout, totalPrice, calculateShippingCost } = useCheckout();
  const config = useConfig();

  return (
    <div
      className={cn(
        "mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8",
        config.cart.background
      )}
    >
      <h2
        className={cn("text-lg font-medium text-gray-900", config.cart.header)}
      >
        Order summary
      </h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "text-base font-medium text-gray-500",
              config.cart.subheader
            )}
          >
            Subtotal
          </div>
          <Currency value={totalPrice} className={cn("", config.cart.price)} />
        </div>
        <div className="flex items-center justify-between">
          {cartSize > 0 && (
            <>
              <div
                className={cn(
                  "text-base font-medium text-gray-500",
                  config.cart.subheader
                )}
              >
                Shipping
              </div>
              {calculateShippingCost === 0 && (
                <span className={cn("", config.cart.price)}>FREE</span>
              )}
              {calculateShippingCost > 0 && (
                <Currency
                  value={calculateShippingCost}
                  className={cn("", config.cart.price)}
                />
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div
            className={cn(
              "text-base font-medium text-gray-900",
              config.cart.header
            )}
          >
            *Order total
          </div>
          <Currency
            value={totalPrice + calculateShippingCost}
            className={cn("", config.cart.price)}
          />
        </div>
      </div>
      <Button
        onClick={() => void onCheckout()}
        disabled={cartSize === 0}
        className={cn("mt-6 w-full", config.cart.button)}
      >
        Checkout
      </Button>
      <p
        className={cn(
          "mt-3 w-full text-center text-muted-foreground",
          config.cart.finePrint
        )}
      >
        * Shipping and taxes calculated at checkout
      </p>
    </div>
  );
};

export default Summary;
