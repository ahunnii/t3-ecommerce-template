import Currency from "~/components/core/ui/currency";

import * as React from "react";

import type { ShippingType } from "@prisma/client";

import { Label } from "~/components/ui/label";

type Props = {
  estimatedCompletion: number | null;
  shippingType: ShippingType;
  shippingCost: number | null;
};
export const ViewProductsShipping = ({ shippingType, shippingCost }: Props) => {
  return (
    <div className="w-full rounded-md border border-border bg-background/50 p-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Shipping
      </h3>

      <div className="grid grid-cols-3 items-start">
        <Label className="text-sm" htmlFor="availability">
          Shipping Type
        </Label>
        <div className="col-span-2 flex items-center text-sm">
          {shippingType}
        </div>
      </div>

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
