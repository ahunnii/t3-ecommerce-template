import {
  CheckIcon,
  ChevronsUpDown,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
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

import { AdvancedInput } from "~/components/common/inputs/advanced-input";
import MarkdownEditor from "~/components/common/inputs/markdown-editor";
import { states } from "~/utils/shipping";
import { cn } from "~/utils/styles";
import type { SettingsFormValues } from "./types";

type Props = {
  form: UseFormReturn<SettingsFormValues>;
};

export const SocialsSectionForm: FC<Props> = ({ form }) => {
  const formErrors = form.formState.errors;

  const checkIfFormHasErrors = useMemo(() => {
    const keys = [
      "socialMedia.facebook, socialMedia.instagram, socialMedia.twitter, socialMedia.tikTok",
    ];

    const hasErrors = keys.some(
      (key) => formErrors[key as keyof typeof formErrors]
    );
    return hasErrors;
  }, [formErrors]);

  return (
    <EditSection
      title="Social Media"
      hasError={checkIfFormHasErrors}
      description="Manage your site's social media links"
      bodyClassName=""
    >
      <div className="flex flex-col items-center gap-4">
        <FormField
          control={form.control}
          name="socialMedia.instagram"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Instagram</FormLabel>
              <FormControl>
                <AdvancedInput
                  PrependSpan={Instagram}
                  field={field}
                  placeholder="e.g. https://instagram.com/coolname"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="socialMedia.facebook"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Facebook</FormLabel>
              <FormControl>
                <AdvancedInput
                  PrependSpan={Facebook}
                  field={field}
                  placeholder="e.g. https://facebook.com/coolname"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="socialMedia.twitter"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Twitter (X)</FormLabel>
              <FormControl>
                <AdvancedInput
                  PrependSpan={Twitter}
                  field={field}
                  placeholder="e.g. https://twitter.com/coolname"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="socialMedia.tikTok"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>TikTok</FormLabel>
              <FormControl>
                <AdvancedInput
                  PrependSpan={TikTok}
                  field={field}
                  placeholder="e.g. https://tiktok.com/coolname"
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

const TikTok: FC = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        className="size-6  fill-gray-500 "
      >
        <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
      </svg>
    </div>
  );
};
