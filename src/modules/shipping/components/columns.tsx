import type { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import Link from "next/link";
import type Shippo from "shippo";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";

export type ShippingColumn = Shippo.Transaction;

export const shippingClient: ColumnDef<ShippingColumn>[] = [
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
    accessorKey: "label_url",
    header: "Label",
    cell: ({ row }) => {
      return (
        <Link href={row.original.label_url} target="_blank">
          <Button variant={"link"} className="mx-0 truncate px-0">
            {row.original.object_id}
          </Button>
        </Link>
      );
    },
  },

  {
    accessorKey: "tracking_number",
    header: "Tracking Number",
    cell: ({ row }) => {
      return (
        <Link href={row.original.tracking_url_provider}>
          {" "}
          <Button
            variant={"link"}
            className="mx-0 truncate px-0"
          >{`${row.original.tracking_number}`}</Button>
        </Link>
      );
    },
  },
  {
    accessorKey: "tracking_status",
    header: "Tracking Status",
    // filterFn: (row, id, value) => {
    //   return value.includes(row.getValue(id));
    // },
    cell: ({ row }) => {
      return <p className="">{`${row.original.tracking_status.toString()}`}</p>;
    },
  },

  {
    accessorKey: "object_created",
    header: "Created at",
    cell: ({ row }) => {
      return (
        format(new Date(row.original.object_created), "MMMM do, yyyy") ?? ""
      );
    },
  },
];
