import { type FC } from "react";

import { type UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { FormattedNumericInput } from "~/components/common/inputs/formatted-numeric-input";
import { EditSection } from "~/components/common/sections/edit-section.admin";
import { Button } from "~/components/ui/button";
import { states } from "~/utils/shipping";
import { cn } from "~/utils/styles";
import type { OrderFormValues } from "../../types";

type Props = {
  form: UseFormReturn<OrderFormValues>;
  loading: boolean;
};

export const CustomerDetailsSection: FC<Props> = ({ form, loading }) => {
  return (
    <>
      <EditSection
        title="Customer Info"
        description="Edit the customer's shipping information."
      >
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your customer's name"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. test@test.com"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  Phone
                </FormLabel>
                <FormControl>
                  <FormattedNumericInput
                    {...field}
                    type="tel"
                    allowEmptyFormatting
                    format="+1 (###) ###-####"
                    mask="_"
                    onChange={(e) => {
                      e.preventDefault();
                    }}
                    onValueChange={(value) => {
                      field.onChange(`${value.floatValue}`);
                    }}
                    required
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </EditSection>

      <EditSection
        title="Shipping Address"
        description="Address used in fulfillment"
      >
        <FormLabel>Address</FormLabel>{" "}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  Street address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 1234 Main St."
                    {...field}
                    disabled={loading}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="additional"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  Apt / Suite / Other (Optional)
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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  City
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Boulder City" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  State
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild disabled={loading}>
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
              <FormItem className="col-span-2">
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  Zip Code
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 44444"
                    {...field}
                    className="col-span-1"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
        </div>
      </EditSection>
    </>
  );
};
