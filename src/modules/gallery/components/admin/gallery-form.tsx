/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import type { GalleryImage } from "@prisma/client";

import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod";

import { Button } from "~/components/ui/button";
import { AlertModal } from "~/modules/admin/components/modals/alert-modal";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import { Input } from "~/components/ui/input";

import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";

import MarkdownEditor from "~/components/common/inputs/markdown-editor";
import { EditSection } from "~/components/common/sections/edit-section.admin";

import ImageUpload from "~/services/image-upload/components/image-upload";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";

const formSchema = z.object({
  title: z.string().optional(),
  url: z.string().url(),
  caption: z.string().optional(),
});

type GalleryImageFormValues = z.infer<typeof formSchema>;

interface GalleryImageFormProps {
  initialData: GalleryImage | null;
}

export const GalleryForm: React.FC<GalleryImageFormProps> = ({
  initialData,
}) => {
  const params = useRouter();
  const router = useNavigationRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit gallery image" : "Create gallery image";
  const description = initialData
    ? "Edit a gallery image."
    : "Add a new gallery image";
  const toastMessage = initialData
    ? "Gallery image updated."
    : "Gallery image created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = {
    title: initialData?.title ?? "",
    url: initialData?.url ?? "",
    caption: initialData?.caption ?? "",
  };

  const form = useForm<GalleryImageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const apiContext = api.useContext();
  const { storeId, galleryId } = params.query as {
    storeId: string;
    galleryId: string;
  };

  const { mutate: updateBlogPost } = api.gallery.updateGalleryImage.useMutation(
    {
      onSuccess: () => toastService.success(toastMessage),
      onError: (error: unknown) =>
        toastService.error(
          "Something went wrong with updating. Please try again later.",
          error
        ),
      onMutate: () => setLoading(true),
      onSettled: async () => {
        setLoading(false);
        router.push(`/admin/${params.query.storeId as string}/gallery`);
        await apiContext.blogPosts.invalidate();
      },
    }
  );

  const { mutate: createBlogPost } = api.gallery.createGalleryImage.useMutation(
    {
      onSuccess: () => toastService.success(toastMessage),
      onError: (error: unknown) =>
        toastService.error(
          "Something went wrong with creating. Please try again later.",
          error
        ),
      onMutate: () => setLoading(true),
      onSettled: () => {
        setLoading(false);
        router.push(`/admin/${params.query.storeId as string}/gallery`);
      },
    }
  );

  const { mutate: deleteBlogPost } = api.gallery.deleteGalleryImage.useMutation(
    {
      onSuccess: () => toastService.success("Product deleted."),
      onError: (error) =>
        toastService.error(
          "Something went wrong with deleting. Please try again later.",
          error
        ),
      onMutate: () => setLoading(true),
      onSettled: () => {
        setLoading(false);
        setOpen(false);
        router.push(`/admin/${params.query.storeId as string}/gallery`);
      },
    }
  );

  const onSubmit = (data: GalleryImageFormValues) => {
    if (initialData) {
      updateBlogPost({
        ...data,

        id: params.query.galleryId as string,
      });
    } else {
      createBlogPost({
        ...data,
        storeId: params.query.storeId as string,
      });
    }
  };

  const onDelete = () => {
    deleteBlogPost({
      id: params.query.galleryId as string,
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
          <AdminFormHeader
            title={title}
            description={description}
            contentName="Gallery"
            link={`/admin/${storeId}/gallery`}
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
            <div className="flex w-full flex-col space-y-4 lg:w-8/12">
              <EditSection title="Details" description="Metadata and SEO">
                <div className="my-5 gap-8 md:grid md:grid-cols-2 ">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="e.g. Cool new blog post!"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Caption</FormLabel>
                        <FormControl>
                          <MarkdownEditor
                            description={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>{" "}
              </EditSection>
            </div>
            <EditSection
              title="Image"
              description="Gallery items are visible to the public, so make sure they are appropriate"
              className="flex h-fit w-full flex-col lg:w-4/12"
            >
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Image</FormLabel>{" "}
                    <FormDescription></FormDescription>
                    <FormControl>
                      {/* <>
                    {!initialData?.images && <ImageLoader />} */}
                      <ImageUpload
                        value={field.value ? [field.value] : []}
                        disabled={loading}
                        onChange={(url) => {
                          return field.onChange(url);
                        }}
                        onRemove={() => form.setValue("url", "")}
                      />
                      {/* </> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
            </EditSection>
          </AdminFormBody>
        </form>
      </Form>
    </>
  );
};
