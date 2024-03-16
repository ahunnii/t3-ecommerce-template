import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { Plus, Trash } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

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
import ImageUpload from "~/services/image-upload/components/image-upload";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";
import { categoryFormSchema } from "../../schema";
import type { Category, CategoryFormValues } from "../../types";

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
      attributes: initialData?.attributes ?? [],
      description: initialData?.description ?? "",

      imageUrl: initialData?.collection?.image?.url ?? undefined,
      alt: initialData?.collection?.image?.alt ?? undefined,

      createNewCollection: initialData?.collection?.id ? true : false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
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
        <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
          <AdminFormHeader
            title={title}
            description={description}
            contentName="Category"
            link={`/admin/${storeId}/categories/${categoryId ?? ""}`}
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
                description="Assign basic info about the category"
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
                          placeholder="Category name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </EditSection>

              <EditSection
                title="Attributes"
                description=" Attributes are common product types associated with this
                category. Add attributes to quickly make variants of your
                products. I.E. sizes, colors, materials, etc."
                bodyClassName="space-y-4"
              >
                <FormDescription className="flex w-full gap-2">
                  <span className="w-3/5 font-bold">
                    Note: Variant values are a single string separated by a
                    semicolon.(S;M;L;XL){" "}
                  </span>

                  <Button
                    onClick={() => append({ name: "", values: "" })}
                    type="button"
                    className="w-2/5 gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Add New
                  </Button>
                </FormDescription>

                {fields.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <Controller
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Attribute (e.g., Size, Color)"
                        />
                      )}
                      name={`attributes.${index}.name`}
                      control={form.control}
                      defaultValue={item.name}
                    />

                    <Controller
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="String of values i.e. S;M;L;XL"
                        />
                      )}
                      name={`attributes.${index}.values`}
                      control={form.control}
                      defaultValue={item.values}
                    />

                    <Button
                      onClick={() => remove(index)}
                      variant="destructive"
                      type="button"
                    >
                      <Trash className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </EditSection>
            </div>
            <div className="flex w-4/12">
              <EditSection
                title="Collection"
                description="Automatically create a collection based on this category."
                bodyClassName="space-y-4"
              >
                {form.watch("createNewCollection") && (
                  <>
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Featured Image</FormLabel>{" "}
                          <FormDescription>
                            Used to represent your product during checkout,
                            social sharing and more.
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
                  </>
                )}

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
            </div>
          </AdminFormBody>{" "}
        </form>
      </Form>
    </>
  );
};