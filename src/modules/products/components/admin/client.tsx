"use client";

import { Plus } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";

import { ApiList } from "~/components/ui/api-list";
import { Button } from "~/components/ui/button";

import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";

import { AdvancedDataTable } from "~/components/common/tables/advanced-data-table";
import { columns, type ProductColumn } from "./columns";
import { productFilterOptions } from "./product-filter-options.admin";

interface ProductsClientProps {
  data: ProductColumn[];
}

export const ProductsClient: React.FC<ProductsClientProps> = ({ data }) => {
  const params = useRouter();
  const router = useNavigationRouter();

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-8">
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage products for your store"
        />
        <Button
          onClick={() =>
            router.push(`/admin/${params.query.storeId as string}/products/new`)
          }
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <AdvancedDataTable
        searchKey="name"
        columns={columns}
        data={data}
        // filters={productFilterOptions}
      />
      <Heading title="Public API" description="API Calls for Products" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </div>
  );
};
