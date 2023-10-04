/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type {
  Attribute,
  Category,
  Color,
  Image,
  Product,
  Size,
  Variation,
} from "@prisma/client";

import { Trash } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { AlertModal } from "~/components/admin/modals/alert-modal";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
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
// import ImageLoader from "~/components/ui/image-loader";
import ImageUpload from "~/components/ui/image-upload";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/utils/api";

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().optional(),
  sizeId: z.string().optional(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  description: z.string().optional(),
  quantity: z.coerce.number().min(1).default(1),

  variants: z.array(
    z.object({
      names: z.string().min(1),
      values: z.string().min(1),
      price: z.coerce.number().min(1),
      quantity: z.coerce.number().min(1),
    })
  ),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
        variants: Variation[];
      })
    | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
  attributes: Attribute[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  sizes,
  colors,
  attributes,
}) => {
  const params = useRouter();
  const router = useNavigationRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product." : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = initialData
    ? {
        ...initialData,
        price: parseFloat(String(initialData?.price)),

        colorId:
          initialData.colorId && initialData.colorId != ""
            ? initialData.colorId
            : undefined,
        sizeId:
          initialData.sizeId && initialData.sizeId != ""
            ? initialData.sizeId
            : undefined,
        description: initialData?.description ?? "",
        variants: initialData?.variants
          ? initialData?.variants?.map((variant) => ({
              values: variant.values,
              price: Number(variant.price),
              names: variant.names,
              quantity: variant.quantity,
            }))
          : [],
      }
    : {
        name: "",
        images: [],
        price: 0,
        categoryId: "",
        colorId: undefined,
        sizeId: undefined,
        description: "",
        quantity: 1,
        isFeatured: false,
        isArchived: false,
        attributes: [],
        variants: [],
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { mutate: updateProduct } = api.products.updateProduct.useMutation({
    onSuccess: () => {
      router.push(`/admin/${params.query.storeId as string}/products`);
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

  const { mutate: createProduct } = api.products.createProduct.useMutation({
    onSuccess: () => {
      router.push(`/admin/${params.query.storeId as string}/products`);
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

  const { mutate: deleteProduct } = api.products.deleteProduct.useMutation({
    onSuccess: () => {
      router.push(`/admin/${params.query.storeId as string}/products`);
      toast.success("Product deleted.");
    },
    onError: (error) => {
      toast.error("Something went wrong.");
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

  const onSubmit = (data: ProductFormValues) => {
    if (initialData) {
      updateProduct({
        ...data,
        storeId: params.query.storeId as string,
        productId: params.query.productId as string,
      });
    } else {
      createProduct({
        ...data,
        storeId: params.query.storeId as string,
      });
    }
  };

  const onDelete = () => {
    deleteProduct({
      storeId: params.query.storeId as string,
      productId: params.query.productId as string,
    });
  };

  const handleGenerateVariations = () => {
    function splitValues(attribute: Attribute): string[] {
      return attribute.values.split(";");
    }

    function cartesianProduct(
      sets: string[][],
      prefix: string[] = []
    ): string[][] {
      if (!sets.length) {
        return [prefix];
      }

      const resultSet: string[][] = [];
      const [currentSet, ...remainingSets] = sets;

      for (const item of currentSet!) {
        const newPrefix = [...prefix, item];
        const productOfRemaining = cartesianProduct(remainingSets, newPrefix);
        resultSet.push(...productOfRemaining);
      }

      return resultSet;
    }

    const attributeValues = attributes.map(splitValues);
    const test = cartesianProduct(attributeValues);

    const generatedVariations = test.map((variation) => ({
      names: attributes.map((attribute) => attribute.name).join(", "),
      values: variation.join(", "),
      price: form.getValues("price"),
      quantity: 1,
    }));

    return generatedVariations;
  };

  const { fields, append, remove, update, replace } = useFieldArray({
    control: form.control,
    name: "variants",
  });
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />{" "}
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
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  {/* <>
                    {!initialData?.images && <ImageLoader />} */}
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                  {/* </> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
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
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
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
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
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
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
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
                          placeholder="Select a size"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
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
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
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
                          placeholder="Select a color"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          {color.name}
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
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="1"
                      {...field}
                    />
                  </FormControl>
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
                      placeholder="e.g. This product is a ...."
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
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>{" "}
          <div className="w-full">
            <FormField
              control={form.control}
              name="variants"
              render={({ field }) => (
                <>
                  <FormLabel>Variations</FormLabel>{" "}
                  <FormDescription>
                    Create variations for customers to choose from. Note that
                    these will override your default values above.
                  </FormDescription>
                  <div className="my-5 flex gap-5">
                    <Button
                      variant={"secondary"}
                      className="my-2"
                      type="button"
                      onClick={() => replace(handleGenerateVariations())}
                    >
                      Generate Variations
                    </Button>
                    <Button
                      variant={"destructive"}
                      className="my-2"
                      type="button"
                      onClick={() => replace([])}
                    >
                      Delete all Variations
                    </Button>
                  </div>
                  {field.value.length > 0 && (
                    <div className="my-5 max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {/* <TableHead className="w-[100px]">ID</TableHead> */}
                            {attributes
                              .map((attribute) => attribute.name)
                              .map((name) => (
                                <TableHead key={name}>{name}</TableHead>
                              ))}
                            <TableHead className="">Quantity</TableHead>
                            <TableHead>$ Price</TableHead>
                            <TableHead className="text-right">
                              Delete Variant
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fields.map((item, index) => (
                            <TableRow key={item.id}>
                              {/* <TableCell className="font-medium">
                                VAR00{index}
                              </TableCell> */}
                              {item?.values?.split(", ").map((name) => (
                                <TableCell key={name}>{name}</TableCell>
                              ))}
                              <TableCell>
                                <Controller
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      type="number"
                                      placeholder="Attribute (e.g., Size, Color)"
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                    />
                                  )}
                                  name={`variants.${index}.quantity`}
                                  control={form.control}
                                  defaultValue={Number(item.quantity)}
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                {" "}
                                <Controller
                                  render={({ field }) => (
                                    <Input
                                      {...field}
                                      type="number"
                                      placeholder="Value (e.g., M, Red)"
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                    />
                                  )}
                                  name={`variants.${index}.price`}
                                  control={form.control}
                                  defaultValue={Number(item.price)}
                                />{" "}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  onClick={() => remove(index)}
                                  variant="destructive"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};