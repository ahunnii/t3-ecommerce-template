"use client";

import { DataTable } from "~/components/ui/data-table";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";

import { AdvancedDataTable } from "./advanced-data-table";
import { columns, type OrderColumn } from "./columns";
import { statuses } from "./orders-table-data";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />
      <Separator />
      <AdvancedDataTable
        searchKey="name"
        columns={columns}
        data={data}
        filters={[statuses]}
      />
    </>
  );
};
