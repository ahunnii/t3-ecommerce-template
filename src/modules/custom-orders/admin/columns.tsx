import type { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { CellAction } from "./cell-action";

import { format } from "date-fns";

export type CustomOrderColumn = {
  id: string;
  storeId: string;
  email: string;
  name: string;
  type: string;
  status: string;
  store: {
    name: string;
    address: {
      street: string;
      additional: string | null;
      city: string;
      state: string;
      postal_code: string;
    };
  };
  description: string;
  createdAt: Date;
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
  };
};

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
