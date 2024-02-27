import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CustomOrderStatus,
  CustomOrderType,
  type Billboard,
  type Prisma,
} from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";

import * as z from "zod";

import { AlertModal } from "~/components/admin/modals/alert-modal";
import { Button } from "~/components/ui/button";
import * as Form from "~/components/ui/form";
import { Heading } from "~/components/ui/heading";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import ImageUpload from "~/services/image-upload/components/image-upload";

import { BackToButton } from "~/components/common/buttons/back-to-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import CategoryPage from "~/pages/admin/[storeId]/categories/[categoryId]";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";

const formSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  description: z.string(),
  images: z.object({ url: z.string() }).array(),
  status: z.nativeEnum(CustomOrderStatus),
  type: z.nativeEnum(CustomOrderType),
  price: z.coerce.number().min(0),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
  initialData: Prisma.CustomOrderRequestGetPayload<{
    include: { images: true };
  }>;
}

export const CustomOrderForm: React.FC<BillboardFormProps> = ({
  initialData,
}) => {
  const params = useRouter();
  const router = useNavigationRouter();
  const apiContext = api.useContext();

  const { storeId, customOrderId } = params.query as {
    storeId: string;
    customOrderId: string;
  };

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit Custom Order" : "Create Custom Order";
  const description = initialData
    ? "Edit a Custom Order."
    : "Add a new Custom Order";
  const toastMessage = initialData
    ? "Custom Order updated."
    : "Custom Order created.";

  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      description: initialData?.description ?? "",

      images: initialData?.images ?? [],
      status: initialData?.status ?? "PENDING",
      type: initialData?.type ?? undefined,
      price: initialData?.price ?? 0,
    },
  });

  const updateCustomOrder = api.customOrder.updateCustomRequest.useMutation({
    onSuccess: () => {
      router.push(`/admin/${storeId}/custom-orders`);
      toastService.success(toastMessage);
    },
    onError: (error: unknown) =>
      toastService.error(
        "Something went wrong updating your custom order.",
        error
      ),

    onSettled: () => {
      void apiContext.customOrder.invalidate();
    },
  });

  const createCustomOrder = api.customOrder.createCustomRequest.useMutation({
    onSuccess: () => {
      router.push(`/admin/${storeId}/custom-orders`);
      toastService.success(toastMessage);
    },
    onError: (error: unknown) =>
      toastService.error(
        "Something went wrong creating your custom order.",
        error
      ),

    onSettled: () => {
      void apiContext.customOrder.invalidate();
    },
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

      void apiContext.customOrder.invalidate();
    },
  });

  const onSubmit = (data: BillboardFormValues) => {
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
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <BackToButton
        link={`/admin/${storeId}/custom-order/${customOrderId ?? ""}`}
        title="Back to Custom Order"
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
      <Form.Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className="w-full space-y-8"
        >
          <Form.FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <Form.FormItem>
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
                    onChange={(url) => {
                      return field.onChange([...field.value, { url }]);
                    }}
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                  {/* </> */}
                </Form.FormControl>
                <Form.FormMessage />
              </Form.FormItem>
            )}
          />{" "}
          <div className="gap-8 md:grid md:grid-cols-3">
            <Form.FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <Form.FormItem>
                  <Form.FormLabel>Name</Form.FormLabel>
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
            <Form.FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <Form.FormItem>
                  <Form.FormLabel>Price</Form.FormLabel>
                  <Form.FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Price of order"
                      {...field}
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />
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
                        Pending
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
          </div>
          <div className="gap-8 md:grid md:grid-cols-3">
            <Form.FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <Form.FormItem>
                  <Form.FormLabel>Description</Form.FormLabel>
                  <Form.FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Order description"
                      {...field}
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form.Form>
    </>
  );
};
