import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentStatus } from "@prisma/client";

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
import type { Order, OrderFormValues } from "../../types";
import { CustomerDetailsSection } from "./customer-details.form-section";
import { OrderItemsSection } from "./order-items.form-section";

interface OrderFormProps {
  initialData: Order | null;
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
      paymentStatus: initialData?.paymentStatus ?? "PENDING",
      fulfillmentStatus: initialData?.fulfillmentStatus ?? "PENDING",
      phone: phoneFormatStringToNumber(initialData?.phone ?? ""),
      street: initialData?.shippingAddress?.street ?? "",
      additional: initialData?.shippingAddress?.additional ?? "",
      city: initialData?.shippingAddress?.city ?? "",
      state: initialData?.shippingAddress?.state ?? "",
      zip: initialData?.shippingAddress?.postal_code ?? "",
      country: initialData?.shippingAddress?.country ?? "US",
      name: initialData?.shippingAddress?.name ?? "",
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
        paymentStatus: data.paymentStatus,
        email: data.email,
        fulfillmentStatus: data.fulfillmentStatus,
        phone: data.phone,
        shippingAddress: {
          name: data.name,
          street: data.street,
          additional: data.additional,
          city: data.city,
          state: data.state,
          postal_code: data.zip,
          country: data.country,
        },
        billingAddress: {
          name: data.name,
          street: data.street,
          additional: data.additional,
          city: data.city,
          state: data.state,
          postal_code: data.zip,
          country: data.country,
        },
        orderItems: data.orderItems,
      });
    } else {
      createOrder.mutate({
        storeId,
        email: data.email,
        paymentStatus: data.paymentStatus,
        fulfillmentStatus: data.fulfillmentStatus,
        phone: data.phone,
        shippingAddress: {
          name: data.name,
          street: data.street,
          additional: data.additional,
          city: data.city,
          state: data.state,
          postal_code: data.zip,
          country: data.country,
        },
        billingAddress: {
          name: data.name,
          street: data.street,
          additional: data.additional,
          city: data.city,
          state: data.state,
          postal_code: data.zip,
          country: data.country,
        },
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
          <AdminFormBody className="mx-auto max-w-7xl space-y-0 lg:flex-col xl:flex-row">
            <FormField
              control={form.control}
              name="paymentStatus"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      disabled={loading}
                      placeholder="Is Order Paid"
                      checked={field.value === PaymentStatus.PAID}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? "PAID" : "PENDING")
                      }
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
