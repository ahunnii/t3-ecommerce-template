import { Trash } from "lucide-react";
import { useMemo, type FC } from "react";
import type { UseFormReturn } from "react-hook-form";

import { EditSection } from "~/components/common/sections/edit-section.admin";
import { Button } from "~/components/ui/button";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import Image from "next/image";
import MarkdownEditor from "~/components/common/inputs/markdown-editor";
import ImageUpload from "~/services/image-upload/components/image-upload";

import { cn } from "~/utils/styles";
import type { SettingsFormValues } from "./types";

type Props = {
  form: UseFormReturn<SettingsFormValues>;
};

export const ContentSectionForm: FC<Props> = ({ form }) => {
  const formErrors = form.formState.errors;

  const checkIfFormHasErrors = useMemo(() => {
    const keys = ["content.aboutPage"];

    const hasErrors = keys.some(
      (key) => formErrors[key as keyof typeof formErrors]
    );
    return hasErrors;
  }, [formErrors]);

  return (
    <EditSection
      title="Site Content"
      hasError={checkIfFormHasErrors}
      description="Manage your site content and pages"
      bodyClassName=""
    >
      <div className="flex items-start gap-4">
        <FormField
          control={form.control}
          name="content.aboutPage"
          render={({ field }) => (
            <FormItem className="w-full lg:w-4/6">
              <FormLabel>About Page</FormLabel>
              <FormControl>
                <MarkdownEditor
                  description={field.value}
                  onChange={field.onChange}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="content.heroImg"
          render={({ field }) => (
            <FormItem className="w-full lg:w-2/6">
              <FormLabel>Hero Image</FormLabel>{" "}
              <FormControl>
                <>
                  {form.watch("content.heroImg") && (
                    <div
                      className={cn(
                        " relative aspect-video overflow-hidden rounded-md"
                      )}
                    >
                      <div className="absolute right-2 top-2 z-10">
                        <Button
                          type="button"
                          onClick={() => form.setValue("content.heroImg", "")}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>

                      <Image
                        fill
                        className="object-cover"
                        alt="Image"
                        src={
                          form.watch("content.heroImg") ??
                          "/placeholder-image.webp"
                        }
                        sizes=" (max-width: 200px) 100vw, 200px"
                        priority
                        loading="eager"
                      />
                    </div>
                  )}

                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    buttonClassName="w-full"
                    onChange={(url) => {
                      field.onChange(url);
                      return field.onChange(url);
                    }}
                    onRemove={() => form.setValue("content.heroImg", "")}
                    previewImages={false}
                    folder=""
                  />
                </>
              </FormControl>
              <FormDescription>
                The hero is the first image on the homepage.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </EditSection>
  );
};
