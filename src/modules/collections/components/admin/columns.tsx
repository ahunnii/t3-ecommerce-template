import type { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import type { CollectionColumn } from "../../types";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<CollectionColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center">
        <Link
          className="text-sm text-gray-500"
          href={`/admin/${row.original.storeId}/collections/${row.original.id}`}
        >
          <Button variant={"link"} className="mx-0 px-0">
            {row.original.name}{" "}
          </Button>
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "products",
    header: "# of Products",
    cell: ({ row }) => (
      <div className="flex items-center">{row.original.products.length}</div>
    ),
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
