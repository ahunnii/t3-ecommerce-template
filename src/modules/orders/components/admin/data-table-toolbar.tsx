"use client";

import type { Table } from "@tanstack/react-table";
import { Delete, XCircleIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

// import { priorities, statuses } from "../data/data";
import { api } from "~/utils/api";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import type { FilterOption } from "./orders-table-data";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters?: FilterOption[];
  searchKey: string;
}

export function DataTableToolbar<TData>({
  table,
  filters,
  searchKey,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter tasks..."
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />

          {filters?.map((filter) => (
            <>
              {table.getColumn(filter.column) && (
                <DataTableFacetedFilter
                  column={table.getColumn(filter.column)}
                  title={filter.title}
                  options={filter.filters}
                />
              )}
            </>
          ))}

          {/* {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )} */}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <XCircleIcon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>
      {/* {table.getSelectedRowModel().rows.length > 0 && (
        <div className="flex flex-1 items-center space-x-2">
          <Button>
            Delete <Delete className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => table.resetRowSelection()}
            className="h-8 px-2 lg:px-3"
          >
            Cancel
            <XCircleIcon className="ml-2 h-4 w-4" />
          </Button>
        </div> */}
      {/* )} */}
    </>
  );
}
