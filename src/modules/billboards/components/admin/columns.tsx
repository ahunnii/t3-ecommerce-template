import type { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { CellAction } from "./cell-action";

import { format } from "date-fns";
import type { BillboardColumn } from "../../types";

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
    cell: ({ row }) => (
      <Link
        href={`/admin/${row.original.storeId}/billboards/${row.original.id}`}
      >
        <Button variant={"link"} className="mx-0 px-0">
          {row.original.label}
        </Button>
      </Link>
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
