import type { ShippingLabel } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { useShippingModal } from "~/hooks/admin/use-shipping-modal";

type ViewOrderFulfillmentProps = {
  shippingLabel: ShippingLabel | null;
  id: string;
};
export const ViewOrderFulfillment = ({
  shippingLabel,
  id,
}: ViewOrderFulfillmentProps) => {
  const handleShippingLabel = () => {
    shippingModal.onOpen(id);
  };

  const shippingModal = useShippingModal();
  return (
    <div className="w-full rounded-md border border-border bg-background/50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Fulfillment
        </h3>
        <Button onClick={handleShippingLabel}>Get Shipping Label</Button>
      </div>

      <p>Status:</p>
      <p>
        {shippingLabel?.createdAt.toDateString() ?? "No shipping label created"}
      </p>
    </div>
  );
};
