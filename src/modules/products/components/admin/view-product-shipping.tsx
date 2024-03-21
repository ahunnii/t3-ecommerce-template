import Currency from "~/components/common/currency";

import * as React from "react";

import { Label } from "~/components/ui/label";

type Props = {
  estimatedCompletion: number | null;
  shippingCost: number | null;
};
export const ViewProductsShipping = ({ shippingCost }: Props) => {
  return (
    <div className="w-full rounded-md border border-border bg-background/50 p-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Shipping
      </h3>

      <div className="grid grid-cols-3 items-start">
        <Label className="text-sm" htmlFor="availability">
          Handling Fee
        </Label>
        <div className="col-span-2 flex items-center text-sm">
          <Currency value={shippingCost ?? 0} />
        </div>
      </div>
    </div>
  );
};
