"use client";

import { Plus } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";

import { ApiList } from "~/components/ui/api-list";
import { Button } from "~/components/ui/button";

import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";

import { AdvancedDataTable } from "~/components/common/tables/advanced-data-table";
import type { DiscountColumn } from "../types";
import { columns } from "./columns";

type Props = {
  data: DiscountColumn[];
};

export const DiscountsClient: React.FC<Props> = ({ data }) => {
  const params = useRouter();
  const router = useNavigationRouter();

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <Heading
          title={`Discounts (${data.length})`}
          description="Manage your site's coupons and promotions"
        />
        <Button
          onClick={() =>
            router.push(
              `/admin/${params.query.storeId as string}/discounts/new`
            )
          }
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <AdvancedDataTable searchKey="code" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Discounts" />
      <Separator />
      <ApiList entityName="discounts" entityIdName="discountId" />
    </div>
  );
};
