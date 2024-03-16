import type { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import type { CategoryColumn } from "../../types";
import { CategoryCellAction } from "./category-cell-action.admin";

export const categoriesColumns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/admin/${row.original.storeId}/categories/${row.original.id}`}
      >
        <Button variant={"link"} className="mx-0 px-0">
          {row.original.name}
        </Button>
      </Link>
    ),
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => <span>{row.original.products?.length}</span>,
  },
  {
    accessorKey: "attributes",
    header: "Attributes",
    cell: ({ row }) => <span>{row.original.attributes?.length}</span>,
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => format(row.original.updatedAt, "MMMM do, yyyy"),
  },

  {
    id: "actions",
    cell: ({ row }) => <CategoryCellAction data={row.original} />,
  },
];
