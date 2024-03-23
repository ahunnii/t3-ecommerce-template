import { zodResolver } from "@hookform/resolvers/zod";

import { type FC } from "react";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { AdvancedNumericInput } from "~/components/common/inputs/advanced-numeric-input";
import { EditSection } from "~/components/common/sections/edit-section.admin";
import { useShippingModal } from "../hooks/use-shipping-modal";
import { packageFormSchema } from "../schema";
import type { PackageFormValues } from "../types";

type Props = {
  initialData: PackageFormValues | null;
  successCallback: (data: PackageFormValues) => void;
  errorCallback: (data?: unknown) => void;
};
const PackageForm: FC<Props> = ({ initialData, successCallback }) => {
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      package_length: initialData?.package_length ?? 0,
      package_width: initialData?.package_width ?? 0,
      package_height: initialData?.package_height ?? 0,
      package_weight_lbs: initialData?.package_weight_lbs ?? 0,
      package_weight_oz: initialData?.package_weight_oz ?? 0,
    },
  });

  const onSubmit = (data: PackageFormValues) => {
    successCallback(data);
  };
  const shippingModal = useShippingModal();

  return (
    <Form {...form}>
      <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
        <div className="flex flex-col space-y-5 pt-4">
          <EditSection
            title="Length"
            description="Length of the final package with the item(s) included."
            bodyClassName="flex space-x-4"
          >
            <FormField
              control={form.control}
              name="package_length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length (in)</FormLabel>

                  <FormControl>
                    <AdvancedNumericInput
                      field={field}
                      min={0}
                      appendSpan="in"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="package_width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width (in)</FormLabel>

                  <FormControl>
                    <AdvancedNumericInput
                      field={field}
                      min={0}
                      appendSpan="in"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="package_height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (in)</FormLabel>

                  <FormControl>
                    <AdvancedNumericInput
                      field={field}
                      min={0}
                      appendSpan="in"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </EditSection>

          <EditSection
            title="Weight"
            description="Weight of the final package with the item(s) included."
            bodyClassName="flex space-x-4"
          >
            <FormField
              control={form.control}
              name="package_weight_lbs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lbs</FormLabel>

                  <FormControl>
                    <AdvancedNumericInput
                      field={field}
                      min={0}
                      appendSpan="lbs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="package_weight_oz"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ozs</FormLabel>

                  <FormControl>
                    <AdvancedNumericInput
                      field={field}
                      min={0}
                      appendSpan="oz"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </EditSection>
        </div>

        <div className="flex w-full items-center justify-end space-x-2 pt-6">
          <Button variant={"outline"} onClick={() => shippingModal.onClose()}>
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  );
};

export default PackageForm;
