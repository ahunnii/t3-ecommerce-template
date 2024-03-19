/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import type {
  Attribute,
  Category,
  ProductType,
  ShippingType,
  Tag,
} from "@prisma/client";

import { Trash } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

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
import { AlertModal } from "~/modules/admin/components/modals/alert-modal";

// import ImageLoader from "~/components/ui/image-loader";

import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { TagInput } from "~/components/ui/tag-input";

import { TRPCError } from "@trpc/server";
import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";
import { EditSection } from "~/components/common/sections/edit-section.admin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import ImageUpload from "~/services/image-upload/components/image-upload";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";
import MarkdownEditor from "../../../../components/common/inputs/markdown-editor";
import { productFormSchema } from "../../schema";
import type { ProductFormValues, SingleProduct } from "../../types";
import { VariantProductFormSection } from "./variant-section.form";
type ExtendedCategory = Category & { attributes: Attribute[] };
type Props = {
  initialData: SingleProduct | null;
  categories: ExtendedCategory[];
};

export const ProductForm: React.FC<Props> = ({ initialData, categories }) => {
  const params = useRouter();
  const router = useNavigationRouter();

  const { storeId, productId } = params.query as {
    storeId: string;
    productId: string;
  };

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product." : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = {
    name: initialData?.name ?? "",
    images: initialData?.images ?? [],
    price: initialData?.price ?? 0.0,
    categoryId: initialData?.categoryId ?? undefined,
    description: initialData?.description ?? "",
    quantity: initialData?.quantity ?? 1,
    isFeatured: initialData?.isFeatured ?? false,
    isArchived: initialData?.isArchived ?? false,
    variants: initialData?.variants
      ? initialData?.variants?.map((variant) => ({
          values: variant.values,
          price: Number(variant.price),
          names: variant.names,
          quantity: variant.quantity,
          imageUrl: variant?.imageUrl ?? undefined,
          sku: variant?.sku ?? "",
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
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });
  const { categoryId: category, shippingType } = form.watch();

  const apiContext = api.useContext();

  const currentAttributes: Attribute[] =
    categories && category
      ? categories.filter((cat) => cat.id === category)[0]!.attributes
      : [];

  const updateProduct = api.products.updateProduct.useMutation({
    onSuccess: () => {
      toastService.success(toastMessage);
      router.push(`/admin/${storeId}/products`);
    },
    onError: (error: unknown) =>
      toastService.error(
        (error as TRPCError).message,
        // "Something went wrong with updating the product",
        error
      ),
    onSettled: () => {
      void apiContext.products.getProduct.invalidate();
    },
  });

  const createProduct = api.products.createProduct.useMutation({
    onSuccess: () => {
      toastService.success(toastMessage);
      router.push(`/admin/${storeId}/products`);
    },
    onError: (error: unknown) =>
      toastService.error(
        "Something went wrong with creating the product",
        error
      ),
    onSettled: () => {
      void apiContext.products.invalidate();
    },
  });

  const deleteProduct = api.products.deleteProduct.useMutation({
    onSuccess: () => {
      toastService.success("Product was successfully deleted");
      router.push(`/admin/${storeId}/products`);
    },
    onError: (error: unknown) =>
      toastService.error(
        "Something went wrong with deleting the product",
        error
      ),
    onSettled: () => {
      setOpen(false);

      void apiContext.products.invalidate();
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    if (initialData) {
      updateProduct.mutate({
        ...data,
        weight: Number(data.weight_oz) + Number(data.weight_lb) * 16,
        storeId,
        productId,
      });
    } else {
      createProduct.mutate({
        ...data,
        weight: Number(data.weight_oz) + Number(data.weight_lb) * 16,
        storeId,
      });
    }
  };

  const onDelete = () => deleteProduct.mutate({ productId });

  const loading =
    updateProduct.isLoading ||
    createProduct.isLoading ||
    deleteProduct.isLoading;

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
  const [onCategoryOpen, setOnCategoryOpen] = useState(false);
  const [handleOnClick, setHandleOnClick] = useState<() => void>(() => void 0);
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
      <Form {...form}>
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
          <AdminFormHeader
            title={title}
            description={description}
            contentName="Products"
            link={`/admin/${storeId}/products`}
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
              <EditSection
                title="Details"
                description="To start selling, all you need is a name and a price."
                bodyClassName="space-y-4"
              >
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
                        <AlertDialog
                          open={onCategoryOpen}
                          onOpenChange={setOnCategoryOpen}
                        >
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action will wipe out existing variants.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() =>
                                  form.setValue(
                                    "categoryId",
                                    initialData?.categoryId ?? ""
                                  )
                                }
                                type="button"
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  if (handleOnClick) {
                                    handleOnClick();
                                  }
                                }}
                                type="button"
                              >
                                {" "}
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Select
                          disabled={loading}
                          onValueChange={(e) => {
                            setOnCategoryOpen(true);
                            setHandleOnClick(() => {
                              field.onChange(e);
                              form.setValue("variants", []);
                            });
                          }}
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
              </EditSection>

              <EditSection
                title="Attributes"
                description=" Used for searching, SEO, and other info on products."
                bodyClassName="space-y-4"
              >
                <div className="my-5 gap-8 md:grid md:grid-cols-2 ">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem className="col-span-full flex flex-col items-start">
                        <FormLabel className="text-left">
                          Tags (optional)
                        </FormLabel>
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
                        <FormLabel className="text-left">
                          Materials (optional)
                        </FormLabel>
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
              </EditSection>
              <VariantProductFormSection form={form} categories={categories} />
              <EditSection
                title="Shipping"
                description=" Measurements and weight are used to calculate shipping rates.  Measurements are in inches."
              >
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

                  <div className="flex flex-col justify-center">
                    <FormLabel>Weight (g):</FormLabel>
                    <div className="flex">
                      <FormField
                        control={form.control}
                        name="weight_lb"
                        render={({ field }) => (
                          <FormItem>
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

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="weight_oz"
                        render={({ field }) => (
                          <FormItem>
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
                                      oz
                                    </span>
                                  </div>
                                </div>
                              </>
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormDescription>
                      Weight of item in grams (excluding packaging)
                    </FormDescription>
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
              </EditSection>
            </div>
            <div className="flex w-full flex-col space-y-8 lg:w-4/12">
              <EditSection
                title="Media"
                description="Upload images for your product."
                bodyClassName="space-y-4"
              >
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
                        <ImageUpload
                          value={field.value ? [field.value] : []}
                          disabled={loading}
                          onChange={(url) => {
                            form.setValue("images", [
                              ...form.watch("images"),
                              { url },
                            ]);

                            field.onChange(url);
                            return field.onChange(url);
                          }}
                          onRemove={() => form.setValue("featuredImage", "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Images and Vids</FormLabel>
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
                />
              </EditSection>
            </div>
          </AdminFormBody>
        </form>
      </Form>
    </>
  );
};
