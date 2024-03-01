import { zodResolver } from "@hookform/resolvers/zod";

import { CheckIcon, ChevronsUpDown, Loader2 } from "lucide-react";

import { type FC } from "react";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Form,
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

import USA_STATES from "~/data/states";

import { toastService } from "~/services/toast";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";
import { useShippingModal } from "../hooks/use-shipping-modal";
import { addressFormSchema } from "../schema";
import type { AddressFormValues } from "../types";

type TInitialData = {
  name: string | undefined;
  street: string | undefined;
  additional?: string | undefined;
  city: string | undefined;
  state: string | undefined;
  zip: string | undefined;
};

type Props = {
  initialData?: TInitialData | null;
  successCallback: (data: AddressFormValues) => void;
  errorCallback?: (data?: unknown) => void;
};
const AddressForm: FC<Props> = ({
  successCallback,
  errorCallback,
  initialData,
}) => {
  const validateAddress = api.shippingLabels.verifyAddress.useMutation({
    onSuccess: (data) => {
      if (data?.validation_results?.is_valid === false) {
        toastService.error(
          "Address is invalid.",
          "Shippo returned an invalid address."
        );
        if (errorCallback) errorCallback();
        return;
      }
      toastService.success("Address is valid!");
      successCallback({
        name: data.name,
        street: data.street1,
        additional: data.street2,
        city: data.city,
        state: data.state,
        zip: data.zip,
      } as AddressFormValues);
    },
    onError: (err: unknown) => {
      toastService.error("Address is invalid.", err);
      if (errorCallback) errorCallback();
    },
  });

  const shippingForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      name: initialData?.name ?? undefined,
      street: initialData?.street ?? undefined,
      additional: initialData?.additional ?? undefined,
      city: initialData?.city ?? undefined,
      state: initialData?.state ?? undefined,
      zip: initialData?.zip ?? undefined,
    },
  });

  const onAddressSubmit = (data: AddressFormValues) =>
    validateAddress.mutate(data);
  const shippingModal = useShippingModal();
  return (
    <Form {...shippingForm}>
      <form
        onSubmit={(e) => void shippingForm.handleSubmit(onAddressSubmit)(e)}
        className="space-y-8"
      >
        <FormField
          control={shippingForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={shippingForm.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street address</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 1234 Main St." {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={shippingForm.control}
          name="additional"
          render={({ field }) => (
            <FormItem>
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
        />
        <FormField
          control={shippingForm.control}
          name="city"
          render={({ field }) => (
            <FormItem>
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
        <div className="items-center gap-8 md:grid md:grid-cols-2">
          <FormField
            control={shippingForm.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "h-10 w-[200px] justify-between py-2",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? USA_STATES.find(
                              (state) => state.value === field.value
                            )?.label
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
                        {USA_STATES.map((state) => (
                          <CommandItem
                            value={state.label}
                            key={state.value}
                            onSelect={() => {
                              shippingForm.setValue("state", state.value);
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
            control={shippingForm.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 44444"
                    {...field}
                    // type="number"
                    className="col-span-1"
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />{" "}
        </div>
        <div className="flex w-full items-center justify-end space-x-2 pt-6">
          <Button variant={"outline"} onClick={() => shippingModal.onClose()}>
            Cancel
          </Button>
          <Button type="submit" disabled={validateAddress.isLoading}>
            {validateAddress.isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}{" "}
            Verify Address
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddressForm;
