/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import type {
  Attribute,
  Category,
  GalleryImage,
  Image,
  Product,
  ProductType,
  ShippingType,
  Tag,
  Variation,
} from "@prisma/client";

import { Trash } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod";

import { AlertModal } from "~/components/admin/modals/alert-modal";
import { Button } from "~/components/ui/button";

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

import { BackToButton } from "~/components/common/buttons/back-to-button";
import MarkdownEditor from "~/components/common/inputs/markdown-editor";
import { Separator } from "~/components/ui/separator";
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
        storeId: params.query.storeId as string,
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
      storeId: params.query.storeId as string,
      id: params.query.galleryId as string,
    });
  };

  const { setValue } = form;

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />{" "}
      <BackToButton
        link={`/admin/${storeId}/gallery/${galleryId ?? ""}`}
        title="Back to Gallery"
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
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className="w-full space-y-8"
        >
          <section className="flex w-full gap-4 max-lg:flex-col">
            <div className="flex w-full flex-col space-y-4 lg:w-8/12">
              <div className="w-full  rounded-md border border-border bg-background/50 p-4 ">
                <FormLabel>Details</FormLabel>{" "}
                <FormDescription>
                  Write to your heart&apos;s content.
                </FormDescription>
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
              </div>
            </div>
            <div className="flex w-full flex-col lg:w-4/12">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Image</FormLabel>{" "}
                    <FormDescription>
                      Used to represent your blog on social media and other
                      sharing
                    </FormDescription>
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
            </div>
          </section>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
