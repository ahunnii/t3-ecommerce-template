import type { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import Link from "next/link";
import Currency from "~/components/common/currency";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";

import type { FulfillmentStatus, PaymentStatus } from "@prisma/client";
import { CellAction } from "./cell-action";

export type OrderColumn = {
  id: string;
  storeId: string;
  email: string;
  shippingAddress: { name: string | null } | null;
  orderItems: { id: string; quantity: number }[];
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  total: number;
  createdAt: Date;
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
    accessorKey: "name",
    accessorFn: (row) => row.shippingAddress?.name ?? "",
    header: "Name",
    filterFn: (row, id, value) => {
      const name: string = row.getValue(id);
      return name.includes(value as string);
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <Link
            href={`/admin/${row.original.storeId}/orders/${row.original.id}`}
          >
            <Button variant={"link"} className="mx-0 truncate px-0">
              {row.original.shippingAddress?.name}
            </Button>
          </Link>
          <span className="text-xs text-muted-foreground">
            #{row.original.id}
          </span>
        </div>
      );
    },
  },

  // {
  //   accessorKey: "id",
  //   header: "Order Id",
  //   cell: ({ row }) => {
  //     return (
  //       <Link href={`/admin/${row.original.storeId}/orders/${row.original.id}`}>
  //         <Button variant={"link"} className="mx-0 truncate px-0">
  //           {row.original.id}
  //         </Button>
  //       </Link>
  //     );
  //   },
  // },
  {
    accessorKey: "createdAt",
    header: "Date added",
    cell: ({ row }) => {
      return (
        <p className="">{format(row.original.createdAt, "MMMM do, yyyy")}</p>
      );
    },
  },

  // {
  //   accessorKey: "email",
  //   header: "Email",
  // },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      return <p className="">{`${row.original.paymentStatus}`}</p>;
    },
  },
  {
    accessorKey: "fulfillmentStatus",
    header: "Fulfillment Status",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      return <p className="">{`${row.original.fulfillmentStatus}`}</p>;
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
    accessorKey: "orderItems",
    header: "Items",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.orderItems.reduce(
            (acc, current) => current.quantity + acc,
            0
          )}
        </span>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
