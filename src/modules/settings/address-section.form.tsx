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

import { states } from "~/utils/shipping";
import { cn } from "~/utils/styles";
import type { SettingsFormValues } from "./types";

type Props = {
  form: UseFormReturn<SettingsFormValues>;
};

export const AddressSectionForm: FC<Props> = ({ form }) => {
  const formErrors = form.formState.errors;

  const checkIfFormHasErrors = useMemo(() => {
    const keys = ["street", "city", "state", "zip", "additional"];

    const hasErrors = keys.some(
      (key) => formErrors[key as keyof typeof formErrors]
    );
    return hasErrors;
  }, [formErrors]);

  return (
    <EditSection
      title="Business Address"
      hasError={checkIfFormHasErrors}
      description="Set your shop's address used for shipping, invoices, and other business needs."
      bodyClassName="space-y-4"
    >
      <div className="flex items-center gap-4">
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Street address</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 1234 Main St." {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="additional"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                Apt / Suite / Other{" "}
                <span className="text-xs text-gray-500">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g. 1234 Main St." {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />{" "}
      </div>
      <div className="flex items-center gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Boulder City"
                  {...field}
                  className="col-span-1"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>State</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        " w-full  justify-between ",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? states.find((state) => state.value === field.value)
                            ?.label
                        : "Select state"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="max-h-96 w-[200px] overflow-y-scroll p-0">
                  <Command>
                    <CommandInput placeholder="Search state..." />
                    <CommandEmpty>No state found.</CommandEmpty>
                    <CommandGroup>
                      {states.map((state) => (
                        <CommandItem
                          value={state.label ?? undefined}
                          key={state.value}
                          onSelect={() => {
                            form.setValue("state", state.value);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              state.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {state.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="zip"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 44444"
                  {...field}
                  className="col-span-1"
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
