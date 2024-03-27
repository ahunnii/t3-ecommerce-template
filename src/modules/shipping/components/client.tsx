"use client";

import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";

import { AdvancedDataTable } from "~/components/common/tables/advanced-data-table";
import { shippingClient, type ShippingColumn } from "./columns";

interface OrderClientProps {
  data: ShippingColumn[];
}

export const ShippingClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <div className="mx-auto max-w-7xl space-y-4 p-8 ">
      <Heading
        title={`Shipments (${data.length})`}
        description="View past shipping orders from your store"
      />
      <Separator />
      <AdvancedDataTable
        searchKey="tracking_status"
        columns={shippingClient}
        data={data}
      />
    </div>
  );
};
