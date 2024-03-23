import type { Fulfillment, FulfillmentStatus } from "@prisma/client";
import { Download, Pencil } from "lucide-react";

import { ViewSection } from "~/components/common/sections/view-section.admin";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import type { OrderAddress, OrderItem } from "~/modules/orders/types";
import { useShippingModal } from "~/modules/shipping/hooks/use-shipping-modal";
import { api } from "~/utils/api";

type ViewOrderFulfillmentProps = {
  fulfillments: Fulfillment[];
  fulfillmentStatus: FulfillmentStatus;

  shippingAddress: OrderAddress | null;
  orderItems: OrderItem[];

  createdAt: Date;
  id: string;
};
export const ViewOrderFulfillment = ({
  fulfillments,
  id,
  orderItems,
  shippingAddress,
  createdAt,
  fulfillmentStatus,
}: ViewOrderFulfillmentProps) => {
  const handleShippingLabel = () => {
    shippingModal.onOpen(id);
  };

  const updateFulfillment = api.orders.updateFulfillmentStatus.useMutation();
  const updateOrderShippingStatus =
    api.orders.updateShippingStatus.useMutation();

  const shippingModal = useShippingModal();

  const extraCompletionDays =
    orderItems
      ?.map((item) => item?.product?.estimatedCompletion)
      .reduce((a, b) => a + b, 0) ?? 0;

  const shipOutDate = new Date(
    createdAt.setDate(createdAt.getDate() + 7 + extraCompletionDays)
  ).toDateString();

  const handleDownloadShippingLabel = ({
    url,
    fulfillmentId,
  }: {
    url: string;
    fulfillmentId: string;
  }) => {
    updateFulfillment.mutate({
      fulfillmentId,
      status: "LABEL_PRINTED",
    });

    if (
      fulfillments?.filter(
        (fulfillment) => fulfillment.status === "LABEL_PRINTED"
      ).length === fulfillments.length
    )
      updateOrderShippingStatus.mutate({
        orderId: id,
        fulfillmentStatus: "FULFILLED",
      });
    else
      updateOrderShippingStatus.mutate({
        orderId: id,
        fulfillmentStatus: "PARTIAL",
      });

    window.open(`${url}`, "_blank");
  };

  return (
    <ViewSection
      title="Fulfillment"
      description={`Ship out by ${shipOutDate}`}
      className="relative"
    >
      <Button
        onClick={handleShippingLabel}
        className="absolute right-4 top-4 flex items-center gap-2"
      >
        <Pencil size={20} />
        {fulfillments?.length > 0
          ? "Create another label"
          : "Create shipping label"}
      </Button>

      <p>
        Status: <span className="font-semibold">{fulfillmentStatus}</span>{" "}
      </p>

      <div className="w-full  pt-4 text-left">
        <p className="text-muted-foreground">Ship To:</p>{" "}
        <p>{shippingAddress?.name}</p>
        <p>{shippingAddress?.street}</p>
        <p>{shippingAddress?.additional}</p>
        <p>
          {shippingAddress?.city}, {shippingAddress?.state}{" "}
          {shippingAddress?.postal_code}
        </p>
      </div>

      {fulfillments?.length > 0 && <Separator className="my-4" />}
      {fulfillments?.map((fulfillment, idx) => (
        <ViewSection
          key={fulfillment.id}
          title={`Shipment ${idx + 1} Details`}
          description="View the details of the shipment."
          titleClassName="text-sm font-medium "
          bodyClassName="flex items-center justify-between gap-4"
        >
          <div className="flex flex-col">
            <p>Purchased on: {fulfillment.createdAt.toDateString()}</p>
            <p>Carrier: {fulfillment.carrier}</p>
            <p>Tracking Number: {fulfillment.trackingNumber}</p>
            <p>Status: {fulfillment.status}</p>
          </div>

          <Button
            onClick={() =>
              handleDownloadShippingLabel({
                url: `${fulfillment.labelUrl}`,
                fulfillmentId: fulfillment.id,
              })
            }
            className="flex items-center gap-2"
          >
            <Download size={20} />
            {/* Download Shipping Label */}
          </Button>
        </ViewSection>
      ))}

      {/* <h4 className="mt-4 flex  items-center gap-2 text-lg font-bold">
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
      </div> */}
    </ViewSection>
  );
};
