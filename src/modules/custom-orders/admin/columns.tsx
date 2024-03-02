import type { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { CellAction } from "./cell-action";

import { format } from "date-fns";
import { Checkbox } from "~/components/ui/checkbox";
import type { CustomOrderColumn } from "../types";

export const columns: ColumnDef<CustomOrderColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
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
