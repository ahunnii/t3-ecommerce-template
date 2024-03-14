import Image from "next/image";

import Currency from "~/components/common/currency";
import { Separator } from "~/components/ui/separator";

import type { OrderItem } from "~/modules/orders/types";

type ViewOrderSummaryProps = {
  orderItems: OrderItem[];
  subtotal: number;
  shippingCost?: number | null;
  taxes?: number | null;
  total: number;
};

export const ViewOrderSummary = ({
  orderItems,
  subtotal,
  shippingCost,
  taxes,
  total,
}: ViewOrderSummaryProps) => {
  return (
    <div className="w-full rounded-md border border-border bg-background/50 p-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Summary
      </h3>
      {orderItems.map((item) => (
        <div
          key={item.id}
          className="flex h-5 items-center space-x-4 py-8 text-sm"
        >
          <Image
            src={
              item.product?.featuredImage ??
              item.product?.images[0]?.url ??
              "/placeholder-image.webp"
            }
            width={50}
            height={50}
            alt=""
          />
          <p>
            {item.product.name}
            {item.variant ? `(${item.variant.values})` : ""} x{" "}
            <strong>{item.quantity}</strong> :{" "}
            <Currency value={item.product.price} />
          </p>
        </div>
      ))}
      <Separator className="my-2" />
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between ">
          Subtotal:{" "}
          <Currency
            value={(subtotal ?? 0) / 100}
            className="font-medium text-muted-foreground"
          />
        </div>
        <div className="flex items-center justify-between">
          Shipping:
          <Currency
            value={(shippingCost ?? 0) / 100}
            className="font-medium text-muted-foreground"
          />
        </div>
        <div className="flex items-center justify-between">
          Tax:
          <Currency
            value={(taxes ?? 0) / 100}
            className="font-medium text-muted-foreground"
          />
        </div>
        <div className="flex items-center justify-between">
          Total: <Currency value={(total ?? 0) / 100} className="text-2xl" />
        </div>
      </div>
    </div>
  );
};
