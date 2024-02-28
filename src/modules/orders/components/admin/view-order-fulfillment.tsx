import type { ShippingLabel } from "@prisma/client";
import { Download, Pencil } from "lucide-react";
import Link from "next/link";
import { InfoButton } from "~/components/common/buttons/info-button";
import { Button } from "~/components/ui/button";
import { useShippingModal } from "~/modules/shipping/hooks/use-shipping-modal";

type ViewOrderFulfillmentProps = {
  shippingLabel: ShippingLabel | null;
  isShipped: boolean;

  id: string;
};
export const ViewOrderFulfillment = ({
  shippingLabel,
  id,
  isShipped,
}: ViewOrderFulfillmentProps) => {
  const handleShippingLabel = () => {
    shippingModal.onOpen(id);
  };

  const shippingModal = useShippingModal();

  const isReadyToShip = (shippingLabel?.labelUrl && !isShipped) ?? false;
  const isNotReadyToShip = (!shippingLabel?.labelUrl && !isShipped) ?? false;
  const shipStatus = isShipped
    ? "Shipped"
    : isReadyToShip
    ? "Ready to Ship"
    : isNotReadyToShip
    ? "Not Ready to Ship"
    : "No shipping label created";

  return (
    <div className="w-full rounded-md border border-border bg-background/50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-bold tracking-tight">
          Fulfillment
        </h3>
        <div className="flex gap-2">
          {shippingLabel?.labelUrl && (
            <Button
              onClick={() => {
                window.open(shippingLabel.labelUrl!, "_blank");
              }}
              className="flex items-center gap-2"
            >
              <Download size={20} />
              Download Shipping Label
            </Button>
          )}
          {!shippingLabel?.labelUrl && (
            <Button
              onClick={handleShippingLabel}
              className="flex items-center gap-2"
            >
              {" "}
              <Pencil size={20} />
              Get Shipping Label
            </Button>
          )}{" "}
        </div>
      </div>

      <p>
        Status: <span className="font-semibold">{shipStatus}</span>{" "}
      </p>
      <p>
        Shipping Label Created:{" "}
        <span className="font-semibold">
          {shippingLabel?.createdAt.toDateString() ??
            "No shipping label created"}
        </span>{" "}
      </p>

      <h4 className="mt-4 flex  items-center gap-2 text-lg font-bold">
        Useful Links{" "}
        <span className="font-normal">
          <InfoButton summary="The shipping service used is Shippo. You can modify more on shipping from within your Shippo account." />
        </span>
      </h4>

      <div className="flex flex-col space-y-0">
        <Link
          href={`https://apps.goshippo.com/settings/labels`}
          target="_blank"
        >
          <Button
            className="m-0 flex p-0 text-left text-purple-500"
            variant={"link"}
          >
            Update Label Sizes
          </Button>
        </Link>

        <Link
          href={`https://apps.goshippo.com/settings/account/billing`}
          target="_blank"
        >
          <Button
            className="m-0 flex p-0 text-left text-purple-500"
            variant={"link"}
          >
            Update Label Billing
          </Button>
        </Link>

        <Link href={`https://apps.goshippo.com/shipments`} target="_blank">
          <Button
            className="m-0 flex p-0 text-left text-purple-500"
            variant={"link"}
          >
            View All Shipments
          </Button>
        </Link>

        <Link
          href={`https://apps.goshippo.com/settings/carriers`}
          target="_blank"
        >
          <Button
            className="m-0 flex p-0 text-left text-purple-500"
            variant={"link"}
          >
            Update available carriers
          </Button>
        </Link>
      </div>
    </div>
  );
};
