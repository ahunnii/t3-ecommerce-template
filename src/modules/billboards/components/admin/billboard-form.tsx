import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Billboard } from "@prisma/client";

import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import * as Form from "~/components/ui/form";
import { AlertModal } from "~/modules/admin/components/modals/alert-modal";

import { Input } from "~/components/ui/input";

import ImageUpload from "~/services/image-upload/components/image-upload";

import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";

import { EditSection } from "~/components/common/sections/edit-section.admin";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";
import { billboardFormSchema } from "../../schema";
import type { BillboardFormValues } from "../../types";

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
      <Form.Form {...form}>
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
          <AdminFormHeader
            title={title}
            description={description}
            contentName="Billboard"
            link={`/admin/${storeId}/billboards/${billboardId ?? ""}`}
          >
            {initialData && (
              <AlertModal
                isOpen={open}
                setIsOpen={setOpen}
                onConfirm={onDelete}
                loading={isLoading}
                asChild={true}
              />
            )}

            <Button disabled={isLoading} className="ml-auto" type="submit">
              {action}
            </Button>
          </AdminFormHeader>
          <AdminFormBody className="space-y-0 max-lg:flex-col-reverse">
            <EditSection
              title="Details"
              description="Used for SEO and for display on the website."
              className="w-full bg-white  shadow-sm lg:w-8/12"
              bodyClassName="space-y-4"
            >
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
                    <Form.FormDescription>
                      Give a name to your billboard. Used primarily to assign
                      the billboard to collections.
                    </Form.FormDescription>
                    <Form.FormMessage />
                  </Form.FormItem>
                )}
              />

              <Form.FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <Form.FormItem>
                    <Form.FormLabel>
                      Brief Description (optional)
                    </Form.FormLabel>
                    <Form.FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Billboard description"
                        {...field}
                      />
                    </Form.FormControl>
                    <Form.FormMessage />
                    <Form.FormDescription>
                      Explain what this billboard image is and how it is used.
                    </Form.FormDescription>
                  </Form.FormItem>
                )}
              />
            </EditSection>
            <EditSection
              title="Media"
              description="This content can be displayed on the website, so make sure it is appropriate."
              className="w-full bg-white  shadow-sm lg:w-4/12"
            >
              <Form.FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <Form.FormItem>
                    <Form.FormLabel>Image</Form.FormLabel>
                    <Form.FormControl>
                      <ImageUpload
                        value={field.value ? [field.value] : []}
                        disabled={isLoading}
                        onChange={(url) => field.onChange(url)}
                        onRemove={() => field.onChange("")}
                        folder=""
                      />
                    </Form.FormControl>
                    <Form.FormMessage />
                  </Form.FormItem>
                )}
              />
            </EditSection>
          </AdminFormBody>
        </form>
      </Form.Form>
    </>
  );
};
