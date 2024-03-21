import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductStatus,
  ProductType,
  type Attribute,
  type Category,
} from "@prisma/client";

import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";

import { Form } from "~/components/ui/form";
import { AlertModal } from "~/modules/admin/components/modals/alert-modal";

import type { TRPCError } from "@trpc/server";
import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";

import { SearchEnginePreview } from "~/components/common/admin/search-engine-preview";

import { toastService } from "~/services/toast";
import { api } from "~/utils/api";

import { uniqueId } from "lodash";
import { Archive, Boxes, Eye, PencilLine } from "lucide-react";
import { EditSection } from "~/components/common/sections/edit-section.admin";
import { cn } from "~/utils/styles";
import { productFormSchema } from "../../schema";
import type { ProductFormValues, SingleProduct } from "../../types";
import { AttributeSection } from "../admin-form/attributes-section.form";
import { MediaSection } from "../admin-form/media-section.form";
import { ProductDetailsSection } from "../admin-form/product-details-section.form";
import { ShippingSection } from "../admin-form/shipping-section.form";
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
    slug: initialData?.slug ?? "",
    images: initialData?.images.map((image) => image.url) ?? [],
    price: initialData?.price ?? 0.0,
    categoryId: initialData?.categoryId ?? undefined,
    description: initialData?.description ?? "",
    quantity: initialData?.quantity ?? 1,
    isFeatured: initialData?.isFeatured ?? false,

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

    weight: initialData?.weight ?? 0.0,
    length: initialData?.length ?? 0.0,
    width: initialData?.width ?? 0.0,
    height: initialData?.height ?? 0.0,
    estimatedCompletion: initialData?.estimatedCompletion ?? 0,
    tags: initialData?.tags.map((tag) => ({ id: uniqueId(), name: tag })) ?? [],
    materials:
      initialData?.materials.map((material) => ({
        id: uniqueId(),
        name: material,
      })) ?? [],
    featuredImage: initialData?.featuredImage ?? undefined,
    type: ProductType.PHYSICAL,
    status: initialData?.status ?? ProductStatus.DRAFT,
    weight_oz: (initialData?.weight ?? 0.0) % 16,
    weight_lb: Math.floor((initialData?.weight ?? 0.0) / 16),
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const apiContext = api.useContext();

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

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          onChange={() => console.log(form.watch("images"))}
        >
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
            <div className=" flex w-full flex-col space-y-4 xl:w-8/12">
              <ProductDetailsSection
                {...{
                  loading,
                  categories,
                  form,
                  initialCategoryId: form.watch("categoryId") ?? "",
                }}
              />
              <SearchEnginePreview
                name={form.watch("name")}
                slug={form.watch("slug")}
                description={form.watch("description")}
                type="products"
              />

              <AttributeSection
                form={form}
                initialTags={initialData?.tags ?? []}
                initialMaterials={initialData?.materials ?? []}
              />
              <VariantProductFormSection form={form} categories={categories} />

              <ShippingSection form={form} loading={loading} />
            </div>

            <div className="flex w-full flex-col space-y-8 xl:w-4/12">
              <EditSection
                title="Product Status"
                description="Manage the visibility and availability of your product."
              >
                <div
                  onClick={() => form.setValue("status", ProductStatus.DRAFT)}
                  className={cn(
                    "-mx-2 flex cursor-pointer items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground",
                    form.watch("status") === "DRAFT" &&
                      " bg-accent text-accent-foreground "
                  )}
                >
                  <PencilLine className="mt-px h-5 w-5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Draft</p>
                    <p className="text-sm text-muted-foreground">
                      Edit your product without publishing. Only visible to you.
                    </p>
                  </div>
                </div>
                <div
                  onClick={() => form.setValue("status", ProductStatus.ACTIVE)}
                  className={cn(
                    "-mx-2 flex cursor-pointer items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground",
                    form.watch("status") === "ACTIVE" &&
                      " bg-accent text-accent-foreground "
                  )}
                >
                  <Eye className="mt-px h-5 w-5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Active</p>
                    <p className="text-sm text-muted-foreground">
                      Your customers can see and buy your product.
                    </p>
                  </div>
                </div>
                <div
                  onClick={() =>
                    form.setValue("status", ProductStatus.ARCHIVED)
                  }
                  className={cn(
                    "-mx-2 flex cursor-pointer items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground",
                    form.watch("status") === "ARCHIVED" &&
                      " bg-accent text-accent-foreground "
                  )}
                >
                  <Archive className="mt-px h-5 w-5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Archived</p>
                    <p className="text-sm text-muted-foreground">
                      The product is no longer available for purchase.
                    </p>
                  </div>
                </div>
                <div
                  onClick={() => form.setValue("status", ProductStatus.CUSTOM)}
                  className={cn(
                    "-mx-2 flex cursor-pointer items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground",
                    form.watch("status") === "CUSTOM" &&
                      " bg-accent text-accent-foreground "
                  )}
                >
                  <Boxes className="mt-px h-5 w-5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Custom Product
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Product not available to the general public, accessible
                      via a direct link.
                    </p>
                  </div>
                </div>
              </EditSection>
              <MediaSection form={form} loading={loading} />
            </div>
          </AdminFormBody>
        </form>
      </Form>
    </>
  );
};
