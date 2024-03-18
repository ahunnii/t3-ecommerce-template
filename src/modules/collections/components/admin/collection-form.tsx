import { zodResolver } from "@hookform/resolvers/zod";
import type { Billboard, Product } from "@prisma/client";
import { Command as CommandPrimitive } from "cmdk";
import { Check, Search, X } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";
import { AlertModal } from "~/modules/admin/components/modals/alert-modal";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Command,
  CommandDialog,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

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
import { collectionFormSchema } from "../../schema";
import type { CollectionFormValues } from "../../types";

type Props = {
  initialData: DetailedCollection | null;
  products: Product[];
};

export const CollectionForm: React.FC<Props> = ({ initialData, products }) => {
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

  const inputRef = useRef<HTMLInputElement>(null);
  const [productsOpen, setProductsOpen] = useState(false);

  const [inputValue, setInputValue] = useState("");

  const handleUnselect = useCallback((product: Product) => {
    const current = form
      .getValues("products")
      .filter((s) => s.id !== product.id);
    form.setValue("products", current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const newSelected = [...form.getValues("products")];
            newSelected.pop();

            form.setValue("products", newSelected);
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const selectables = products.filter(
    (product) => !form.getValues("products").includes(product)
  );

  const updateCollection = api.collections.updateCollection.useMutation({
    onSuccess: () => toastService.success(toastMessage),
    onError: (error: unknown) =>
      toastService.error(
        "Something went wrong with updating your collection.",
        error
      ),

    onSettled: () => {
      router.push(`/admin/${storeId}/collections`);
      void apiContext.collections.invalidate();
    },
  });

  const createCollection = api.collections.createCollection.useMutation({
    onSuccess: () => toastService.success(toastMessage),
    onError: (error: unknown) =>
      toastService.error(
        "Something went wrong with creating your collection.",
        error
      ),
    onSettled: () => {
      router.push(`/admin/${storeId}/collections`);
      void apiContext.collections.invalidate();
    },
  });

  const deleteCollection = api.collections.deleteCollection.useMutation({
    onSuccess: () =>
      toastService.success("Collection was successfully deleted"),
    onError: (error: unknown) =>
      toastService.error(
        "Something went wrong with creating your collection.",
        error
      ),

    onSettled: () => {
      router.push(`/admin/${storeId}/collections`);
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

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (initialData?.products) setSelectedProducts(initialData?.products);
  }, [initialData?.products]);

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
            contentName="Collection"
            link={`/admin/${storeId}/collections/${collectionId ?? ""}`}
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
            <div className="flex w-8/12 flex-col space-y-4">
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          This collection will be featured on the homepage. It
                          is recommended to have 3 to 4 featured collections at
                          any one given time.
                        </FormDescription>
                      </div>
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
                        Used for SEO. Defaults to your collection name if left
                        blank. MUST BE UNIQUE
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem className="flex flex-col items-start  space-y-4 rounded-md border p-4">
                  <FormLabel>Search Engine Preview</FormLabel>

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
                          <div>
                            {field?.value?.map((product) => {
                              return (
                                <FormItem
                                  className="flex h-14 items-center gap-4 border border-border px-4  odd:bg-zinc-100"
                                  key={`selected_product_${product.id}`}
                                >
                                  {" "}
                                  <div className="relative aspect-square h-6 rounded-lg ">
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
                                      variant="link"
                                      className="m-0 p-0"
                                    >
                                      {" "}
                                      {(product as Product).name}
                                    </Button>
                                  </Link>
                                  <div
                                    className="ml-auto flex aspect-square cursor-pointer items-center justify-center rounded-md "
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
                                        " h-4 w-4",
                                        field.value.some(
                                          (prod) => prod.id === product.id
                                        )
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </div>
                                </FormItem>
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
            <div className="flex w-4/12 flex-col space-y-4">
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
                          onChange={(url) => {
                            field.onChange(url);
                            return field.onChange(url);
                          }}
                          onRemove={() => form.setValue("imageUrl", "")}
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
