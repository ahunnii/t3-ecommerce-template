"use client";

import { Combobox, Listbox, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Billboard, Collection, Product } from "@prisma/client";
import { Command as CommandPrimitive } from "cmdk";
import { CheckIcon, ChevronsUpDown, Trash, X } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { AlertModal } from "~/components/admin/modals/alert-modal";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Command, CommandGroup, CommandItem } from "~/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Heading } from "~/components/ui/heading";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { api } from "~/utils/api";

const formSchema = z.object({
  name: z.string().min(2),
  billboardId: z.string().min(1),
  products: z.array(
    z.object({
      id: z.string(),
    })
  ),
});

type CollectionFormValues = z.infer<typeof formSchema>;

interface CollectionFormProps {
  initialData: Collection;
  products: Product[];
  billboards: Billboard[];
}

export const CollectionForm: React.FC<CollectionFormProps> = ({
  initialData,
  products,
  billboards,
}) => {
  const params = useRouter();
  const router = useNavigationRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit collection" : "Create collection";
  const description = initialData
    ? "Edit a collection."
    : "Add a new collection";
  const toastMessage = initialData
    ? "Collection updated."
    : "Collection created.";
  const action = initialData ? "Save changes" : "Create";
  console.log(initialData);
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ?? {
      name: "",
      billboardId: "",
      products: [],
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [productsOpen, setProductsOpen] = useState(false);

  const [inputValue, setInputValue] = useState("");

  const handleUnselect = useCallback((framework: Product) => {
    const current = form
      .getValues("products")
      .filter((s) => s.id !== framework.id);
    form.setValue("products", current);
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
    []
  );

  const selectables = products.filter(
    (framework) => !form.getValues("products").includes(framework)
  );

  const { mutate: updateCollection } =
    api.collections.updateCollection.useMutation({
      onSuccess: () => {
        router.push(`/admin/${params.query.storeId as string}/collections`);
        toast.success(toastMessage);
      },
      onError: (error) => {
        toast.error("Something went wrong");
        console.error(error);
      },
      onMutate: () => {
        setLoading(true);
      },
      onSettled: () => {
        setLoading(false);
      },
    });

  const { mutate: createCollection } =
    api.collections.createCollection.useMutation({
      onSuccess: () => {
        router.push(`/admin/${params.query.storeId as string}/collections/`);
        toast.success(toastMessage);
      },
      onError: (error) => {
        toast.error("Something went wrong");
        console.error(error);
      },
      onMutate: () => {
        setLoading(true);
      },
      onSettled: () => {
        setLoading(false);
      },
    });

  const { mutate: deleteCollection } =
    api.collections.deleteCollection.useMutation({
      onSuccess: () => {
        router.push(`/admin/${params.query.storeId as string}/collections`);
        toast.success("Collection deleted.");
      },
      onError: (error) => {
        toast.error(
          "Make sure you removed all products using this color first."
        );
        console.error(error);
      },
      onMutate: () => {
        setLoading(true);
      },
      onSettled: () => {
        setLoading(false);
        setOpen(false);
      },
    });

  const onSubmit = (data: CollectionFormValues) => {
    if (initialData) {
      updateCollection({
        storeId: params?.query?.storeId as string,
        billboardId: data.billboardId,
        name: data.name,
        collectionId: params?.query?.collectionId as string,
        products: data.products,
      });
    } else {
      createCollection({
        storeId: params?.query?.storeId as string,
        name: data.name,
        billboardId: data.billboardId,
        products: data.products,
      });
    }
  };

  const onDelete = () => {
    deleteCollection({
      storeId: params?.query?.storeId as string,
      collectionId: params?.query?.collectionId as string,
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
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
          // onChange={(e) => console.log(form.getValues())}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
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
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="products"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Command
                      onKeyDown={handleKeyDown}
                      className="overflow-visible bg-transparent"
                    >
                      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <div className="flex flex-wrap gap-1">
                          {field.value.map((framework) => {
                            return (
                              <Badge
                                key={(framework as Product).name}
                                variant="secondary"
                              >
                                {(framework as Product).name}
                                <button
                                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                  aria-label={(framework as Product).name}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleUnselect(framework as Product);
                                    }
                                  }}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onClick={() =>
                                    handleUnselect(framework as Product)
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
                            placeholder="Select frameworks..."
                            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                          />
                        </div>
                      </div>
                      <div className="relative mt-2">
                        {productsOpen && selectables.length > 0 ? (
                          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                            <CommandGroup className="h-full overflow-auto">
                              {selectables.map((framework) => {
                                return (
                                  <CommandItem
                                    key={framework.name}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                    onSelect={() => {
                                      setInputValue("");
                                      form.setValue("products", [
                                        ...field.value,
                                        framework,
                                      ]);
                                    }}
                                    className={"cursor-pointer"}
                                  >
                                    {framework.name}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </div>
                        ) : null}
                      </div>
                    </Command>
                    {/* <Listbox
                      value={field.value}
                      onChange={field.onChange}
                      multiple
                    >
                      <Listbox.Button>
                        {field.value
                          .map((product: Product) => product.name)
                          .join(", ")}
                      </Listbox.Button>
                      <Listbox.Options>
                        {products.map((product) => (
                          <Listbox.Option key={product.id} value={product.id}>
                            {product.name}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Listbox> */}

                    {/* <Input
                      disabled={loading}
                      placeholder="Collection name"
                      {...field}
                    /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <div>
              <FormLabel>Products</FormLabel>

              {fields.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <Controller
                    render={({ field }) => (
                      <Select
                        onValueChange={(e) => field.onChange(e)}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="No variant selected" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product, idx) => (
                            <SelectItem
                              key={idx}
                              value={product.id}
                              className="flex"
                            >
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    name={`products.${index}.id`}
                    control={form.control}
                  />


                  <Button
                    onClick={() => remove(index)}
                    variant="destructive"
                    type="button"
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button onClick={() => append({ id: "" })} type="button">
                Add Product
              </Button>
            </div> */}
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
