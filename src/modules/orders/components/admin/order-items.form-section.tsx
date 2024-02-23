import { type FC } from "react";

import { Controller, useFieldArray, type UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { CheckIcon, ChevronsUpDown, Trash } from "lucide-react";
import { FormattedNumericInput } from "~/components/common/inputs/formatted-numeric-input";
import { Button } from "~/components/ui/button";
import { states } from "~/utils/shipping";
import { cn } from "~/utils/styles";
import type { OrderFormValues, OrderItem } from "../../types";

type Props = {
  form: UseFormReturn<OrderFormValues>;
  loading: boolean;
};

export const OrderItemsSection: FC<Props> = ({ form, loading }) => {
  const { fields, remove } = useFieldArray({
    control: form.control,
    name: "orderItems",
  });

  return (
    <div className="w-full space-y-8 rounded-md border border-border bg-background/50 p-4">
      <div className="w-full">
        <FormField
          control={form.control}
          name="orderItems"
          render={({ field }) => (
            <>
              <FormLabel>Order Items</FormLabel>{" "}
              <FormDescription>
                Edit the order items of this order. Please note that you may
                need to collect additional funds from the customer or refund
                them.
              </FormDescription>
              {field.value.length > 0 && (
                <div className="my-5 max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="">Name</TableHead>
                        <TableHead className="">Variant</TableHead>
                        <TableHead className="">Quantity</TableHead>

                        <TableHead className="text-right">
                          Delete Item
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(fields as OrderItem[]).map((item: OrderItem, index) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Label>{item.product.name} </Label>
                          </TableCell>
                          <TableCell>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  onValueChange={(e) => field.onChange(e)}
                                  defaultValue={item?.variantId ?? undefined}
                                  disabled={loading}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="No variant selected" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {item.product.variants.map(
                                      (variant, idx) => (
                                        <SelectItem
                                          key={idx}
                                          value={variant.id}
                                          className="flex"
                                        >
                                          {variant.values}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              )}
                              name={`orderItems.${index}.variantId`}
                              control={form.control}
                            />
                          </TableCell>
                          <TableCell>
                            <Controller
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  type="number"
                                  disabled={loading}
                                />
                              )}
                              name={`orderItems.${index}.quantity`}
                              control={form.control}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() => remove(index)}
                              variant="destructive"
                              disabled={loading}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
};
