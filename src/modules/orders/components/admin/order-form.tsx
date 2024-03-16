import { zodResolver } from "@hookform/resolvers/zod";
import { type Prisma } from "@prisma/client";

import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { api } from "~/utils/api";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";

import { AlertModal } from "~/modules/admin/components/modals/alert-modal";

import { toastService } from "~/services/toast";
import { phoneFormatStringToNumber } from "~/utils/format-utils.wip";

import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";
import { orderFormSchema } from "../../schemas";
import type { OrderFormValues } from "../../types";
import { CustomerDetailsSection } from "./customer-details.form-section";
import { OrderItemsSection } from "./order-items.form-section";

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

  const title = initialData ? "Edit order" : "Create order";
  const description = initialData ? "Edit a order." : "Add a new order";
  const toastMessage = initialData ? "Order updated." : "Order created.";

  const action = initialData
    ? params.query.mode === "view"
      ? "Close"
      : "Save changes"
    : "Create";

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      isPaid: initialData?.isPaid ?? false,
      phone: phoneFormatStringToNumber(initialData?.phone ?? ""),
      street: initialData?.address?.street ?? "",
      additional: initialData?.address?.additional ?? "",
      city: initialData?.address?.city ?? "",
      state: initialData?.address?.state ?? "",
      zip: initialData?.address?.postal_code ?? "",
      country: initialData?.address?.country ?? "US",
      name: initialData?.name ?? "",
      orderItems: initialData?.orderItems ?? [],
      email: initialData?.email ?? "",
    },
  });

  const updateOrder = api.orders.updateOrder.useMutation({
    onSuccess: () => {
      toastService.success(toastMessage);
      router.push(`/admin/${params.query.storeId as string}/orders`);
    },
    onError: (error: unknown) =>
      toastService.error(
        "Something went wrong with updating your order. Please try again later.",
        error
      ),
    onSettled: () => void utils.orders.getOrder.invalidate(),
  });

  const createOrder = api.orders.createOrder.useMutation({
    onSuccess: () => {
      toastService.success(toastMessage);
      router.push(`/admin/${params.query.storeId as string}/orders`);
    },
    onError: (error: unknown) =>
      toastService.error(
        "Something went wrong with creating your new order. Please try again later.",
        error
      ),
    onSettled: () => void utils.orders.getOrder.invalidate(),
  });

  const deleteOrder = api.orders.deleteOrder.useMutation({
    onSuccess: () => {
      toastService.success("Order was successfully deleted.");
      router.push(`/admin/${params.query.storeId as string}/orders`);
    },
    onError: (error: unknown) =>
      toastService.error(
        "Something went wrong with deleting your new order. Please try again later.",
        error
      ),
    onSettled: () => {
      setOpen(false);
      void utils.orders.getOrder.invalidate();
    },
  });

  const onSubmit = (data: OrderFormValues) => {
    if (initialData) {
      updateOrder.mutate({
        storeId,
        orderId,
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
        orderItems: data.orderItems,
        name: data.name,
      });
    } else {
      createOrder.mutate({
        storeId,
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
        orderItems: data.orderItems,
      });
    }
  };

  const onDelete = () => deleteOrder.mutate({ orderId });

  const loading =
    updateOrder.isLoading || createOrder.isLoading || deleteOrder.isLoading;
  return (
    <>
      <Form {...form}>
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
          <AdminFormHeader
            title={title}
            description={description}
            contentName="Order"
            link={`/admin/${storeId}/orders/${orderId ?? ""}`}
          >
            {initialData && (
              <AlertModal
                isOpen={open}
                setIsOpen={setOpen}
                onConfirm={onDelete}
                loading={loading}
                asChild={true}
              />
            )}

            <Button disabled={loading} className="ml-auto" type="submit">
              {action}
            </Button>
          </AdminFormHeader>
          <AdminFormBody className="flex-col">
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
            <CustomerDetailsSection form={form} loading={loading} />
            <OrderItemsSection form={form} loading={loading} />
          </AdminFormBody>
        </form>
      </Form>
    </>
  );
};
