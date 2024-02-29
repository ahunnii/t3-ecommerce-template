import Currency from "~/components/core/ui/currency";
import { Button } from "~/components/ui/button";

import { useConfig } from "~/providers/style-config-provider";

import { CreditCard, X } from "lucide-react";
import { ClipboardEventHandler, useRef, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";
import useCheckout from "../hooks/use-checkout";

const Summary = ({ cartSize }: { cartSize: number }) => {
  const {
    onCheckout,
    totalPrice,
    calculateShippingCost,
    totalDiscount,
    totalDiscountDifference,
  } = useCheckout();
  const config = useConfig();
  const inputRef = useRef<HTMLInputElement>(null);

  const [couponValue, setCouponValue] = useState<string>("");

  const getCoupon = api.discounts.getCoupon.useQuery(
    {
      code: couponValue ?? inputRef.current?.value,
      orderTotal: totalPrice,
      shippingTotal: calculateShippingCost,
    },
    { enabled: false }
  );

  const validCode = getCoupon?.data && couponValue !== "";

  const checkForCoupon = () => {
    if (couponValue) {
      if (couponValue === getCoupon?.data?.code) {
        toastService.error(
          "Only one coupon can be used at a time",
          "Invalid Coupon"
        );
      }
      getCoupon
        .refetch({})
        .then(({ data }) => {
          if (data) {
            toastService.success("Coupon applied successfully");
          } else {
            toastService.error("Coupon not found", "Invalid Coupon");
          }
        })
        .catch((e) => {
          console.log(e);
          toastService.error("Coupon not found", "Invalid Coupon");
        });
    }
  };

  const subTotal = totalDiscount ?? totalPrice;

  const discountedShipping =
    validCode && getCoupon?.data?.type === "SHIPPING"
      ? getCoupon?.data?.valueType === "FIXED"
        ? calculateShippingCost - getCoupon?.data?.value
        : calculateShippingCost -
          (calculateShippingCost * getCoupon?.data?.value) / 100
      : calculateShippingCost;

  const discountedSubtotal =
    validCode && getCoupon?.data?.type === "ORDER"
      ? getCoupon?.data?.valueType === "FIXED"
        ? subTotal - getCoupon?.data?.value ?? 0
        : subTotal - (subTotal * getCoupon?.data?.value) / 100
      : subTotal;

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

      {/* <div className="flex gap-2 py-2">
        <Input
          placeholder="Discount code"
          ref={inputRef}
          value={couponValue}
          onChange={(e) => setCouponValue(e.target.value)}
        />
        <Button
          variant="secondary"
          onClick={checkForCoupon}
          disabled={couponValue === "" || couponValue === undefined}
        >
          Apply
        </Button>
      </div> */}

      {validCode && (
        <div className="flex">
          <Badge variant="secondary">
            {couponValue}
            <button
              className="ml-2"
              onClick={() => {
                setCouponValue("");
              }}
              aria-label="Remove coupon"
            >
              <X className=" text-black" />
            </button>
          </Badge>
        </div>
      )}

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
        {totalDiscountDifference !== 0 && (
          <>
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "text-base font-medium text-gray-500",
                  config.cart.subheader
                )}
              >
                Discounts
              </div>
              <div className="flex">
                <span className="font-bold text-white"> - </span>
                <Currency
                  value={totalDiscountDifference}
                  className={cn("", config.cart.price)}
                />
              </div>
            </div>
          </>
        )}
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
              {calculateShippingCost !== null && calculateShippingCost > 0 && (
                <Currency
                  value={calculateShippingCost}
                  className={cn("", config.cart.price)}
                />
              )}
            </>
          )}
        </div>
        <div
          className={cn(
            "flex items-center justify-between border-t border-gray-200 pt-4",
            validCode && "items-start "
          )}
        >
          <div
            className={cn(
              "text-base font-medium text-gray-900",
              config.cart.header
            )}
          >
            *Order total
          </div>
          <div>
            <Currency
              value={discountedSubtotal + discountedShipping}
              className={cn("", config.cart.price)}
            />

            {validCode && (
              <Currency
                value={(totalDiscount ?? totalPrice) + calculateShippingCost}
                className={cn("font-medium text-muted-foreground line-through")}
              />
            )}
          </div>
        </div>{" "}
        {validCode && (
          <p className="w-full text-xs text-muted-foreground">
            {couponValue} : {getCoupon?.data?.description}
          </p>
        )}
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
