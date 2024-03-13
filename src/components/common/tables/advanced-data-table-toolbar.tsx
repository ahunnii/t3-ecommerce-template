"use client";

import type { Table } from "@tanstack/react-table";
import { XCircleIcon } from "lucide-react";

import { Fragment } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { FilterOption } from "./advanced-data-table";
import { DataTableFacetedFilter } from "./advanced-data-table-faceted-filter";
import { DataTableViewOptions } from "./advanced-data-table-view-options";

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
            placeholder={`Filter by ${searchKey}...`}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[350px] lg:w-[450px]"
          />

          {filters?.map((filter, idx) => (
            <Fragment key={idx}>
              {table.getColumn(filter.column) && (
                <DataTableFacetedFilter
                  column={table.getColumn(filter.column)}
                  title={filter.title}
                  options={filter.filters}
                />
              )}
            </Fragment>
          ))}

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
    </>
  );
}
