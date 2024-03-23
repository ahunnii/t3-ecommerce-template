"use client";

import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AdvancedDataTable } from "~/components/common/tables/advanced-data-table";
import { Button } from "~/components/ui/button";
import { columns, type OrderColumn } from "./columns";
import { statuses } from "./orders-table-data";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  const params = useRouter();
  const storeId = params.query.storeId as string;
  return (
    <div className="mx-auto max-w-7xl space-y-4 p-8">
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${data.length})`}
          description="Manage orders for your store"
        />

        <Link href={`/admin/${storeId}/orders/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </Link>
      </div>
      <Separator />
      <AdvancedDataTable
        searchKey="name"
        columns={columns}
        data={data}
        filters={[statuses]}
      />
    </div>
  );
};
