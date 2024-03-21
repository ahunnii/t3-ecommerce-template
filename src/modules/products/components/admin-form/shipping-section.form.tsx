import type { UseFormReturn } from "react-hook-form";
import { AdvancedNumericInput } from "~/components/common/inputs/advanced-numeric-input";
import { EditSection } from "~/components/common/sections/edit-section.admin";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import type { ProductFormValues } from "../../types";

export const ShippingSection = ({
  form,
  loading,
}: {
  form: UseFormReturn<ProductFormValues>;
  loading: boolean;
}) => {
  return (
    <>
      <EditSection
        title="Shipping"
        description="Provides additional information to the customer on when to expect their order and any additional fees that may apply."
      >
        <div className="my-5 gap-8 md:grid md:grid-cols-2 ">
          <FormField
            control={form.control}
            name="estimatedCompletion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Completion (optional)</FormLabel>
                <FormControl>
                  <AdvancedNumericInput
                    disabled={loading}
                    placeholder="e.g 48"
                    min={0}
                    field={field}
                    appendSpan="days"
                    appendClassName="pr-4"
                  />
                </FormControl>
                <FormDescription>
                  This helps the customer know when to expect their order. If
                  you have inventory on hand, you can set this to 0 to indicate
                  that the item is ready to ship immediately.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shippingCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Handling Fees (optional)</FormLabel>
                <FormControl>
                  <AdvancedNumericInput
                    type="number"
                    disabled={loading}
                    placeholder="1"
                    min={0}
                    field={field}
                    prependSpan="$"
                  />
                </FormControl>
                <FormDescription>
                  Set any additional fees for handling and packaging. This gets
                  added to the shipping cost at checkout.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </EditSection>
    </>
  );
};
