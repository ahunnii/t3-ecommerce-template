import type { Fulfillment, PaymentStatus } from "@prisma/client";
import Link from "next/link";

import Currency from "~/components/common/currency";
import { ViewSection } from "~/components/common/sections/view-section.admin";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { env } from "~/env.mjs";
import { toastService } from "~/services/toast";

type ViewOrderPaymentProps = {
  id: string;
  referenceNumber: string;
  fee: number;
  paymentStatus: PaymentStatus;
  total: number;
  fulfillments: Fulfillment[];
};
export const ViewOrderPayment = ({
  id,
  referenceNumber,
  paymentStatus,
  total,
  fulfillments,
  fee,
}: ViewOrderPaymentProps) => {
  const handleRefund = async () => {
    const res = await fetch(env.NEXT_PUBLIC_API_URL + "/refund", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: id,
        referenceNumber,
      }),
    });

    if (res.status === 200) {
      toastService.success("Order refunded");
    } else {
      toastService.error("Failed to refund order", res);
    }
  };

  const totalCostOfLabels = fulfillments?.reduce(
    (acc, curr) => acc + (curr?.cost ?? 0),
    0
  );
  return (
    <ViewSection
      title="Payment"
      description="View additional details on the charge as well as what hits your bank account."
    >
      <p>
        Status: <span className="font-semibold"> {paymentStatus}</span>{" "}
      </p>
      {/* <Separator className="my-2" /> */}
      <p className="my-4 text-lg font-semibold">Bank Account Breakdown:</p>
      {!env.NEXT_PUBLIC_STRIPE_PAYMENT_INTENT_URL && <p>{referenceNumber}</p>}
      <p className="flex w-full justify-between">
        Customer Paid: <Currency value={(total ?? 0) / 100} />
      </p>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          Processor Fee:{" "}
          <span className="flex gap-1 text-red-500">
            {" "}
            - <Currency value={(fee ?? 0) / 100} />
          </span>
        </div>
      </div>{" "}
      {totalCostOfLabels > 0 && (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            Cost of shipping labels:{" "}
            <span className="flex gap-1 text-red-500">
              {" "}
              - <Currency value={totalCostOfLabels ?? 0} />
            </span>
          </div>
        </div>
      )}
      <div className="mt-5 flex flex-col space-y-2">
        <div className="flex items-center justify-between font-semibold">
          You made:
          <span className="flex gap-1 ">
            <Currency value={(total - fee ?? 0) / 100 - totalCostOfLabels} />
          </span>
        </div>
      </div>
      <Separator className="my-4" />
      {env.NEXT_PUBLIC_STRIPE_PAYMENT_INTENT_URL && (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`${env.NEXT_PUBLIC_STRIPE_PAYMENT_INTENT_URL}${referenceNumber}`}
            target="_blank"
          >
            <Button
              className="flex px-0 text-left text-purple-500"
              variant={"link"}
            >
              Click to view payment
            </Button>
          </Link>
          <Button onClick={() => void handleRefund()} variant={"outline"}>
            Refund Order
          </Button>
        </div>
      )}
    </ViewSection>
  );
};
