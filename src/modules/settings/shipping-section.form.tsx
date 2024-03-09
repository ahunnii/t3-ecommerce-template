/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, type FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { EditSection } from "~/components/common/sections/edit-section.admin";
import type { SettingsFormValues } from "./types";

import { AdvancedNumericInput } from "~/components/common/inputs/advanced-numeric-input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { Info } from "lucide-react";
import { cn } from "~/utils/styles";

type Props = {
  form: UseFormReturn<SettingsFormValues>;
};

export const ShippingSectionForm: FC<Props> = ({ form }) => {
  const formErrors = form.formState.errors;

  useEffect(() => {
    if (form.watch("hasFreeShipping") && form.watch("minFreeShipping") > 0) {
      form.setValue("hasFlatRate", true);
    }
  }, [form.watch("minFreeShipping"), form.watch("hasFreeShipping")]);

  const checkIfFormHasErrors = useMemo(() => {
    const keys = [
      "hasFreeShipping",
      "minFreeShipping",
      "hasFlatRate",
      "flatRateAmount",
    ];

    const hasErrors = keys.some(
      (key) => formErrors[key as keyof typeof formErrors]
    );
    return hasErrors;
  }, [formErrors]);

  return (
    <EditSection
      title="Shipping"
      description="Set how your store handles shipping."
      bodyClassName="space-y-4"
      hasError={checkIfFormHasErrors}
    >
      <div
        className={cn(
          "grid grid-cols-1 gap-4 ",
          form.watch("hasFreeShipping") && "grid-cols-2"
        )}
      >
        <FormField
          control={form.control}
          name="hasFreeShipping"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Free Shipping</FormLabel>
                <FormDescription>
                  Mark a minimum amount for order to qualify for free shipping.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {form.watch("hasFreeShipping") && (
          <FormField
            control={form.control}
            name="minFreeShipping"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Free Shipping Threshold</FormLabel>
                <FormControl>
                  <AdvancedNumericInput
                    prependSpan="$"
                    placeholder="e.g. 25"
                    field={field}
                  />
                </FormControl>
                <FormDescription>
                  What is the minimum amount for a user to qualify for free
                  shipping? Defaults to 0.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      {/* <div
        className={cn(
          "grid grid-cols-1 gap-4",
          form.watch("hasPickup") && "grid-cols-2"
        )}
      >
        <FormField
          control={form.control}
          name="hasPickup"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Pickup from Base</FormLabel>
                <FormDescription>
                  Do you offer pickup from the address above?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {form.watch("hasPickup") && (
          <FormField
            control={form.control}
            name="maxPickupDistance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pickup Distance Threshold</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" type="number" {...field} />
                </FormControl>
                <FormDescription>
                  What is the max amount you want a user to see this option?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div> */}
      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          form.watch("hasFlatRate") && "grid-cols-2"
        )}
      >
        <FormField
          control={form.control}
          name="hasFlatRate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Flat Rate Shipping</FormLabel>
                <FormDescription>
                  Mark if you want a standard, flat rate shipping for all
                  orders.
                </FormDescription>
              </div>

              {form.watch("hasFreeShipping") &&
              form.watch("minFreeShipping") > 0 ? (
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={
                              form.watch("hasFreeShipping") &&
                              form.watch("minFreeShipping") > 0
                            }
                          />
                        </FormControl>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="flex max-w-72 items-center gap-2">
                        <Info className="size-8" />
                        If you have a minimum amount for free shipping, you need
                        a flat rate amount set up.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={
                    form.watch("hasFreeShipping") &&
                    form.watch("minFreeShipping") > 0
                  }
                />
              )}
            </FormItem>
          )}
        />
        {form.watch("hasFlatRate") && (
          <FormField
            control={form.control}
            name="flatRateAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flat Rate Amount</FormLabel>
                <FormControl>
                  <AdvancedNumericInput
                    placeholder="e.g. 25"
                    prependSpan="$"
                    field={field}
                  />
                </FormControl>
                <FormDescription>
                  What is the flat rate amount you want to charge per order? If
                  you have free shipping enabled, it will be up until the min
                  free shipping amount has been reached.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* <div>
          {form.watch("hasFreeShipping") && form.watch("hasFlatRate") ? (
            <p className="font-bold">
              $ {form.watch("flatRateAmount")} is applied to every order on
              orders up to $ {form.watch("minFreeShipping")}, then the customer
              gets free shipping.
            </p>
          ) : form.watch("hasFreeShipping") ? (
            <p>
              {" "}
              The customer gets free shipping if their order is at least ${" "}
              {form.watch("minFreeShipping")} is applied to every order.
            </p>
          ) : form.watch("hasFlatRate") ? (
            <p>
              $ {form.watch("flatRateAmount")} is applied to every order, no
              matter the order amount.
            </p>
          ) : (
            <p>None</p>
          )}
        </div> */}
      </div>
    </EditSection>
  );
};
