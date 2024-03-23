import { ViewSection } from "~/components/common/sections/view-section.admin";
import type { OrderAddress } from "~/modules/orders/types";
import { phoneFormatStringToNumber } from "~/utils/format-utils.wip";

type ViewOrderDetailsProps = {
  shippingAddress: OrderAddress | null;
  email?: string;
  phone?: string;
};
export const ViewOrderDetails = ({
  phone,
  shippingAddress,
  email,
}: ViewOrderDetailsProps) => {
  return (
    <ViewSection
      title="Customer Details"
      description="Basic info of the customer"
      // bodyClassName="mt-0"
    >
      <div className="flex w-full flex-col items-start space-y-4 divide-y  text-sm">
        <div className="w-full  pt-4 text-left">
          <p className="text-muted-foreground">Name:</p>
          <p>{shippingAddress?.name}</p>
        </div>
        <div className="w-full pt-4 text-left ">
          <p className="text-muted-foreground">Phone:</p>
          <p>{phoneFormatStringToNumber(phone ?? "")}</p>
        </div>
        <div className="w-full  pt-4 text-left">
          <p className="text-muted-foreground">Email:</p>
          <p>{email}</p>
        </div>
        <div className="w-full  pt-4 text-left">
          <p className="text-muted-foreground">Shipping Address:</p>

          <p>{shippingAddress?.street}</p>
          <p>{shippingAddress?.additional}</p>
          <p>
            {shippingAddress?.city}, {shippingAddress?.state}{" "}
            {shippingAddress?.postal_code}
          </p>
        </div>
      </div>
    </ViewSection>
  );
};
