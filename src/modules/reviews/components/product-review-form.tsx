import { zodResolver } from "@hookform/resolvers/zod";
import type { Product } from "@prisma/client";

import { Check, Search, X } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";
import { AlertModal } from "~/modules/admin/components/modals/alert-modal";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
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

import type { TRPCError } from "@trpc/server";
import Image from "next/image";
import Link from "next/link";
import { EditSection } from "~/components/common/sections/edit-section.admin";
import { CommandAdvancedDialog } from "~/components/ui/command-advanced";
import { Textarea } from "~/components/ui/textarea";
import { env } from "~/env.mjs";
import ImageUpload from "~/services/image-upload/components/image-upload";
import { toastService } from "~/services/toast";

import { useSession } from "next-auth/react";
import { DialogFooter } from "~/components/ui/dialog";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";
import { reviewFormSchema } from "../schema";
import type { Review, ReviewFormValues } from "../types";

type Props = {
  initialData: Review;
  onOpenChange: (open: boolean) => void;
};

export const ProductReviewForm: React.FC<Props> = ({
  initialData,
  onOpenChange,
}) => {
  const params = useRouter();
  const router = useNavigationRouter();
  const apiContext = api.useContext();

  const { productId } = params.query as {
    productId: string;
  };

  const [open, setOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  const toastMessage = initialData
    ? "Collection updated."
    : "Collection created.";

  const { data: session } = useSession();

  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      rating: initialData?.rating ?? 5,
      content: initialData?.content ?? "",
      images: initialData?.images.map((image) => image.url) ?? [],
    },
  });

  const updateCollection = api.reviews.updateReview.useMutation({
    onSuccess: () => {
      toastService.success(toastMessage);
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      toastService.error(
        "Something went wrong with updating your review. Please try again later.",
        error
      );
    },

    onSettled: () => {
      void apiContext.reviews.invalidate();
      void apiContext.products.invalidate();
    },
  });

  const createCollection = api.reviews.createReview.useMutation({
    onSuccess: () => {
      toastService.success(toastMessage);
      onOpenChange(false);
    },
    onError: (error: unknown) =>
      toastService.error(
        "Something went wrong with creating your review. Please try again later..",
        error
      ),
    onSettled: () => {
      void apiContext.reviews.invalidate();
      void apiContext.products.invalidate();
    },
  });

  const deleteCollection = api.collections.deleteCollection.useMutation({
    onSuccess: () => {
      toastService.success("Review was successfully deleted");
      onOpenChange(false);
    },
    onError: (error: unknown) =>
      toastService.error(
        "Something went wrong with deleting your review. Please try again later.",
        error
      ),

    onSettled: () => {
      setOpen(false);
      void apiContext.reviews.invalidate();
      void apiContext.products.invalidate();
    },
  });

  const onSubmit = (data: ReviewFormValues) => {
    if (initialData) {
      updateCollection.mutate({
        reviewId: initialData.id,
        userId: session!.user.id,
        ...data,
      });
    } else {
      createCollection.mutate({
        userId: session!.user.id,
        productId: productId,
        ...data,
      });
    }
  };

  const loading =
    updateCollection.isLoading ||
    createCollection.isLoading ||
    deleteCollection.isLoading;
  const handleOnMediaDelete = (url: string) => {
    form.setValue("images", [
      ...form.watch("images").filter((current) => current !== url),
    ]);
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          <AdminFormBody className="mx-auto mt-4 max-w-7xl flex-col space-y-0 pt-0">
            <div className=" flex w-full flex-col space-y-4 ">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Collection name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Make sure the name is unique.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder="e.g. Summer is here! Get your summer essentials now!"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Used for SEO. Make it short and sweet, but descriptive.
                      Search engines love keywords!
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        type={"number"}
                        placeholder="e.g. summer-collection-2021"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Used for better SEO within the collection URL. Defaults to
                      your collection name if left blank. Must be unique
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>{" "}
                    <FormDescription>
                      Used to represent your product during checkout, social
                      sharing and more.
                    </FormDescription>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        disabled={loading}
                        maxFiles={3}
                        folder="reviews"
                        onChange={(url) => {
                          return field.onChange([
                            ...new Set([...field.value, url]),
                          ]);
                        }}
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter((current) => current !== url),
                          ])
                        }
                        onMediaDelete={handleOnMediaDelete}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
          </AdminFormBody>
          <DialogFooter>
            <Button disabled={loading} className="ml-auto" type="submit">
              {action}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
