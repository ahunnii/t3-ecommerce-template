import type { Order } from "@prisma/client";
import { DialogClose } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { usePayment } from "~/hooks/wip/use-payment";

export function OrderDetailsCustomerModal({
  data,
  children,
}: {
  data: Order;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { isFetching, paymentDetails, fetchPaymentDetails } = usePayment();

  useEffect(() => {
    if (isOpen && data && !isFetching) void fetchPaymentDetails(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"link"} className="mx-0 px-0">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order {data.id}</DialogTitle>
          <DialogDescription>
            {/* Make changes to your profile here. Click save when you're done. */}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-3 py-4">
          <p>Placed on {paymentDetails?.orderPlaced}</p>
          <p>Items: </p>
          <p>x1 Hollow Ichigo Dress -- $120.00</p>

          <p>Subtotal: $120.00</p>
          <p>Shipping (Flat Rate): $10.00</p>
          <p>Tax: $5.00</p>
          <p>Total: $135.00</p>

          <p>Billing Address:</p>
          {paymentDetails?.billingAddress}
          <p>Bob </p>
          <p>1235 Street St</p>
          <p>Bobtown, MI 48413</p>
          <p>{paymentDetails?.paymentDetails}</p>
          <p>Payment Status: Paid</p>

          <p>Shipping Address:</p>
          {paymentDetails?.shippingAddress}
          <p>Bob </p>
          <p>1235 Street St</p>
          <p>Bobtown, MI 48413</p>
          <p>Fulfillment Status: Fulfilled</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
