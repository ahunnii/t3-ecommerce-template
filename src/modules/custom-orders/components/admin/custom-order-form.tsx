import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { CustomOrderStatus, CustomOrderType } from "@prisma/client";

import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import * as Form from "~/components/ui/form";
import { AlertModal } from "~/modules/admin/components/modals/alert-modal";

import { Input } from "~/components/ui/input";

import ImageUpload from "~/services/image-upload/components/image-upload";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";

import { Mail } from "lucide-react";
import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";
import { AdvancedNumericInput } from "~/components/common/inputs/advanced-numeric-input";
import { EditSection } from "~/components/common/sections/edit-section.admin";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";
import { customOrderAdminFormSchema } from "../../schema";
import { type CustomOrder, type CustomOrderAdminFormValues } from "../../types";

type Props = {
  initialData: CustomOrder | null;
};

export const CustomOrderForm: React.FC<Props> = ({ initialData }) => {
  const params = useRouter();
  const router = useNavigationRouter();
  const apiContext = api.useContext();

  const { storeId, customOrderId } = params.query as {
    storeId: string;
    customOrderId: string;
  };

  const [open, setOpen] = useState(false);
  const [sendToClient, setSendToClient] = useState(false);

  const title = initialData ? "Edit Custom Order" : "Create Custom Order";
  const description = initialData
    ? "Edit a Custom Order."
    : "Add a new Custom Order";
  const toastMessage = initialData
    ? "Custom Order updated."
    : "Custom Order created.";

  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CustomOrderAdminFormValues>({
    resolver: zodResolver(customOrderAdminFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      invoiceSent: initialData?.invoiceSent ?? false,
      description: initialData?.description ?? "N/A",
      notes: initialData?.notes ?? "",
      productDescription: initialData?.product?.description ?? "",

      images: initialData?.images ?? [],
      status: initialData?.status ?? "ACCEPTED",
      type: initialData?.type ?? undefined,
      price: initialData?.price ?? 0,
    },
  });

  const defaultSuccess = () => {
    router.push(`/admin/${storeId}/custom-orders`);
    toastService.success(toastMessage);
  };

  const defaultSettled = () => {
    void apiContext.customOrder.invalidate();
    void apiContext.products.invalidate();
  };
  const updateCustomOrder = api.customOrder.updateCustomRequest.useMutation({
    onSuccess: (data) => {
      defaultSuccess();
      if (data?.id && data?.status === "ACCEPTED" && !data?.invoiceSent)
        emailCustomerInvoice.mutate({
          customOrderId: data.id,
          setInvoiceSent: true,
        });
    },
    onError: (error: unknown) =>
      toastService.error(
        "Something went wrong updating your custom order.",
        error
      ),
    onSettled: defaultSettled,
  });

  const emailCustomerInvoice = api.customOrder.emailCustomerInvoice.useMutation(
    {
      onSuccess: () => {
        toastService.success("Customer invoice was successfully sent");
        setSendToClient(false);
      },
      onError: (error: unknown) => {
        toastService.error(
          "There was an error sending the customer invoice. Please try again later.",
          error
        );
      },
    }
  );

  const createCustomOrder =
    api.customOrder.createAdminCustomRequest.useMutation({
      onSuccess: (data) => {
        defaultSuccess();
        if (sendToClient && data?.id && data?.status === "ACCEPTED")
          emailCustomerInvoice.mutate({ customOrderId: data.id });
      },
      onError: (error: unknown) =>
        toastService.error(
          "Something went wrong creating your custom order.",
          error
        ),
      onSettled: defaultSettled,
    });

  const deleteCustomOrder = api.customOrder.deleteCustomRequest.useMutation({
    onSuccess: () => {
      toastService.success("Custom order was successfully deleted."),
        router.push(`/admin/${storeId}/custom-orders`);
    },

    onError: (error: unknown) =>
      toastService.error(
        "There was an issue with deleting your custom order. Please try again.",
        error
      ),

    onSettled: () => {
      setOpen(false);
      defaultSettled();
    },
  });

  const onSubmit = (data: CustomOrderAdminFormValues) => {
    if (initialData) {
      updateCustomOrder.mutate({
        customOrderId,
        ...data,
      });
    } else {
      createCustomOrder.mutate({
        storeId,
        ...data,
      });
    }
  };
  const onDelete = () => deleteCustomOrder.mutate({ customOrderId });

  const loading =
    updateCustomOrder.isLoading ||
    createCustomOrder.isLoading ||
    deleteCustomOrder.isLoading;

  return (
    <>
      <Form.Form {...form}>
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
          <AdminFormHeader
            title={title}
            description={description}
            contentName="Custom Orders"
            link={`/admin/${storeId}/custom-orders`}
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

            <div className="flex w-full space-x-2">
              {initialData && form.watch("invoiceSent") && (
                <Button
                  disabled={loading}
                  className="ml-4 flex gap-2"
                  variant="outline"
                  type="submit"
                  onClick={() => {
                    emailCustomerInvoice.mutate({
                      customOrderId: customOrderId,
                    });
                  }}
                >
                  <Mail />
                  Resend Invoice
                </Button>
              )}
              <Button
                disabled={loading}
                className="ml-auto"
                type="submit"
                variant={action === "Create" ? "secondary" : "default"}
              >
                {action}
              </Button>

              {action === "Create" && (
                <Button
                  disabled={loading}
                  className="ml-4"
                  type="submit"
                  onClick={() => setSendToClient(true)}
                >
                  Create and email invoice to customer
                </Button>
              )}
            </div>

            {/* <Button disabled={loading} className="ml-auto" type="submit">
              {action}
            </Button> */}
          </AdminFormHeader>

          <AdminFormBody className="mx-auto max-w-7xl space-y-0 lg:flex-col xl:flex-row">
            <section className="w-3/4 space-y-4">
              <EditSection
                title="Customer Details"
                description="Details of the customer who made the custom order."
                bodyClassName="grid grid-cols-2 gap-2"
              >
                <Form.FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <Form.FormItem>
                      <Form.FormLabel>Full Name</Form.FormLabel>
                      <Form.FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Name of customer"
                          {...field}
                        />
                      </Form.FormControl>
                      <Form.FormMessage />
                    </Form.FormItem>
                  )}
                />
                <Form.FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <Form.FormItem>
                      <Form.FormLabel>Email</Form.FormLabel>
                      <Form.FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Email of customer"
                          {...field}
                        />
                      </Form.FormControl>
                      <Form.FormMessage />
                    </Form.FormItem>
                  )}
                />
              </EditSection>
              <EditSection
                title="Customer Request"
                description="Description of the item the customer is requesting"
                bodyClassName="grid grid-cols-2 gap-2"
              >
                <Form.FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <Form.FormItem>
                      <Form.FormLabel>Product Type</Form.FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <Form.FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Set the order's product type"
                            />
                          </SelectTrigger>
                        </Form.FormControl>
                        <SelectContent>
                          <SelectItem value={CustomOrderType.HAT}>
                            Hat
                          </SelectItem>

                          <SelectItem value={CustomOrderType.HOODIE}>
                            Hoodie
                          </SelectItem>

                          <SelectItem value={CustomOrderType.SHIRT}>
                            Shirt
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Form.FormMessage />
                    </Form.FormItem>
                  )}
                />
                <Form.FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <Form.FormItem className="col-span-full">
                      <Form.FormLabel>User Description</Form.FormLabel>
                      <Form.FormControl>
                        <Textarea
                          placeholder={
                            "e.g. I want a custom hoodie with a custom design. I want it to be orange."
                          }
                          disabled={loading}
                          {...field}
                        />
                      </Form.FormControl>{" "}
                      <Form.FormDescription>
                        What did the customer ask for?
                      </Form.FormDescription>
                      <Form.FormMessage />
                    </Form.FormItem>
                  )}
                />
                <Form.FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <Form.FormItem className="mt-5">
                      <Form.FormLabel>Media</Form.FormLabel>
                      <Form.FormDescription>
                        Upload images for your product.{" "}
                      </Form.FormDescription>
                      <Form.FormControl>
                        {/* <>
                    {!initialData?.images && <ImageLoader />} */}
                        <ImageUpload
                          value={field.value.map((image) => image.url)}
                          disabled={loading}
                          folder="request-images"
                          maxFiles={3}
                          onChange={(url) => {
                            return field.onChange([...field.value, { url }]);
                          }}
                          onRemove={(url) =>
                            field.onChange([
                              ...field.value.filter(
                                (current) => current.url !== url
                              ),
                            ])
                          }
                        />
                        {/* </> */}
                      </Form.FormControl>
                      <Form.FormMessage />
                    </Form.FormItem>
                  )}
                />{" "}
              </EditSection>
              <EditSection
                className=" gap-2"
                title="Product Details"
                description="Details on the product the customer will be sent"
              >
                <Form.FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <Form.FormItem>
                      <Form.FormLabel>Price</Form.FormLabel>
                      <Form.FormControl>
                        <AdvancedNumericInput
                          field={field}
                          loading={loading}
                          placeholder="Price of order"
                          prependSpan="$"
                        />
                      </Form.FormControl>
                      <Form.FormMessage />
                    </Form.FormItem>
                  )}
                />

                <Form.FormField
                  control={form.control}
                  name="productDescription"
                  render={({ field }) => (
                    <Form.FormItem>
                      <Form.FormLabel>Product Description</Form.FormLabel>
                      <Form.FormControl>
                        <Textarea
                          disabled={loading}
                          placeholder="e.g. A large orange hoodie with your custom design, $14.99, est. 5 days"
                          {...field}
                        />
                      </Form.FormControl>{" "}
                      <Form.FormDescription>
                        Description of the product the customer is interested in
                        purchasing.
                      </Form.FormDescription>
                      <Form.FormMessage />
                    </Form.FormItem>
                  )}
                />
              </EditSection>
            </section>
            <section className="w-1/4">
              <EditSection
                className=" gap-2"
                title="Request Admin"
                description="Details on the status of this request and the product details"
              >
                <Form.FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Form.FormItem>
                      <Form.FormLabel>Status</Form.FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <Form.FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Set the order's status"
                            />
                          </SelectTrigger>
                        </Form.FormControl>
                        <SelectContent>
                          <SelectItem value={CustomOrderStatus.PENDING}>
                            Pending
                          </SelectItem>

                          <SelectItem value={CustomOrderStatus.ACCEPTED}>
                            Accepted
                          </SelectItem>

                          <SelectItem value={CustomOrderStatus.REJECTED}>
                            Rejected
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Form.FormMessage />
                    </Form.FormItem>
                  )}
                />
                <Form.FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <Form.FormItem>
                      <Form.FormLabel> Notes</Form.FormLabel>
                      <Form.FormControl>
                        <Textarea
                          disabled={loading}
                          placeholder="e.g. Need to contact customer on size."
                          {...field}
                        />
                      </Form.FormControl>{" "}
                      <Form.FormDescription>
                        Any notes you want to make for this order.
                      </Form.FormDescription>
                      <Form.FormMessage />
                    </Form.FormItem>
                  )}
                />
              </EditSection>
            </section>
          </AdminFormBody>
        </form>
      </Form.Form>
    </>
  );
};
