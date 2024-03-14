import type { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import type { CategoryColumn } from "../types";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<CategoryColumn>[] = [
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
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => format(row.original.createdAt, "MMMM do, yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
