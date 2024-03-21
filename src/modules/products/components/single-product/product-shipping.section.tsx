import { Box, Calendar, Truck } from "lucide-react";
import Link from "next/link";
import Currency from "~/components/common/currency";
import { cn } from "~/utils/styles";

type Props = {
  estimatedCompletion: number;

  hasFlatRateShipping: boolean;
  hasFreeShipping: boolean;
  flatRateAmount: number | null;
  minFreeShippingAmount: number | null;
};

export const ProductShippingSection = (props: Props) => {
  return (
    <div>
      <h3 className="text-lg font-bold">Shipping and Return Policy</h3>
      <div className={cn("flex flex-col space-y-2", "")}>
        <p className="flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          {props.estimatedCompletion > 0
            ? `Ships out in roughly ${props.estimatedCompletion} days.`
            : "Ships out immediately. "}{" "}
        </p>
        <p className="flex items-center gap-2">
          <Box className="h-6 w-6" /> All sales are final.{" "}
          <Link
            href="/policies/refund-policy"
            className="font-semibold transition-all duration-75 ease-in hover:underline"
          >
            Read more here.
          </Link>
        </p>
        <div>
          {props.hasFreeShipping && props.hasFlatRateShipping ? (
            <>
              <p className="flex items-center gap-2">
                <Truck className="h-6 w-6" />
                <span className="flex gap-1">
                  Cost to Ship: <Currency value={props.flatRateAmount ?? 0} />{" "}
                  flat rate
                </span>
              </p>

              <p className="pl-8 ">
                Enjoy free shipping in the US when you spend ${" "}
                {props.minFreeShippingAmount}+ on your order.
              </p>
            </>
          ) : props.hasFreeShipping ? (
            <p>
              {" "}
              The customer gets free shipping if their order is at least ${" "}
              {props.minFreeShippingAmount} is applied to every order.
            </p>
          ) : props.hasFlatRateShipping ? (
            <p>
              $ {props.flatRateAmount} is applied to every order, no matter the
              order amount.
            </p>
          ) : (
            <p>None</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Order today to get by Mar 29-Apr 12

// Returns & exchanges accepted

//  within 30 days
// Cost to ship: $10.62
// Enjoy free shipping to the US when you spend $35+ at this shop.
