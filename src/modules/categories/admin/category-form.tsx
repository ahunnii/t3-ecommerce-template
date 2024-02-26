import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Attribute, Billboard, Category } from "@prisma/client";
import { Trash } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import * as z from "zod";

import { AlertModal } from "~/components/admin/modals/alert-modal";
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

import { BackToButton } from "~/components/common/buttons/back-to-button";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";

const formSchema = z.object({
  name: z.string().min(2),
  billboardId: z.string(),
  attributes: z.array(
    z.object({
      name: z.string().min(2),
      values: z.string().min(2),
    })
  ),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData:
    | (Category & {
        attributes: Attribute[];
      })
    | null;
  billboards: Billboard[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {
  const params = useRouter();
  const router = useNavigationRouter();
  const apiContext = api.useContext();

  const { storeId, categoryId } = params.query as {
    storeId: string;
    categoryId: string;
  };

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit category" : "Create category";
  const description = initialData ? "Edit a category." : "Add a new category";
  const toastMessage = initialData ? "Category updated." : "Category created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      billboardId: initialData?.billboardId ?? undefined,
      attributes: initialData?.attributes ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const { mutate: updateCategory } = api.categories.updateCategory.useMutation({
    onSuccess: () => toastService.success(toastMessage),
    onError: (error) =>
      toastService.error(
        "Something went wrong with updating the category.",
        error
      ),
    onMutate: () => setLoading(true),
    onSettled: () => {
      setLoading(false);
      router.push(`/admin/${storeId}/categories`);
      void apiContext.categories.invalidate();
    },
  });

  const { mutate: createCategory } = api.categories.createCategory.useMutation({
    onSuccess: () => toastService.success(toastMessage),
    onError: (error) =>
      toastService.error(
        "Something went wrong with creating the category.",
        error
      ),
    onMutate: () => setLoading(true),
    onSettled: () => {
      setLoading(false);
      router.push(`/admin/${storeId}/categories`);
      void apiContext.categories.invalidate();
    },
  });

  const { mutate: deleteCategory } = api.categories.deleteCategory.useMutation({
    onSuccess: () => toastService.success("Category was successfully deleted."),
    onError: (error) =>
      toastService.error(
        "Make sure you remove all products using this category first before deleting.",
        error
      ),
    onMutate: () => setLoading(true),
    onSettled: () => {
      setLoading(false);
      setOpen(false);
      router.push(`/admin/${storeId}/categories`);
      void apiContext.categories.invalidate();
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
    if (initialData) {
      updateCategory({
        storeId,
        categoryId,
        billboardId: data?.billboardId ?? "",
        name: data.name,
        attributes: data.attributes.map((attribute) => ({
          ...attribute,
          storeId: params?.query?.storeId as string,
        })),
      });
    } else {
      createCategory({
        storeId,
        name: data.name,
        billboardId: data?.billboardId ?? "",
        attributes: data.attributes.map((attribute) => ({
          ...attribute,
          storeId: params?.query?.storeId as string,
        })),
      });
    }
  };

  const onDelete = () => {
    deleteCategory({
      categoryId: params?.query?.categoryId as string,
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
      <BackToButton
        link={`/admin/${storeId}/categories/${categoryId ?? ""}`}
        title="Back to Category"
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
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-2">
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
                  </Select>{" "}
                  <FormDescription>
                    Image associated with this category. Used in category pages.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>{" "}
          <div className="flex flex-col space-y-3">
            <FormLabel>Attributes</FormLabel>
            <FormDescription>
              Attributes are common product types associated with this category.
              Add attributes to quickly make variants of your products. I.E.
              sizes, colors, materials, etc.{" "}
              <strong>
                Note: Variant values are a single string separated by a
                semicolon.(S;M;L;XL){" "}
              </strong>
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
                  Remove
                </Button>
              </div>
            ))}

            <Button
              onClick={() => append({ name: "", values: "" })}
              type="button"
              className="w-max"
            >
              Add Attribute
            </Button>
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
