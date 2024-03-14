import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { ViewSection } from "~/components/common/sections/view-section.admin";

import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { CustomOrder } from "../../types";

type Props = { customOrder: CustomOrder };
export const ViewCustomOrder = ({ customOrder }: Props) => {
  return (
    <div className="flex w-3/4 flex-col space-y-2">
      <ViewSection title="Customer Details">
        <div className="grid grid-cols-3 items-start ">
          <Label className="text-lg">Name</Label>
          <p className="col-span-2 flex items-center gap-1 text-lg">
            {customOrder.name}
          </p>
        </div>
        <div className="grid grid-cols-3 items-start ">
          <Label className="text-lg">Email</Label>
          <p className="col-span-2 flex items-center gap-1 text-lg">
            {customOrder.email}
          </p>
        </div>
      </ViewSection>
      <ViewSection title="Request">
        <div className="grid grid-cols-3 items-start ">
          <Label className="text-lg">Product Type</Label>
          <p className="col-span-2 flex items-center gap-1 text-lg capitalize">
            {customOrder.type}
          </p>
        </div>

        <div className="grid grid-cols-3 items-start ">
          <Label className="text-lg">Product</Label>
          <Link
            href={`/admin/${customOrder?.storeId}/products/${customOrder?.productId}`}
            className="col-span-2 flex items-center gap-1 text-lg font-medium text-slate-500 hover:underline"
          >
            Click to view the custom product <ExternalLink />
          </Link>
        </div>
      </ViewSection>
      <ViewSection title=" Description">
        <ScrollArea className="h-96 w-full">
          <p className="text-base text-muted-foreground">
            {customOrder.description
              ? customOrder.description
              : "No description added"}
          </p>
        </ScrollArea>
      </ViewSection>
    </div>
  );
};
