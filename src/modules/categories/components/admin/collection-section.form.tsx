import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import { Input } from "~/components/ui/input";

import { EditSection } from "~/components/common/sections/edit-section.admin";

import { Textarea } from "~/components/ui/textarea";
import ImageUpload from "~/services/image-upload/components/image-upload";

import type { CategoryFormValues } from "../../types";

export const CollectionSection = ({
  form,
  loading,
}: {
  form: UseFormReturn<CategoryFormValues>;
  loading: boolean;
}) => {
  return (
    <EditSection
      title="Collection"
      description="Automatically create a collection based on this category."
      bodyClassName="space-y-4"
      className="h-fit w-full xl:w-4/12"
    >
      <>
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail</FormLabel>{" "}
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
              <FormDescription>
                Used to represent your collection to your customers
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alt Description (optional)</FormLabel>{" "}
              <FormControl>
                <Input
                  disabled={loading}
                  placeholder="e.g. A black t-shirt on a white background."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief description of the image, used for accessability
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>{" "}
              <FormControl>
                <Textarea
                  disabled={loading}
                  placeholder="e.g. Summer is here! Get your summer essentials now!"
                  {...field}
                />
              </FormControl>{" "}
              <FormDescription>
                Used for the collection&apos;s SEO. Make it short and sweet, but
                descriptive. Search engines love keywords!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    </EditSection>
  );
};
