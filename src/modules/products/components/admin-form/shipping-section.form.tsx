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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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
        description=" Measurements and weight are used to calculate shipping rates.  Measurements are in inches."
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
          {/* <FormField
            control={form.control}
            name="shippingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Type</FormLabel>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Select a category"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={"FLAT_RATE"}>Flat Rate</SelectItem>
                    <SelectItem value={"FREE"}>Free Shipping</SelectItem>
                    <SelectItem value={"VARIABLE"}>
                      Calculate at Shipping
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          {form.watch("shippingType") === "FLAT_RATE" && (
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
                    Set any additional fees for handling and packaging. This
                    gets added to the shipping cost at checkout.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex flex-col justify-center">
            <FormLabel>Weight (g):</FormLabel>
            <div className="flex">
              <FormField
                control={form.control}
                name="weight_lb"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <AdvancedNumericInput
                        type="number"
                        disabled={loading}
                        placeholder="e.g. 1"
                        field={field}
                        appendSpan="lb"
                        min="0"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight_oz"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <AdvancedNumericInput
                        type="number"
                        disabled={loading}
                        placeholder="e.g. 10"
                        field={field}
                        min="0"
                        appendSpan="oz"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormDescription>
              Weight of item in grams (excluding packaging)
            </FormDescription>
          </div>
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length:</FormLabel>
                  <FormControl>
                    <>
                      <div className="relative ">
                        <Input
                          type="number"
                          disabled={loading}
                          className="block w-full rounded-md py-1.5 pr-7  text-gray-900     sm:text-sm sm:leading-6"
                          placeholder="0.00"
                          {...field}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-500 sm:text-sm">in</span>
                        </div>
                      </div>
                    </>
                  </FormControl>
                  {/* <FormDescription>
                          Weight of item in grams (excluding packaging)
                        </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width:</FormLabel>
                  <FormControl>
                    <>
                      <div className="relative ">
                        <Input
                          type="number"
                          disabled={loading}
                          className="block w-full rounded-md py-1.5 pr-7  text-gray-900     sm:text-sm sm:leading-6"
                          placeholder="0.00"
                          {...field}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-500 sm:text-sm">in</span>
                        </div>
                      </div>
                    </>
                  </FormControl>
                  {/* <FormDescription>
                          Weight of item in grams (excluding packaging)
                        </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height:</FormLabel>
                  <FormControl>
                    <>
                      <div className="relative ">
                        <Input
                          type="number"
                          disabled={loading}
                          className="block w-full rounded-md py-1.5 pr-7  text-gray-900     sm:text-sm sm:leading-6"
                          placeholder="0.00"
                          {...field}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-500 sm:text-sm">in</span>
                        </div>
                      </div>
                    </>
                  </FormControl>
                  {/* <FormDescription>
                        Weight of item in grams (excluding packaging)
                      </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </EditSection>
    </>
  );
};
