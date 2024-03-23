import { Fulfillment, FulfillmentStatus, PaymentStatus } from "@prisma/client";
import { DollarSign, Package, Truck } from "lucide-react";
import { ViewSection } from "~/components/common/sections/view-section.admin";
import { Badge } from "~/components/ui/badge";
import type { OrderAddress } from "~/modules/orders/types";
import { phoneFormatStringToNumber } from "~/utils/format-utils.wip";

type ViewOrderDetailsProps = {
  fulfillments: Fulfillment[];
  fulfillmentStatus: FulfillmentStatus;
  paymentStatus: PaymentStatus;
};
export const ViewOrderStatus = ({
  fulfillments,
  fulfillmentStatus,
  paymentStatus,
}: ViewOrderDetailsProps) => {
  return (
    <ViewSection
      title="Status"
      description="Quick overview of the order status"
      // bodyClassName="mt-0"
    >
      <div className="flex w-full items-start gap-4 text-sm">
        <Badge className="capitalize">
          <DollarSign className="h-5 w-5" /> {paymentStatus}
        </Badge>
        <Badge>
          <Truck className="h-5 w-5" /> {fulfillmentStatus}
        </Badge>

        {fulfillments?.map((fulfillment) => (
          <Badge key={fulfillment.id}>
            <Package className="h-5 w-5" /> {fulfillment.status}
          </Badge>
        ))}
      </div>
    </ViewSection>
  );
};
