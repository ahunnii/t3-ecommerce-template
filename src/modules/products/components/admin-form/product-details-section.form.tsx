import { EditSection } from "~/components/common/sections/edit-section.admin";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import type { Prisma } from "@prisma/client";
import { useState } from "react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import MarkdownEditor from "~/components/common/inputs/markdown-editor";
import { Checkbox } from "~/components/ui/checkbox";
import type { ProductFormValues } from "../../types";
export const ProductDetailsSection = ({
  form,
  loading,
  initialCategoryId,
  categories,
}: {
  form: UseFormReturn<ProductFormValues>;
  loading: boolean;
  initialCategoryId: string;
  categories: Prisma.CategoryGetPayload<{ include: { attributes: true } }>[];
}) => {
  const [onCategoryOpen, setOnCategoryOpen] = useState<boolean>(false);
  const [handleOnClick, setHandleOnClick] = useState<() => void>(() => void 0);

  const { fields } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  return (
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
                        form.setValue("categoryId", initialCategoryId)
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
                      <span className="text-gray-500 sm:text-sm">$</span>
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
                <FormDescription>Base price before taxes</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {fields.length !== 0 && (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormDescription>Price is set within variants.</FormDescription>
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
  );
};
