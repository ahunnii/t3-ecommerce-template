import { uniqueId } from "lodash";
import { useState } from "react";
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
import { type Tag, TagInput } from "~/components/ui/tag-input";
import type { ProductFormValues } from "../../types";

type Props = {
  form: UseFormReturn<ProductFormValues>;
  initialTags: string[];
  initialMaterials: string[];
};

export const AttributeSection = ({
  form,
  initialTags,
  initialMaterials,
}: Props) => {
  const [tags, setTags] = useState<{ name: string; id: string }[]>(
    initialTags.map((tag) => ({ name: tag, id: uniqueId() }))
  );

  const [materials, setMaterials] = useState<{ name: string; id: string }[]>(
    initialMaterials.map((tag) => ({ name: tag, id: uniqueId() }))
  );

  return (
    <EditSection
      title="Attributes"
      description="Used to help customers find your product in search as well as provide additional information about your product."
      bodyClassName="space-y-4"
    >
      <div className="my-5 gap-8 md:grid md:grid-cols-2 ">
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="col-span-full flex flex-col items-start">
              <FormLabel className="text-left">Tags (optional)</FormLabel>
              <FormControl>
                <TagInput
                  {...field}
                  placeholder="Enter a word or short phrase and press enter"
                  tags={tags}
                  className="sm:min-w-[450px]"
                  setTags={(newTags) => {
                    setTags(newTags);
                    form.setValue("tags", newTags as [Tag, ...Tag[]]);
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
              <FormLabel className="text-left">Materials (optional)</FormLabel>
              <FormControl>
                <TagInput
                  {...field}
                  placeholder="Enter a material and press enter"
                  tags={materials}
                  className="sm:min-w-[450px]"
                  setTags={(newTags) => {
                    setMaterials(newTags);
                    form.setValue("materials", newTags as [Tag, ...Tag[]]);
                  }}
                />
              </FormControl>
              <FormDescription>What is your item made out of?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </EditSection>
  );
};
