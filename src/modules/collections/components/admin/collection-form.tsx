import { zodResolver } from "@hookform/resolvers/zod";
import type { Billboard, Product } from "@prisma/client";
import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";
import { AlertModal } from "~/modules/admin/components/modals/alert-modal";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Command, CommandGroup, CommandItem } from "~/components/ui/command";
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

import { EditSection } from "~/components/common/sections/edit-section.admin";
import ImageUpload from "~/services/image-upload/components/image-upload";
import { toastService } from "~/services/toast";
import type { DetailedCollection } from "~/types";
import { api } from "~/utils/api";
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
  return (
    <>
      <Form {...form}>
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
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

          <AdminFormBody className="space-y-0">
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
                        <Command
                          onKeyDown={handleKeyDown}
                          className="overflow-visible bg-transparent"
                        >
                          <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                            <div className="flex flex-wrap gap-1">
                              {field?.value?.map((product) => {
                                return (
                                  <Badge
                                    key={(product as Product).name}
                                    variant="secondary"
                                  >
                                    {(product as Product).name}
                                    <button
                                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                      aria-label={(product as Product).name}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          handleUnselect(product as Product);
                                        }
                                      }}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                      }}
                                      onClick={() =>
                                        handleUnselect(product as Product)
                                      }
                                    >
                                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                  </Badge>
                                );
                              })}
                              {/* Avoid having the "Search" Icon */}
                              <CommandPrimitive.Input
                                ref={inputRef}
                                value={inputValue}
                                onValueChange={setInputValue}
                                onBlur={() => setProductsOpen(false)}
                                onFocus={() => setProductsOpen(true)}
                                placeholder={
                                  products.length === 0
                                    ? "Add some products first."
                                    : "Select products..."
                                }
                                disabled={products.length === 0}
                                className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                              />
                            </div>
                          </div>
                          <div className="relative mt-2">
                            {productsOpen && selectables.length > 0 ? (
                              <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                                <CommandGroup className="h-full overflow-auto">
                                  {selectables.map((product) => {
                                    return (
                                      <CommandItem
                                        key={product.name}
                                        onMouseDown={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                        }}
                                        onSelect={() => {
                                          setInputValue("");
                                          form.setValue("products", [
                                            ...field.value,
                                            product,
                                          ]);
                                        }}
                                        className={"cursor-pointer"}
                                      >
                                        {product.name}
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </div>
                            ) : null}
                          </div>
                        </Command>
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
