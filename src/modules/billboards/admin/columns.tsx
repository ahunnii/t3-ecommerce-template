import type { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { CellAction } from "./cell-action";

export type BillboardColumn = {
  id: string;
  storeId: string;
  label: string;
  createdAt: string;
};

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
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];