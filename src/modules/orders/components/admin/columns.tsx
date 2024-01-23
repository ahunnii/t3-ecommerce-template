import type { ColumnDef } from "@tanstack/react-table";

import { cn } from "~/utils/styles";
import { CellAction } from "./cell-action";

export type OrderColumn = {
  id: string;
  phone: string;
  name: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
  labelCreated: boolean;
  isShipped: boolean;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "id",
    header: "Order Id",
    cell: ({ row }) => {
      return <p className="max-w-[6em] truncate">{row.original.id}</p>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date added",
    cell: ({ row }) => {
      return <p className="">{row.original.createdAt}</p>;
    },
  },

  {
    accessorKey: "name",
    header: "Customer Name",
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
    accessorKey: "totalPrice",
    header: "Total price",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
