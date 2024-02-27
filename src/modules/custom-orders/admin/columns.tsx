import type { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { CellAction } from "./cell-action";

import { format } from "date-fns";
import type { CustomOrderColumn } from "../types";

export const columns: ColumnDef<CustomOrderColumn>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <Link
        href={`/admin/${row.original.storeId}/custom-orders/${row.original.id}`}
      >
        <Button variant={"link"} className="mx-0 px-0">
          {row.original.email}
        </Button>
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.original.status,
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
