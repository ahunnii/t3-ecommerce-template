import { zodResolver } from "@hookform/resolvers/zod";

import { useState, type FC } from "react";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { Check, Search, X } from "lucide-react";
import Image from "next/image";
import { EditSection } from "~/components/common/sections/edit-section.admin";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { CommandAdvancedDialog } from "~/components/ui/command-advanced";
import type { OrderItem } from "~/modules/orders/types";
import { cn } from "~/utils/styles";
import { useShippingModal } from "../hooks/use-shipping-modal";
import { itemsFormSchema, packageFormSchema } from "../schema";
import type { ItemFormValues, PackageFormValues } from "../types";

type Props = {
  initialData: ItemFormValues | null;
  successCallback: (data: ItemFormValues) => void;
  errorCallback: (data?: unknown) => void;
  orderItems: OrderItem[];
};
const ItemForm: FC<Props> = ({ initialData, orderItems, successCallback }) => {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemsFormSchema),
    defaultValues: {
      orderItems: initialData?.orderItems ?? [],
    },
  });

  const onSubmit = (data: ItemFormValues) => successCallback(data);
  const [itemsOpen, setItemsOpen] = useState(false);

  const shippingModal = useShippingModal();

  return (
    <Form {...form}>
      <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
        <EditSection
          title="Order Items"
          description="Add what items are included in the shipment. Note you can make multiple shipments for the same order."
          bodyClassName="flex w-full flex-col space-y-2"
        >
          <FormField
            control={form.control}
            name="orderItems"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <>
                    <Button
                      onClick={() => setItemsOpen(true)}
                      disabled={orderItems.length === 0}
                      type="button"
                      className="flex w-full items-center justify-between gap-2  "
                      variant="outline"
                    >
                      <span className="flex items-center gap-2">
                        <Search className="text-grey-50 size-5 " />{" "}
                        {orderItems.length > 0
                          ? "Select items to include in shipment..."
                          : "All required order items are already part of a shipment"}
                      </span>
                    </Button>
                    <CommandAdvancedDialog
                      open={itemsOpen}
                      onOpenChange={setItemsOpen}
                    >
                      <CommandInput placeholder="Search by product name..." />
                      <CommandList className="mb-12 ">
                        <CommandEmpty>No results found.</CommandEmpty>

                        <CommandGroup heading="Products" className="">
                          {orderItems?.map((orderItem) => (
                            <CommandItem
                              key={orderItem.id}
                              className="flex gap-2 font-light "
                              onSelect={() => {
                                field.onChange(
                                  field.value.some(
                                    (prod) => prod.id === orderItem.id
                                  )
                                    ? field.value.filter(
                                        (item) => item.id !== orderItem.id
                                      )
                                    : [...field.value, orderItem]
                                );
                              }}
                            >
                              <div className="mr-2 flex aspect-square items-center justify-center rounded-md border border-border">
                                <Check
                                  className={cn(
                                    " h-4 w-4",
                                    field.value.some(
                                      (prod) => prod.id === orderItem.id
                                    )
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </div>
                              <div className="relative aspect-square h-6 rounded-lg ">
                                <Image
                                  src={
                                    orderItem?.product?.featuredImage ??
                                    "/placeholder-image.webp"
                                  }
                                  fill
                                  sizes={"100vw"}
                                  className="rounded-lg "
                                  alt=""
                                />
                              </div>
                              {orderItem.product?.name}
                              {orderItem?.variant
                                ? ` - ${orderItem.variant?.values}`
                                : ""}
                              <span className="ml-2 font-semibold">
                                {" "}
                                QTY:{orderItem?.quantity}
                              </span>
                              <span className="sr-only">{orderItem.id}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>

                      <div className="absolute bottom-0  flex h-12 w-full items-center justify-end border-t border-t-zinc-200 px-2 py-4">
                        <Button
                          type="button"
                          onClick={() => setItemsOpen(false)}
                          size={"sm"}
                        >
                          Done
                        </Button>
                      </div>
                    </CommandAdvancedDialog>
                    <div className="flex w-full flex-col space-y-2 ">
                      {field?.value?.map((orderItem) => {
                        const foundOrderItem = orderItems.find(
                          (item) => item.id === orderItem.id
                        );

                        if (!foundOrderItem) {
                          return null;
                        }
                        return (
                          <section
                            className="flex w-full items-center border  border-border px-4  py-2 odd:bg-zinc-100"
                            key={`selected_orderItem_${orderItem.id}`}
                          >
                            <div className="relative my-auto aspect-square h-6 rounded-lg">
                              <Image
                                src={
                                  foundOrderItem?.product?.featuredImage ??
                                  "/placeholder-image.webp"
                                }
                                fill
                                sizes={"100vw"}
                                className="rounded-lg "
                                alt=""
                              />
                            </div>
                            {foundOrderItem?.product?.name}{" "}
                            {foundOrderItem?.variant
                              ? ` - ${foundOrderItem.variant?.values}`
                              : ""}{" "}
                            <span className="ml-2 font-semibold">
                              {" "}
                              QTY:{foundOrderItem?.quantity}
                            </span>
                            <div
                              className="group ml-auto flex aspect-square cursor-pointer items-center justify-center rounded-md "
                              onClick={() => {
                                field.onChange(
                                  field.value.some(
                                    (prod) => prod.id === orderItem.id
                                  )
                                    ? field.value.filter(
                                        (item) => item.id !== orderItem.id
                                      )
                                    : [...field.value, orderItem]
                                );
                              }}
                            >
                              <X
                                className={cn(
                                  " h-4 w-4 group-hover:text-zinc-600",
                                  field.value.some(
                                    (prod) => prod.id === orderItem.id
                                  )
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </div>
                          </section>
                        );
                      })}
                    </div>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {orderItems.length !== 0 && (
            <Button
              type="button"
              onClick={() =>
                form.setValue(
                  "orderItems",
                  orderItems.map((item) => ({ id: item.id }))
                )
              }
            >
              Or select all items from the order...
            </Button>
          )}
        </EditSection>

        <div className="flex w-full items-center justify-end space-x-2 pt-6">
          <Button variant={"outline"} onClick={() => shippingModal.onClose()}>
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  );
};

export default ItemForm;
