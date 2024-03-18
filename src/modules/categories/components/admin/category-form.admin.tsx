import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

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
import { AlertModal } from "~/modules/admin/components/modals/alert-modal";

import { Input } from "~/components/ui/input";

import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";

import { EditSection } from "~/components/common/sections/edit-section.admin";

import { Checkbox } from "~/components/ui/checkbox";

import { toastService } from "~/services/toast";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";
import { categoryFormSchema } from "../../schema";
import type { Category, CategoryFormValues } from "../../types";
import { AttributeSection } from "./attributes-section.form";
import { CollectionSection } from "./collection-section.form";

type Props = {
  initialData: Category | null;
};

export const CategoryForm: React.FC<Props> = ({ initialData }) => {
  const params = useRouter();
  const router = useNavigationRouter();
  const apiContext = api.useContext();

  const { storeId, categoryId } = params.query as {
    storeId: string;
    categoryId: string;
  };

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit category" : "Create category";
  const description = initialData ? "Edit a category." : "Add a new category";
  const toastMessage = initialData ? "Category updated." : "Category created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      attributes:
        initialData?.attributes.map((attribute) => ({
          ...attribute,
          values: attribute.values.split(";").map((val) => ({ content: val })),
        })) ?? [],
      description: initialData?.description ?? "",

      imageUrl: initialData?.collection?.image?.url ?? undefined,
      alt: initialData?.collection?.image?.alt ?? undefined,

      createNewCollection: initialData?.collection?.id ? true : false,
    },
  });

  const updateCategory = api.categories.updateCategory.useMutation({
    onSuccess: () => toastService.success(toastMessage),
    onError: (error) =>
      toastService.error(
        "Something went wrong with updating the category.",
        error
      ),

    onSettled: () => {
      router.push(`/admin/${storeId}/categories`);
      void apiContext.categories.invalidate();
    },
  });

  const createCategory = api.categories.createCategory.useMutation({
    onSuccess: () => toastService.success(toastMessage),
    onError: (error: unknown) =>
      toastService.error(
        "Something went wrong with creating the category.",
        error
      ),

    onSettled: () => {
      router.push(`/admin/${storeId}/categories`);
      void apiContext.categories.invalidate();
    },
  });

  const deleteCategory = api.categories.deleteCategory.useMutation({
    onSuccess: () => toastService.success("Category was successfully deleted."),
    onError: (error: unknown) =>
      toastService.error(
        "Make sure you remove all products using this category first before deleting.",
        error
      ),
    onSettled: () => {
      setOpen(false);
      router.push(`/admin/${storeId}/categories`);
      void apiContext.categories.invalidate();
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
    if (initialData) {
      updateCategory.mutate({
        ...data,
        categoryId,
        attributes: data.attributes.map((attribute) => ({
          ...attribute,
          storeId,
        })),
      });
    } else {
      createCategory.mutate({
        storeId,
        ...data,
        attributes: data.attributes.map((attribute) => ({
          ...attribute,
          storeId,
        })),
      });
    }
  };

  const onDelete = () => deleteCategory.mutate({ categoryId });

  const loading =
    updateCategory.isLoading ||
    createCategory.isLoading ||
    deleteCategory.isLoading;

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
            contentName="Categories"
            link={`/admin/${storeId}/categories`}
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
            <div
              className={cn(
                "flex w-full flex-col space-y-4 ",
                form.watch("createNewCollection") && "xl:w-8/12"
              )}
            >
              <EditSection
                title="Details"
                description="Assign basic info about the category"
                headerClassName={cn(
                  !form.watch("createNewCollection") && "xl:w-4/12"
                )}
                bodyClassName={cn(
                  "space-y-8 ",
                  !form.watch("createNewCollection") && "xl:w-8/12 mt-0"
                )}
                className={cn(
                  !form.watch("createNewCollection") &&
                    "flex flex-col justify-between gap-8 xl:flex-row"
                )}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="lg:max-w-sm">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Category name"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Tip: This represents a type of product, so make sure it
                        has a name that fits
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {initialData?.collection ? (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={true} disabled />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Create a new collection</FormLabel>
                      <FormDescription>
                        You already have a collection associated with this
                        category.
                      </FormDescription>
                    </div>
                  </FormItem>
                ) : (
                  <FormField
                    control={form.control}
                    name="createNewCollection"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Create a new collection</FormLabel>
                          <FormDescription>
                            Checking this will create a new collection based on
                            this category. It will also automatically add any
                            products you tag with the category to the
                            collection.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                )}
              </EditSection>
              <EditSection
                title="Attributes (optional)"
                description=" Attributes are common product types associated with this
    category. Add attributes to quickly make variants of your
    products. I.E. sizes, colors, materials, etc."
                headerClassName={cn(
                  !form.watch("createNewCollection") && "xl:w-4/12"
                )}
                bodyClassName={cn(
                  "space-y-8 ",
                  !form.watch("createNewCollection") && "xl:w-8/12 mt-0"
                )}
                className={cn(
                  !form.watch("createNewCollection") &&
                    " flex flex-col justify-between gap-8 xl:flex-row"
                )}
              >
                <AttributeSection form={form} />{" "}
              </EditSection>
            </div>

            {form.watch("createNewCollection") && (
              <CollectionSection form={form} loading={loading} />
            )}
          </AdminFormBody>{" "}
        </form>
      </Form>
    </>
  );
};
