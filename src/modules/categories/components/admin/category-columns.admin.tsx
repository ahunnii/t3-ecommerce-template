import type { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import Link from "next/link";
import { AdminPreviewInStoreButton } from "~/components/common/admin/admin-preview-in-store-button";
import { Button } from "~/components/ui/button";
import type { CategoryColumn } from "../../types";
import { CategoryCellAction } from "./category-cell-action.admin";

export const categoriesColumns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="group flex items-center gap-2">
        <Link
          href={`/admin/${row.original.storeId}/categories/${row.original.id}/edit`}
        >
          <Button variant={"link"} className="mx-0 px-0">
            {row.original.name}
          </Button>
        </Link>

        {row.original.collection?.id && (
          <AdminPreviewInStoreButton
            url={`/collections/${row.original.collection?.id}`}
          />
        )}
      </div>
    ),
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => <span>{row.original.products?.length}</span>,
  },
  {
    accessorKey: "updatedAt",
    header: "Last updated at",
    cell: ({ row }) => format(row.original.updatedAt, "MMMM do, yyyy"),
  },

  {
    id: "actions",

    cell: ({ row }) => <CategoryCellAction data={row.original} />,
  },
];
