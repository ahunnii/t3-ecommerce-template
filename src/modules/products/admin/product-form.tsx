/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import type {
  Attribute,
  Category,
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
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";
import {
  Table,
  TableBody,
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

import { StringOrTemplateHeader } from "@tanstack/react-table";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { TagInput } from "~/components/ui/tag-input";
import { Textarea } from "~/components/ui/textarea";
import ImageUpload from "~/services/image-upload/components/image-upload";
import { api } from "~/utils/api";
import MarkdownEditor from "../../../components/common/inputs/markdown-editor";
import { SingleProduct } from "../types";

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),

  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  description: z.string().optional(),
  quantity: z.coerce.number().min(1).default(1),

  variants: z.array(
    z.object({
      names: z.string().min(1),
      values: z.string().min(1),
      price: z.coerce.number().min(0),
      quantity: z.coerce.number().min(0),
    })
  ),
  tags: z.array(z.object({ name: z.string(), id: z.string() })),
  materials: z.array(z.object({ name: z.string(), id: z.string() })),

  featuredImage: z.string().min(1),
  shippingCost: z.coerce.number().min(0).optional(),
  shippingType: z.enum([
    "FLAT_RATE" as ShippingType,
    "FREE" as ShippingType,
    "VARIABLE" as ShippingType,
  ]),
  weight: z.coerce.number().min(0).optional(),
  length: z.coerce.number().min(0).optional(),
  width: z.coerce.number().min(0).optional(),
  height: z.coerce.number().min(0).optional(),
  estimatedCompletion: z.coerce.number().min(0).int(),
  productType: z.enum([
    "PHYSICAL" as ProductType,
    "DIGITAL" as ShippingType,
    "SERVICE" as ShippingType,
  ]),
  weight_oz: z.coerce.number().min(0).optional(),
  weight_lb: z.coerce.number().min(0).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;
type ExtendedCategory = Category & { attributes: Attribute[] };
interface ProductFormProps {
  initialData: SingleProduct | null;
  categories: ExtendedCategory[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
}) => {
  const params = useRouter();
  const router = useNavigationRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product." : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = {
    name: initialData?.name ?? "",
    images: initialData?.images ?? [],
    price: initialData?.price ?? 0.0,
    categoryId: initialData?.categoryId ?? undefined,
    description: initialData?.description ?? undefined,
    quantity: initialData?.quantity ?? 1,
    isFeatured: initialData?.isFeatured ?? false,
    isArchived: initialData?.isArchived ?? false,
    variants: initialData?.variants
      ? initialData?.variants?.map((variant) => ({
          values: variant.values,
          price: Number(variant.price),
          names: variant.names,
          quantity: variant.quantity,
        }))
      : [],
    shippingCost: initialData?.shippingCost ?? 0.0,
    shippingType: initialData?.shippingType ?? ("FLAT_RATE" as ShippingType),
    weight: initialData?.weight ?? 0.0,
    length: initialData?.length ?? 0.0,
    width: initialData?.width ?? 0.0,
    height: initialData?.height ?? 0.0,
    estimatedCompletion: initialData?.estimatedCompletion ?? 0,
    tags: initialData?.tags ?? [],
    materials: initialData?.materials ?? [],
    featuredImage: initialData?.featuredImage ?? undefined,
    productType: initialData?.productType ?? ("PHYSICAL" as ProductType),
    weight_oz: (initialData?.weight ?? 0.0) % 16,
    weight_lb: Math.floor((initialData?.weight ?? 0.0) / 16),
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const { categoryId: category, shippingType } = form.watch();

  const apiContext = api.useContext();

  const currentAttributes: Attribute[] =
    categories && category
      ? categories.filter((cat) => cat.id === category)[0]!.attributes
      : [];

  const { mutate: updateProduct } = api.products.updateProduct.useMutation({
    onSuccess: () => {
      router.push(`/admin/${params.query.storeId as string}/products`);
      toast.success(toastMessage);
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error(error);
    },
    onMutate: () => setLoading(true),
    onSettled: async () => {
      setLoading(false);
      await apiContext.products.getProduct.invalidate();
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
        weight: Number(data.weight_oz) + Number(data.weight_lb) * 16,
        storeId: params.query.storeId as string,
        productId: params.query.productId as string,
      });
    } else {
      createProduct({
        ...data,
        weight: Number(data.weight_oz) + Number(data.weight_lb) * 16,
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

    const attributeValues = currentAttributes.map(splitValues);

    const test = cartesianProduct(attributeValues);

    const generatedVariations = test.map((variation) => ({
      names: currentAttributes.map((attribute) => attribute.name).join(", "),
      values: variation.join(", "),
      price: form.getValues("price"),
      quantity: 1,
    }));

    return generatedVariations;
  };

  const { fields, remove, replace } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const [tags, setTags] = useState<{ name: string; id: string }[]>(
    initialData?.tags ?? []
  );

  const [materials, setMaterials] = useState<{ name: string; id: string }[]>(
    initialData?.materials ?? []
  );

  const { setValue } = form;

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
          <section className="flex w-full gap-4 max-lg:flex-col">
            <div className="flex w-full flex-col space-y-4 lg:w-8/12">
              <div className="w-full  rounded-md border border-border bg-background/50 p-4 ">
                <FormLabel>Details</FormLabel>{" "}
                <FormDescription>
                  To start selling, all you need is a name and a price.
                </FormDescription>
                <div className="my-5 gap-8 md:grid md:grid-cols-2 ">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
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
                    name="productType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Type</FormLabel>
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
                                placeholder="Select a type"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={"PHYSICAL"}>Physical</SelectItem>
                            <SelectItem value={"DIGITAL"}>Digital</SelectItem>
                            <SelectItem value={"SERVICE"}>Service</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length === 0 && (
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            {/* <Input
                          type="number"
                          disabled={loading}
                          placeholder="9.99"
                          {...field}
                        /> */}
                            <div className="relative ">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm">
                                  $
                                </span>
                              </div>
                              <Input
                                type="number"
                                disabled={loading}
                                className="block w-full rounded-md py-1.5 pl-7  text-gray-900     sm:text-sm sm:leading-6"
                                placeholder="0.00"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Base price before taxes
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {fields.length !== 0 && (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormDescription>
                        Price is set within variants.
                      </FormDescription>
                    </FormItem>
                  )}

                  {fields.length === 0 && (
                    <>
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
                                min={0}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          {/* <Textarea
                      disabled={loading}
                      placeholder="e.g. This product is a ...."
                      {...field}
                    /> */}

                          <MarkdownEditor
                            description={field.value}
                            onChange={field.onChange}
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
                      <FormItem className="col-span- flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
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
              </div>

              <div className="w-full rounded-md border border-border bg-background/50 p-4 ">
                <FormLabel>Attributes</FormLabel>{" "}
                <FormDescription className="pb-5">
                  Used for searching, SEO, and other info on products.
                </FormDescription>
                <div className="my-5 gap-8 md:grid md:grid-cols-2 ">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem className="col-span-full flex flex-col items-start">
                        <FormLabel className="text-left">Tags</FormLabel>
                        <FormControl>
                          <TagInput
                            {...field}
                            placeholder="Enter a topic"
                            tags={tags}
                            className="sm:min-w-[450px]"
                            setTags={(newTags) => {
                              setTags(newTags);
                              setValue("tags", newTags as [Tag, ...Tag[]]);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Anything you want to associate this product with?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="materials"
                    render={({ field }) => (
                      <FormItem className="col-span-full flex flex-col items-start">
                        <FormLabel className="text-left">Materials</FormLabel>
                        <FormControl>
                          <TagInput
                            {...field}
                            placeholder="Enter a topic"
                            tags={materials}
                            className="sm:min-w-[450px]"
                            setTags={(newTags) => {
                              setMaterials(newTags);
                              setValue("materials", newTags as [Tag, ...Tag[]]);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          What is your item made out of?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="w-full rounded-md border border-border bg-background/50 p-4 ">
                <FormField
                  control={form.control}
                  name="variants"
                  render={({ field }) => (
                    <>
                      <FormLabel>Variations</FormLabel>{" "}
                      <FormDescription>
                        Create variations for customers to choose from. Note
                        that these will override your default values above.
                      </FormDescription>
                      {category === undefined ? (
                        <p className="leading-7 text-primary [&:not(:first-child)]:mt-6">
                          Choose a category first
                        </p>
                      ) : (
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
                      )}
                      {field.value.length > 0 && (
                        <div className="my-5 max-h-96 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {/* <TableHead className="w-[100px]">ID</TableHead> */}
                                {currentAttributes.length > 0 &&
                                  currentAttributes
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
                                          placeholder="Attribute (e.g., Size)"
                                          onChange={(e) =>
                                            field.onChange(
                                              Number(e.target.value)
                                            )
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
                                            field.onChange(
                                              Number(e.target.value)
                                            )
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
              <div className="w-full  rounded-md border border-border bg-background/50 p-4 ">
                {" "}
                <FormLabel>Shipping</FormLabel>{" "}
                <FormDescription className="pb-5">
                  Measurements and weight are used to calculate shipping rates.
                  Measurements are in inches.
                </FormDescription>
                <div className="my-5 gap-8 md:grid md:grid-cols-2 ">
                  <FormField
                    control={form.control}
                    name="estimatedCompletion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Completion</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={loading}
                            placeholder="e.g 48"
                            min={0}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          In days, roughly how long would it take you to make &
                          ship out the product?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shippingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipping Type</FormLabel>
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
                            <SelectItem value={"FLAT_RATE"}>
                              Flat Rate
                            </SelectItem>
                            <SelectItem value={"FREE"}>
                              Free Shipping
                            </SelectItem>
                            <SelectItem value={"VARIABLE"}>
                              Calculate at Shipping
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {shippingType === "FLAT_RATE" && (
                    <FormField
                      control={form.control}
                      name="shippingCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Handling Fees</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              disabled={loading}
                              placeholder="1"
                              min={0}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Optional: Are there any additional fees needing to
                            be paid to ship this item out? Defaults to $0
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="gap- flex">
                    <FormField
                      control={form.control}
                      name="weight_lb"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (g):</FormLabel>
                          <FormControl>
                            <>
                              <div className="relative ">
                                <Input
                                  type="number"
                                  disabled={loading}
                                  className="block w-full rounded-md py-1.5 pr-7  text-gray-900     sm:text-sm sm:leading-6"
                                  placeholder="0.00"
                                  {...field}
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                  <span className="text-gray-500 sm:text-sm">
                                    lb
                                  </span>
                                </div>
                              </div>
                            </>
                          </FormControl>
                          <FormDescription>
                            Weight of item in grams (excluding packaging)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight_oz"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight:</FormLabel>
                          <FormControl>
                            <>
                              <div className="relative ">
                                {/* <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">
                                $
                              </span>
                            </div> */}
                                <Input
                                  type="number"
                                  disabled={loading}
                                  className="block w-full rounded-md py-1.5 pr-7  text-gray-900     sm:text-sm sm:leading-6"
                                  placeholder="0.00"
                                  {...field}
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                  <span className="text-gray-500 sm:text-sm">
                                    oz
                                  </span>
                                </div>
                              </div>
                            </>
                          </FormControl>
                          <FormDescription>
                            Weight of item in grams (excluding packaging)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="gap-8 md:grid md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="length"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Length:</FormLabel>
                          <FormControl>
                            <>
                              <div className="relative ">
                                <Input
                                  type="number"
                                  disabled={loading}
                                  className="block w-full rounded-md py-1.5 pr-7  text-gray-900     sm:text-sm sm:leading-6"
                                  placeholder="0.00"
                                  {...field}
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                  <span className="text-gray-500 sm:text-sm">
                                    in
                                  </span>
                                </div>
                              </div>
                            </>
                          </FormControl>
                          {/* <FormDescription>
                          Weight of item in grams (excluding packaging)
                        </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Width:</FormLabel>
                          <FormControl>
                            <>
                              <div className="relative ">
                                <Input
                                  type="number"
                                  disabled={loading}
                                  className="block w-full rounded-md py-1.5 pr-7  text-gray-900     sm:text-sm sm:leading-6"
                                  placeholder="0.00"
                                  {...field}
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                  <span className="text-gray-500 sm:text-sm">
                                    in
                                  </span>
                                </div>
                              </div>
                            </>
                          </FormControl>
                          {/* <FormDescription>
                          Weight of item in grams (excluding packaging)
                        </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />{" "}
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height:</FormLabel>
                          <FormControl>
                            <>
                              <div className="relative ">
                                <Input
                                  type="number"
                                  disabled={loading}
                                  className="block w-full rounded-md py-1.5 pr-7  text-gray-900     sm:text-sm sm:leading-6"
                                  placeholder="0.00"
                                  {...field}
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                  <span className="text-gray-500 sm:text-sm">
                                    in
                                  </span>
                                </div>
                              </div>
                            </>
                          </FormControl>
                          {/* <FormDescription>
                        Weight of item in grams (excluding packaging)
                      </FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col lg:w-4/12">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media</FormLabel>
                    <FormDescription>
                      Upload images for your product.{" "}
                    </FormDescription>
                    <FormControl>
                      {/* <>
                    {!initialData?.images && <ImageLoader />} */}
                      <ImageUpload
                        value={field.value.map((image) => image.url)}
                        disabled={loading}
                        onChange={(url) => {
                          return field.onChange([...field.value, { url }]);
                        }}
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter(
                              (current) => current.url !== url
                            ),
                          ])
                        }
                      />
                      {/* </> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="featuredImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image</FormLabel>{" "}
                    <FormDescription>
                      Used to represent your product during checkout, social
                      sharing and more.
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
                        onRemove={() => form.setValue("featuredImage", "")}
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
