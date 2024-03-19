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
                onChange={(url) => {
                  form.setValue("images", [...form.watch("images"), { url }]);

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
            <FormDescription>Upload images for your product. </FormDescription>
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
                    ...field.value.filter((current) => current.url !== url),
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
  );
};
