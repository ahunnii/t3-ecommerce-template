import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

import type { Order, OrderItem } from "@prisma/client";

import { api } from "~/utils/api";

import { AlertModal } from "~/components/admin/modals/alert-modal";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Heading } from "~/components/ui/heading";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { ItemDetailsCardGrid } from "./item-details-card";

const formSchema = z.object({
  isPaid: z.boolean(),
  phone: z.string().min(9).max(12),
  address: z.string().min(2),
  orderItem: z.array(
    z.object({
      productId: z.string(),
    })
  ),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface FetchedOrder extends Order {
  orderItems: OrderItem[];
}
interface OrderFormProps {
  initialData: FetchedOrder | null;
}

export const OrderForm: React.FC<OrderFormProps> = ({ initialData }) => {
  const params = useRouter();
  const router = useNavigationRouter();
  const utils = api.useContext();

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const title = initialData ? "Edit order" : "Create order";
  const description = initialData ? "Edit a order." : "Add a new order";
  const toastMessage = initialData ? "Order updated." : "Order created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ?? {
      isPaid: false,
      phone: "",
      address: "",
    },
  });

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
    if (initialData) {
      updateOrder({
        storeId: params?.query?.storeId as string,
        orderId: params?.query?.orderId as string,
        isPaid: data.isPaid,
        phone: data.phone,
        address: data.address,
      });
    } else {
      createOrder({
        storeId: params?.query?.storeId as string,
        isPaid: data.isPaid,
        phone: data.phone,
        address: data.address,
      });
    }
  };

  const onDelete = () => {
    deleteOrder({
      storeId: params?.query?.storeId as string,
      orderId: params?.query?.orderId as string,
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
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
      {params.query.mode === "view" &&
        typeof initialData?.orderItems === "object" && (
          <ItemDetailsCardGrid items={initialData?.orderItems} />
        )}

      <Form {...form}>
        <form
          onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="isPaid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paid</FormLabel>
                  <FormControl>
                    <Checkbox
                      disabled={loading}
                      placeholder="Is Order Paid"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
