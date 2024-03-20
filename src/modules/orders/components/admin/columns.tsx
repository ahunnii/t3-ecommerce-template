import type { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import Link from "next/link";
import Currency from "~/components/common/currency";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { cn } from "~/utils/styles";
import { CellAction } from "./cell-action";

export type OrderColumn = {
  id: string;
  storeId: string;
  status: string;
  isPaid: boolean;
  total: number;

  createdAt: Date;

  isShipped: boolean;
  shippingLabel: {
    labelUrl: string | null | undefined;
  } | null;
};

export const columns: ColumnDef<OrderColumn>[] = [
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
    accessorKey: "id",
    header: "Order Id",
    cell: ({ row }) => {
      return (
        <Link href={`/admin/${row.original.storeId}/orders/${row.original.id}`}>
          <Button variant={"link"} className="mx-0 truncate px-0">
            {row.original.id}
          </Button>
        </Link>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date added",
    cell: ({ row }) => {
      return (
        <p className="">{format(row.original.createdAt, "MMMM do, yyyy")}</p>
      );
    },
  },

  {
    accessorKey: "name",
    header: "Customer Name",
  },
  {
    accessorKey: "status",
    header: "Order Status",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      return <p className="">{`${row.original.status.toString()}`}</p>;
    },
  },
  {
    accessorKey: "isShipped",
    header: "Shipped Out",
  },
  {
    accessorKey: "isPaid",
    header: "Payment Status",
    cell: ({ row }) => {
      return (
        <p className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            {/* <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span> */}
            <span
              className={cn(
                "relative inline-flex h-2 w-2 rounded-full bg-gray-500",
                row.original.isPaid && "bg-green-500"
              )}
            ></span>
          </span>
          {row.original.isPaid ? "Paid" : "Awaiting"}
        </p>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Total price",
    cell: ({ row }) => {
      return (
        <Currency className="font-base" value={row.original.total / 100} />
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
