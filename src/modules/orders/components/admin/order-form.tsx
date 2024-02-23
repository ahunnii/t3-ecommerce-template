import { zodResolver } from "@hookform/resolvers/zod";
import {
  Prisma,
  type Order,
  type OrderItem,
  type Product,
  type Variation,
} from "@prisma/client";
import { Trash } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { api } from "~/utils/api";

import { AlertModal } from "~/components/admin/modals/alert-modal";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Heading } from "~/components/ui/heading";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

import { Label } from "~/components/ui/label";

import { BackToButton } from "~/components/common/buttons/back-to-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { CheckIcon, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { states } from "~/utils/shipping";
import { cn } from "~/utils/styles";

const formSchema = z.object({
  isPaid: z.boolean(),
  phone: z.string().min(9).max(12),
  street: z.string(),
  additional: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip: z.string().regex(/^\d{5}(?:[-\s]\d{4})?$/),
  country: z.string(),
  name: z.string().min(2),
  orderItems: z.array(
    z.object({
      // productId: z.string(),
      variantId: z.union([z.string(), z.null()]),
      // variant: z.any(),
      quantity: z.coerce.number().min(0),
      // product: z.object({
      //   name: z.string(),
      //   variants: z.array(
      //     z.object({
      //       id: z.string(),
      //       names: z.string().min(1),
      //       values: z.string().min(1),
      //       price: z.instanceof(Prisma.Decimal),
      //       quantity: z.number().min(1),
      //     })
      //   ),
      // }),
    })
  ),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ExtendedProduct extends Product {
  variants: Variation[];
}

interface ExtendedOrderItem extends OrderItem {
  product: ExtendedProduct;
  variant: Variation | null;
}

interface FetchedOrder extends Order {
  orderItems: ExtendedOrderItem[];
}
interface OrderFormProps {
  initialData: Prisma.OrderGetPayload<{
    include: {
      address: true;
      orderItems: {
        include: {
          variant: true;
          product: {
            include: {
              variants: true;
            };
          };
        };
      };
    };
  }>;
}

export const OrderForm: React.FC<OrderFormProps> = ({ initialData }) => {
  const params = useRouter();
  const router = useNavigationRouter();
  const utils = api.useContext();

  const { storeId, orderId } = params.query as {
    storeId: string;
    orderId: string;
  };
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const title = initialData
    ? params.query.mode === "view"
      ? "View order"
      : "Edit order"
    : "Create order";
  const description = initialData
    ? params.query.mode === "view"
      ? "View a order."
      : "Edit a order."
    : "Add a new order";
  const toastMessage = initialData ? "Order updated." : "Order created.";

  const action = initialData
    ? params.query.mode === "view"
      ? "Close"
      : "Save changes"
    : "Create";
  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPaid: false,
      phone: initialData?.phone ?? "",
      street: initialData?.address?.street ?? "",
      additional: initialData?.address?.additional ?? "",
      city: initialData?.address?.city ?? "",
      state: initialData?.address?.state ?? "",
      zip: initialData?.address?.postal_code ?? "",
      country: initialData?.address?.country ?? "US",
      name: initialData?.name ?? "",
      orderItems: initialData?.orderItems ?? [],
    },
  });

  console.log(initialData);
  const { mutate: updateOrder } = api.orders.updateOrder.useMutation({
    onSuccess: () => {
      router.push(`/admin/${params.query.storeId as string}/orders`);
      toast.success(toastMessage);
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error(error);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
      void utils.orders.getOrder.invalidate();
    },
  });

  const { mutate: createOrder } = api.orders.createOrder.useMutation({
    onSuccess: () => {
      router.push(`/admin/${params.query.storeId as string}/orders`);
      toast.success(toastMessage);
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error(error);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
      void utils.orders.getOrder.invalidate();
    },
  });

  const { mutate: deleteOrder } = api.orders.deleteOrder.useMutation({
    onSuccess: () => {
      router.push(`/admin/${params.query.storeId as string}/orders`);
      toast.success("Color deleted.");
    },
    onError: (error) => {
      toast.error(
        "Make sure you removed all order items using this order first."
      );
      console.error(error);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
      setOpen(false);
      void utils.orders.getOrder.invalidate();
    },
  });

  const onSubmit = (data: ColorFormValues) => {
    if (params.query.mode === "view") {
      router.push(`/admin/${params.query.storeId as string}/orders`);
      return;
    }
    if (initialData) {
      updateOrder({
        storeId: params?.query?.storeId as string,
        orderId: params?.query?.orderId as string,
        isPaid: data.isPaid,
        phone: data.phone,
        address: {
          street: data.street,
          additional: data.additional,
          city: data.city,
          state: data.state,
          postalCode: data.zip,
          country: data.country,
        },
        name: data.name,
      });
    } else {
      createOrder({
        storeId: params?.query?.storeId as string,
        isPaid: data.isPaid,
        phone: data.phone,
        address: {
          street: data.street,
          additional: data.additional,
          city: data.city,
          state: data.state,
          postalCode: data.zip,
          country: data.country,
        },
        name: data.name,
      });
    }
  };

  const onDelete = () => {
    deleteOrder({
      storeId: params?.query?.storeId as string,
      orderId: params?.query?.orderId as string,
    });
  };

  const { fields, remove } = useFieldArray({
    control: form.control,
    name: "orderItems",
  });

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <BackToButton
        link={`/admin/${storeId}/orders/${orderId ?? ""}`}
        title="Back to Order"
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      {params?.query?.mode === "view" ? (
        <>
          <h2>Customer Info</h2>

          {/* {initialData?.} */}
        </>
      ) : (
        <Form {...form}>
          <form
            onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
            className="w-full space-y-8"
          >
            <div className="w-full">
              <FormLabel>Customer Info</FormLabel>{" "}
              <FormDescription>
                Edit the customer&apos;s shipping information.
              </FormDescription>
              <div className="my-5 gap-8 md:grid md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Customer Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Phone Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="isPaid"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          disabled={loading}
                          placeholder="Is Order Paid"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Order Paid?</FormLabel>
                        <FormDescription>
                          This marks that the customer successfully paid for the
                          order and awaiting shipment.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />{" "}
              </div>
            </div>{" "}
            <div className="w-full space-y-8 rounded-md border border-border bg-background/50 p-4">
              <div>
                <FormLabel>Address</FormLabel>{" "}
              </div>
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Street address</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 1234 Main St." {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="additional"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        Apt / Suite / Other{" "}
                        <span className="text-xs text-gray-500">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 1234 Main St." {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
              </div>
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Boulder City"
                          {...field}
                          className="col-span-1"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>State</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                " w-full  justify-between ",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? states.find(
                                    (state) => state.value === field.value
                                  )?.label
                                : "Select state"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="max-h-96 w-[200px] overflow-y-scroll p-0">
                          <Command>
                            <CommandInput placeholder="Search state..." />
                            <CommandEmpty>No state found.</CommandEmpty>
                            <CommandGroup>
                              {states.map((state) => (
                                <CommandItem
                                  value={state.label ?? undefined}
                                  key={state.value}
                                  onSelect={() => {
                                    form.setValue("state", state.value);
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      state.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {state.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 44444"
                          {...field}
                          className="col-span-1"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
              </div>
            </div>
            <div className="w-full">
              <FormField
                control={form.control}
                name="orderItems"
                render={({ field }) => (
                  <>
                    <FormLabel>Order Items</FormLabel>{" "}
                    <FormDescription>
                      Edit the order items of this order. Please note that you
                      may need to collect additional funds from the customer or
                      refund them.
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
                            {fields.map((item, index) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <Label>
                                    {(item as ExtendedOrderItem).product.name}{" "}
                                  </Label>
                                </TableCell>
                                <TableCell>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        onValueChange={(e) => field.onChange(e)}
                                        defaultValue={
                                          (item as ExtendedOrderItem)
                                            ?.variantId ?? undefined
                                        }
                                      >
                                        <SelectTrigger className="w-[180px]">
                                          <SelectValue placeholder="No variant selected" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {(
                                            item as ExtendedOrderItem
                                          ).product.variants.map(
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
                                      <Input {...field} type="number" />
                                    )}
                                    name={`orderItems.${index}.quantity`}
                                    control={form.control}
                                  />
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    onClick={() => remove(index)}
                                    variant="destructive"
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
            <Button disabled={loading} className="ml-auto" type="submit">
              {action}
            </Button>{" "}
          </form>
        </Form>
      )}
    </>
  );
};
