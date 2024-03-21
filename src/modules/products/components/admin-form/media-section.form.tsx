import type { UseFormReturn } from "react-hook-form";
import { EditSection } from "~/components/common/sections/edit-section.admin";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import ImageUpload from "~/services/image-upload/components/image-upload";
import type { ProductFormValues } from "../../types";
export const MediaSection = ({
  form,
  loading,
}: {
  form: UseFormReturn<ProductFormValues>;
  loading: boolean;
}) => {
  const handleOnMediaDelete = (url: string) => {
    console.log(url);
    form.setValue("images", [
      ...form.watch("images").filter((current) => current !== url),
    ]);

    if (form.watch("featuredImage") === url) {
      form.setValue("featuredImage", "");
    }

    form.watch("variants").forEach((variant, idx) => {
      if (variant.imageUrl === url) {
        form.setValue(`variants.${idx}.imageUrl`, "");
      }
    });
  };
  return (
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
              Used to represent your product during checkout, social sharing and
              more.
            </FormDescription>
            <FormControl>
              <ImageUpload
                value={field.value ? [field.value] : []}
                disabled={loading}
                maxFiles={1}
                selectPreviousImages={true}
                folder="products"
                onChange={(url) => {
                  form.setValue("images", [
                    ...new Set([...form.watch("images"), url]),
                  ]);
                  field.onChange(url);
                  return field.onChange(url);
                }}
                onBulkChange={(urls) => {
                  if (urls?.length > 0 && urls[0]) {
                    form.setValue("images", [
                      ...new Set([...form.watch("images"), urls[0]]),
                    ]);
                    return field.onChange(urls[0]);
                  }
                }}
                onRemove={() => form.setValue("featuredImage", "")}
                onMediaDelete={handleOnMediaDelete}
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
            <FormDescription>Upload images for your product.</FormDescription>
            <FormControl>
              <ImageUpload
                value={field.value}
                disabled={loading}
                maxFiles={10}
                folder="products"
                selectPreviousImages={true}
                onChange={(url) => {
                  return field.onChange([...new Set([...field.value, url])]);
                }}
                onBulkChange={(urls) => {
                  return field.onChange([
                    ...new Set([...field.value, ...urls]),
                  ]);
                }}
                onRemove={(url) =>
                  field.onChange([
                    ...field.value.filter((current) => current !== url),
                  ])
                }
                onMediaDelete={handleOnMediaDelete}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EditSection>
  );
};
