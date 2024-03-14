import { useRouter } from "next/router";

import { Plus } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";

import Link from "next/link";

import { AdvancedDataTable } from "~/components/common/tables/advanced-data-table";

import type { CustomOrderColumn } from "../../types";
import { columns } from "./columns";
import { filterOptions } from "./filter-options";

type Props = { data: CustomOrderColumn[] };

export const CustomOrderClient: React.FC<Props> = ({ data }) => {
  const params = useRouter();
  const storeId = params.query.storeId as string;

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <Heading
          title={`Custom Order Requests (${data.length})`}
          description="Manage custom requests for your store."
        />
        <Link href={`/admin/${storeId}/custom-orders/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </Link>
      </div>
      <Separator />

      <AdvancedDataTable
        searchKey="email"
        columns={columns}
        data={data}
        filters={filterOptions}
      />
    </div>
  );
};
