"use client";

import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { DataTablePagination } from "./advanced-data-table-pagination";
import { DataTableToolbar } from "./advanced-data-table-toolbar";

import { uniqueId } from "lodash";
import { Trash, type LucideIcon } from "lucide-react";
import {
  PathValue,
  useFieldArray,
  type ArrayPath,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
import { Button } from "~/components/ui/button";
import { FormControl, FormField, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import ImageUpload from "~/services/image-upload/components/image-upload";
import { AdvancedNumericInput } from "../inputs/advanced-numeric-input";

export type FilterOption = {
  column: string;
  title: string;
  filters: {
    value: string;
    label: string;
    icon: LucideIcon;
  }[];
};

export type MassSelectOption = {
  label: string;
  icon?: LucideIcon;
  onClick: (data: unknown) => void;
};

interface DataTableProps<
  TData,
  TValue,
  FData extends FieldValues,
  SData extends { id: string; [key: string]: string | number | Date }
> {
  columns: ColumnDef<TData, TValue>[];
  handleOnMediaDelete?: (url: string) => void;
  data: TData[];
  searchKey: string;
  filters?: FilterOption[];
  form: UseFormReturn<FData>;
  formKey: ArrayPath<FData>;
  ignoreColumns?: string[];
  renderSelect?: SData[];
}

export function AdvancedDataTableForm<
  TData,
  TValue,
  FData extends FieldValues,
  SData extends { id: string; [key: string]: string | number | Date }
>({
  columns,
  data,
  handleOnMediaDelete,
  searchKey,
  filters,
  form,
  formKey,
  ignoreColumns,
  renderSelect,
}: DataTableProps<TData, TValue, FData, SData>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const { remove } = useFieldArray({
    control: form.control,
    name: formKey,
  });

  return (
    <div className="w-full space-y-4">
      <DataTableToolbar table={table} searchKey={searchKey} filters={filters} />
      <div className="rounded-md border bg-white">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={`${header.id}-${uniqueId()}`}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, idx) => (
                  <TableRow
                    key={row.id + "row"}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={`${cell.id}-${uniqueId()}`}>
                        {ignoreColumns?.includes(cell.column.id) ? (
                          <>
                            {cell.column.id === "imageUrl" && (
                              <>
                                <FormField
                                  control={form.control}
                                  name={
                                    `${formKey}.${idx}.${cell.column.id}` as Path<FData>
                                  }
                                  render={({ field }) => (
                                    <>
                                      <FormControl>
                                        <ImageUpload
                                          isSimplifiedBtn={true}
                                          selectPreviousImages={true}
                                          folder="products"
                                          maxFiles={1}
                                          value={
                                            field.value ? [field.value] : []
                                          }
                                          onBulkChange={(urls) => {
                                            form.setValue(
                                              "images" as Path<FData>,
                                              [
                                                ...new Set([
                                                  ...form.watch(
                                                    "images" as Path<FData>
                                                  ),
                                                  urls?.[0],
                                                ]),
                                              ] as PathValue<FData, Path<FData>>
                                            );

                                            return field.onChange(urls[0]);
                                          }}
                                          onChange={(url) => {
                                            form.setValue(
                                              "images" as Path<FData>,
                                              [
                                                ...new Set([
                                                  ...form.watch(
                                                    "images" as Path<FData>
                                                  ),
                                                  url,
                                                ]),
                                              ] as PathValue<FData, Path<FData>>
                                            );

                                            return field.onChange(url);
                                          }}
                                          onRemove={() => field.onChange("")}
                                          onMediaDelete={handleOnMediaDelete}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </>
                                  )}
                                />
                              </>
                            )}

                            {cell.column.id === "actions" && (
                              <>
                                <Button
                                  onClick={() => {
                                    remove(idx);
                                    // setTempData(form.watch("variants"));
                                  }}
                                  variant="destructive"
                                  type="button"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </>
                            )}

                            {cell.column.id === "values" && (
                              <div className="flex gap-2 ">
                                <FormField
                                  control={form.control}
                                  name={
                                    `${formKey}.${idx}.${cell.column.id}` as Path<FData>
                                  }
                                  render={({ field }) => (
                                    <>
                                      {renderSelect?.map((selectItem, idx) => {
                                        const currentValues = (
                                          cell.getValue() as string
                                        ).split(`, `);

                                        return (
                                          <Select
                                            key={`${
                                              selectItem.id
                                            }-${uniqueId()}`}
                                            defaultValue={
                                              currentValues?.[idx] ?? ""
                                            }
                                            onValueChange={(value) => {
                                              const newValues =
                                                field.value.split(", ");
                                              newValues[idx] = value;
                                              field.onChange(
                                                newValues.join(", ")
                                              );
                                            }}
                                          >
                                            <SelectTrigger
                                              className="w-24"
                                              defaultValue={
                                                currentValues?.[idx] ?? ""
                                              }
                                            >
                                              <SelectValue
                                                placeholder={`Select a ${
                                                  selectItem.name as string
                                                }`}
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectGroup>
                                                <SelectLabel>
                                                  {selectItem.name as string}
                                                </SelectLabel>
                                                {(selectItem?.values as string)
                                                  ?.split(";")
                                                  .map((value) => (
                                                    <SelectItem
                                                      value={value}
                                                      key={`${uniqueId()}-${value}`}
                                                    >
                                                      {value}
                                                    </SelectItem>
                                                  ))}
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>
                                        );
                                      })}
                                    </>
                                  )}
                                />
                              </div>
                            )}
                            {/* 
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )} */}
                          </>
                        ) : (
                          <>
                            <FormField
                              control={form.control}
                              name={
                                `${formKey}.${idx}.${cell.column.id}` as Path<FData>
                              }
                              render={({ field }) => (
                                <>
                                  <FormControl>
                                    <>
                                      {cell.column.id === "price" && (
                                        <AdvancedNumericInput
                                          field={field}
                                          prependSpan="$"
                                        />
                                      )}
                                      {cell.column.id !== "price" && (
                                        <Input
                                          {...field}
                                          type={
                                            cell.column.id === "sku"
                                              ? "text"
                                              : "number"
                                          }
                                        />
                                      )}
                                    </>
                                  </FormControl>{" "}
                                  <FormMessage />
                                </>
                              )}
                            />
                          </>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
