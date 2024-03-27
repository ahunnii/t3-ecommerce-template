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
import type { DetailedCollection } from "~/types";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";
import type { CollectionFormValues } from "../../types";
import { collectionFormSchema } from "../schema";

type Props = {
  initialData: DetailedCollection | null;
  products: Product[];
};

export const ReviewForm: React.FC<Props> = ({ initialData, products }) => {
  const params = useRouter();
  const router = useNavigationRouter();
  const apiContext = api.useContext();

  const { storeId, collectionId } = params.query as {
    storeId: string;
    collectionId: string;
  };

  const [open, setOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  const title = initialData ? "Edit collection" : "Create collection";
  const description = initialData
    ? "Edit a collection."
    : "Add a new collection";
  const toastMessage = initialData
    ? "Collection updated."
    : "Collection created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      imageUrl: initialData?.image?.url ?? undefined,
      alt: initialData?.image?.alt ?? "",
      description: initialData?.description ?? "",
      products: initialData?.products ?? [],
      slug: initialData?.slug ?? "",
    },
  });

  const updateCollection = api.collections.updateCollection.useMutation({
    onSuccess: () => {
      toastService.success(toastMessage);
      router.push(`/admin/${storeId}/collections`);
    },
    onError: (error: unknown) => {
      toastService.error(
        "Something went wrong with updating your collection.",
        error
      );

      if ((error as TRPCError)?.message?.includes("Collection_slug_key"))
        form.setError("slug", {
          type: "manual",
          message: "Slug must be unique.",
        });

      if ((error as TRPCError)?.message?.includes("Collection_name_key"))
        form.setError("name", {
          type: "manual",
          message: "Name must be unique.",
        });
    },

    onSettled: () => {
      void apiContext.collections.invalidate();
    },
  });

  const createCollection = api.collections.createCollection.useMutation({
    onSuccess: () => {
      toastService.success(toastMessage);
      router.push(`/admin/${storeId}/collections`);
    },
    onError: (error: unknown) =>
      toastService.error(
        "Something went wrong with creating your collection.",
        error
      ),
    onSettled: () => {
      void apiContext.collections.invalidate();
    },
  });

  const deleteCollection = api.collections.deleteCollection.useMutation({
    onSuccess: () => {
      toastService.success("Collection was successfully deleted");
      router.push(`/admin/${storeId}/collections`);
    },
    onError: (error: unknown) =>
      toastService.error(
        "Something went wrong with creating your collection.",
        error
      ),

    onSettled: () => {
      setOpen(false);
      void apiContext.collections.invalidate();
    },
  });

  const onSubmit = (data: CollectionFormValues) => {
    if (initialData) {
      updateCollection.mutate({
        collectionId,
        ...data,
      });
    } else {
      createCollection.mutate({
        storeId,
        ...data,
      });
    }
  };

  const onDelete = () => {
    deleteCollection.mutate({ collectionId });
  };

  const loading =
    updateCollection.isLoading ||
    createCollection.isLoading ||
    deleteCollection.isLoading;

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
          <AdminFormHeader
            title={title}
            description={description}
            contentName="Collections"
            link={`/admin/${storeId}/collections`}
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
            <div className=" flex w-full flex-col space-y-4 xl:w-8/12">
              <EditSection
                title="Details"
                description="Basic information on the Collection"
                bodyClassName="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
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
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="e.g. summer-collection-2021"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Used for better SEO within the collection URL. Defaults
                        to your collection name if left blank. Must be unique
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem className="flex flex-col items-start  space-y-4 rounded-md border p-4">
                  <div>
                    <FormLabel>Search Engine Preview</FormLabel>
                    <FormDescription>
                      This is how your collection appears in search engines.
                    </FormDescription>
                  </div>
                  <div className="space-y-1 leading-none">
                    <FormLabel className=" mb-[0.125rem] break-words text-[1.125rem] leading-[1.3125rem] text-[#1a0dab]">
                      {form.watch("name")}
                    </FormLabel>
                    <FormDescription className="mb-[0.125rem] break-words text-[.8125rem] leading-4 text-[#006621]">
                      {env.NEXT_PUBLIC_URL}/products/
                      {form.watch("slug") ??
                        form.watch("name").toLowerCase().split(" ").join("-")}
                    </FormDescription>
                    <FormDescription className="line-clamp-5  break-words text-[.8125rem] leading-[1.125rem] text-[#545454]">
                      {form.watch("description")}
                    </FormDescription>
                  </div>
                </FormItem>
              </EditSection>
              <EditSection
                title="Products"
                description="Add products to the collection"
              >
                <FormField
                  control={form.control}
                  name="products"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <>
                          <Button
                            onClick={() => setProductOpen(true)}
                            type="button"
                            className="flex w-full items-center justify-between gap-2  "
                            variant="outline"
                          >
                            <span className="flex items-center gap-2">
                              <Search className="text-grey-50 size-5 " /> Search
                              products...
                            </span>
                          </Button>
                          <CommandAdvancedDialog
                            open={productOpen}
                            onOpenChange={setProductOpen}
                          >
                            <CommandInput placeholder="Search by product name..." />
                            <CommandList className="mb-12 ">
                              <CommandEmpty>No results found.</CommandEmpty>

                              <CommandGroup heading="Products" className="">
                                {products?.map((product) => (
                                  <CommandItem
                                    key={product.id}
                                    className="flex gap-2 font-light "
                                    onSelect={() => {
                                      field.onChange(
                                        field.value.some(
                                          (prod) => prod.id === product.id
                                        )
                                          ? field.value.filter(
                                              (item) => item.id !== product.id
                                            )
                                          : [...field.value, product]
                                      );
                                    }}
                                  >
                                    <div className="mr-2 flex aspect-square items-center justify-center rounded-md border border-border">
                                      <Check
                                        className={cn(
                                          " h-4 w-4",
                                          field.value.some(
                                            (prod) => prod.id === product.id
                                          )
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </div>
                                    <div className="relative aspect-square h-6 rounded-lg ">
                                      <Image
                                        src={
                                          product?.featuredImage ??
                                          "/placeholder-image.webp"
                                        }
                                        fill
                                        sizes={"100vw"}
                                        className="rounded-lg "
                                        alt=""
                                      />
                                    </div>
                                    {product.name}{" "}
                                    <span className="sr-only">
                                      {product.id}
                                    </span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>

                            <div className="absolute bottom-0  flex h-12 w-full items-center justify-end border-t border-t-zinc-200 px-2 py-4">
                              <Button
                                type="button"
                                onClick={() => setProductOpen(false)}
                                size={"sm"}
                              >
                                Done
                              </Button>
                            </div>
                          </CommandAdvancedDialog>
                          <div className="flex w-full flex-col space-y-2 ">
                            {field?.value?.map((product) => {
                              return (
                                <section
                                  className="flex w-full items-center border  border-border px-4  py-2 odd:bg-zinc-100"
                                  key={`selected_product_${product.id}`}
                                >
                                  <div className="relative my-auto aspect-square h-6 rounded-lg">
                                    <Image
                                      src={
                                        (product as Product)?.featuredImage ??
                                        "/placeholder-image.webp"
                                      }
                                      fill
                                      sizes={"100vw"}
                                      className="rounded-lg "
                                      alt=""
                                    />
                                  </div>
                                  <Link
                                    href={`/admin/${storeId}/products/${product.id}`}
                                    target="_blank"
                                  >
                                    <Button
                                      type="button"
                                      size={"sm"}
                                      className=""
                                      variant="link"
                                    >
                                      {(product as Product).name}
                                    </Button>
                                  </Link>
                                  <div
                                    className="group ml-auto flex aspect-square cursor-pointer items-center justify-center rounded-md "
                                    onClick={() => {
                                      field.onChange(
                                        field.value.some(
                                          (prod) => prod.id === product.id
                                        )
                                          ? field.value.filter(
                                              (item) => item.id !== product.id
                                            )
                                          : [...field.value, product]
                                      );
                                    }}
                                  >
                                    <X
                                      className={cn(
                                        " h-4 w-4 group-hover:text-zinc-600",
                                        field.value.some(
                                          (prod) => prod.id === product.id
                                        )
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </div>
                                </section>
                              );
                            })}
                          </div>
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </EditSection>
            </div>
            <div className="flex w-full flex-col space-y-4 xl:w-4/12">
              {" "}
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This collection will be featured on the homepage. It is
                        recommended to have 3 to 4 featured collections at any
                        one given time.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <EditSection
                title="Media"
                description="Add a cover image to the collection"
                bodyClassName="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image</FormLabel>{" "}
                      <FormDescription>
                        Used to represent your product during checkout, social
                        sharing and more.
                      </FormDescription>
                      <FormControl>
                        <ImageUpload
                          value={field.value ? [field.value] : []}
                          disabled={loading}
                          maxFiles={1}
                          onChange={(url) => {
                            return field.onChange(url);
                          }}
                          onRemove={() => form.setValue("imageUrl", "")}
                          folder="collections"
                          selectPreviousImages={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt Description</FormLabel>{" "}
                      <FormDescription>
                        Used for image SEO and accessibility.
                      </FormDescription>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="e.g. A black t-shirt on a white background."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </EditSection>
            </div>
          </AdminFormBody>
        </form>
      </Form>
    </>
  );
};
