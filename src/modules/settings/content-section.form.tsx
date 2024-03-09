import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { useMemo, type FC } from "react";
import type { UseFormReturn } from "react-hook-form";

import { EditSection } from "~/components/common/sections/edit-section.admin";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import MarkdownEditor from "~/components/common/inputs/markdown-editor";
import { states } from "~/utils/shipping";
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
      <div className="flex items-center gap-4">
        <FormField
          control={form.control}
          name="content.aboutPage"
          render={({ field }) => (
            <FormItem className="w-full">
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
      </div>
    </EditSection>
  );
};
