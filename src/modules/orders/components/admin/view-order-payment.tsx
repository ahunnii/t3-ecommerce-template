import Link from "next/link";
import toast from "react-hot-toast";
import Currency from "~/components/core/ui/currency";
import { Button } from "~/components/ui/button";
import { env } from "~/env.mjs";

type ViewOrderPaymentProps = {
  id: string;
  referenceId: string;
  isPaid: boolean;
  total: number;
};
export const ViewOrderPayment = ({
  id,
  referenceId,
  isPaid,
  total,
}: ViewOrderPaymentProps) => {
  const handleRefund = async () => {
    const res = await fetch(env.NEXT_PUBLIC_API_URL + "/refund", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: id,
        referenceId: referenceId,
      }),
    });

    if (res.status === 200) {
      toast.success("Order refunded");
    } else {
      toast.error("Failed to refund order");
    }
  };
  return (
    <div className="w-full rounded-md border border-border bg-background/50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Payment
        </h3>

        <Button onClick={() => void handleRefund()}>Refund Order</Button>
      </div>{" "}
      <p>Status: {isPaid ? "Paid" : "Not Paid"} </p>
      {env.NEXT_PUBLIC_STRIPE_PAYMENT_INTENT_URL && (
        <Link
          href={`${env.NEXT_PUBLIC_STRIPE_PAYMENT_INTENT_URL}${referenceId}`}
          target="_blank"
        >
          <Button
            className="flex px-0 text-left text-purple-500"
            variant={"link"}
          >
            {referenceId}
          </Button>
        </Link>
      )}{" "}
      {!env.NEXT_PUBLIC_STRIPE_PAYMENT_INTENT_URL && <p>{referenceId}</p>}
      <p className="flex w-full justify-between">
        Total Paid: <Currency value={(total ?? 0) / 100} />
      </p>
    </div>
  );
};