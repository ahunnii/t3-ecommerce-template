import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Billboard } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";

import { AlertModal } from "~/components/admin/modals/alert-modal";
import { Button } from "~/components/ui/button";
import * as Form from "~/components/ui/form";
import { Heading } from "~/components/ui/heading";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import ImageUpload from "~/services/image-upload/components/image-upload";

import { BackToButton } from "~/components/common/buttons/back-to-button";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";
import { billboardFormSchema } from "../schema";
import type { BillboardFormValues } from "../types";

type Props = { initialData: Billboard | null };

export const BillboardForm: React.FC<Props> = ({ initialData }) => {
  const params = useRouter();
  const router = useNavigationRouter();
  const apiContext = api.useContext();

  const { storeId, billboardId } = params.query as {
    storeId: string;
    billboardId: string;
  };

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard." : "Add a new billboard";
  const toastMessage = initialData
    ? "Billboard updated."
    : "Billboard created.";

  const action = initialData ? "Save changes" : "Create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(billboardFormSchema),
    defaultValues: {
      label: initialData?.label ?? "",
      imageUrl: initialData?.imageUrl ?? "",
      description: initialData?.description ?? "",
    },
  });

  const updateBillboard = api.billboards.updateBillboard.useMutation({
    onSuccess: () => toastService.success(toastMessage),
    onError: (error: unknown) =>
      toastService.error(
        "Something went wrong updating your billboard.",
        error
      ),
    onSettled: () => {
      router.push(`/admin/${storeId}/billboards`);
      void apiContext.billboards.invalidate();
    },
  });

  const createBillboard = api.billboards.createBillboard.useMutation({
    onSuccess: () => toastService.success(toastMessage),
    onError: (error: unknown) =>
      toastService.error(
        "Something went wrong creating your billboard.",
        error
      ),

    onSettled: () => {
      router.push(`/admin/${storeId}/billboards`);
      void apiContext.billboards.invalidate();
    },
  });

  const deleteBillboard = api.billboards.deleteBillboard.useMutation({
    onSuccess: () =>
      toastService.success("Billboard was successfully deleted."),
    onError: (error: unknown) =>
      toastService.error(
        "Make sure to remove all items using this billboard first before deleting.",
        error
      ),
    onSettled: () => {
      setOpen(false);
      router.push(`/admin/${storeId}/billboards`);
      void apiContext.billboards.invalidate();
    },
  });

  const onSubmit = (data: BillboardFormValues) => {
    if (initialData) updateBillboard.mutate({ billboardId, ...data });
    else createBillboard.mutate({ storeId, ...data });
  };
  const onDelete = () => deleteBillboard.mutate({ billboardId });

  const isLoading =
    updateBillboard.isLoading ||
    createBillboard.isLoading ||
    deleteBillboard.isLoading;

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <BackToButton
        link={`/admin/${storeId}/billboards/${billboardId ?? ""}`}
        title="Back to Billboard"
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
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
            name="imageUrl"
            render={({ field }) => (
              <Form.FormItem>
                <Form.FormLabel>Background image</Form.FormLabel>
                <Form.FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={isLoading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </Form.FormControl>
                <Form.FormMessage />
              </Form.FormItem>
            )}
          />
          <div className="gap-8 md:grid md:grid-cols-3">
            <Form.FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <Form.FormItem>
                  <Form.FormLabel>Label</Form.FormLabel>
                  <Form.FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </Form.FormControl>
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
                    <Input
                      disabled={isLoading}
                      placeholder="Billboard description"
                      {...field}
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form.Form>
    </>
  );
};
