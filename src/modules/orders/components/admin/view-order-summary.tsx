import { Eye } from "lucide-react";
import Image from "next/image";

import Currency from "~/components/common/currency";
import { ViewSection } from "~/components/common/sections/view-section.admin";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

import type { OrderItem } from "~/modules/orders/types";

type ViewOrderSummaryProps = {
  orderItems: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  fee: number;
  discount: number;
  receiptLink: string;
};

export const ViewOrderSummary = ({
  orderItems,
  subtotal,
  shipping,
  tax,
  receiptLink,
  discount,
  total,
}: ViewOrderSummaryProps) => {
  const handleViewReceipt = () => {
    window.open(receiptLink, "_blank");
  };
  return (
    <ViewSection title="Receipt" className="relative" bodyClassName="mt-0">
      <div className="flex flex-col space-y-4">
        <Button
          onClick={handleViewReceipt}
          className="absolute right-4 top-4 flex gap-2"
          variant={"outline"}
          size={"sm"}
        >
          <Eye /> View Payment Receipt
        </Button>

        {orderItems.map((item) => (
          <div key={item.id} className="flex  items-center space-x-4 text-sm">
            <div className="relative flex h-20 w-20 rounded-md  shadow">
              <Image
                className="rounded-md object-cover"
                src={item.product?.featuredImage ?? "/placeholder-image.webp"}
                fill={true}
                alt=""
              />
            </div>
            <p>
              {item.product.name}
              {item.variant ? `(${item.variant.values})` : ""} x{" "}
              <strong>{item.quantity}</strong> :{" "}
              <Currency value={item.product.price} />
            </p>
          </div>
        ))}
      </div>
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
            value={(shipping ?? 0) / 100}
            className="font-medium text-muted-foreground"
          />
        </div>
        <div className="flex items-center justify-between">
          Discounts:
          <Currency
            value={(discount ?? 0) / 100}
            className="font-medium text-muted-foreground"
          />
        </div>
        <div className="flex items-center justify-between">
          Tax:
          <Currency
            value={(tax ?? 0) / 100}
            className="font-medium text-muted-foreground"
          />
        </div>{" "}
        <Separator className="my-2" />
        <div className="flex items-center justify-between">
          Total: <Currency value={(total ?? 0) / 100} className="text-2xl" />
        </div>
      </div>
    </ViewSection>
  );
};
