import Image from "next/image";
import { useState, type FC } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SelectGroup } from "@radix-ui/react-select";
import { useForm } from "react-hook-form";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { cn } from "~/utils/styles";
import { useShippingModal } from "../hooks/use-shipping-modal";
import { rateFormSchema } from "../schema";
import { useShippingLabelStore } from "../store/use-shipping-label-store";
import type { RateFormValues } from "../types";

type Props = {
  successCallback: (data?: unknown) => void;
  errorCallback: (data?: unknown) => void;
  initialData: Shippo.Rate | null;
  availableRates: Shippo.Rate[];
};

const RatesForm: FC<Props> = ({
  initialData,
  successCallback,
  availableRates,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { selectedRate, setSelectedRate } = useShippingLabelStore(
    (state) => state
  );

  const rateForm = useForm<RateFormValues>({
    resolver: zodResolver(rateFormSchema),
    defaultValues: {
      rate_selection_id: initialData?.object_id ?? undefined,
    },
  });

  const onSubmit = () => {
    setLoading(true);

    successCallback();

    setLoading(false);
  };

  const shippingModal = useShippingModal();
  return (
    <Form {...rateForm}>
      <form onSubmit={(e) => void rateForm.handleSubmit(onSubmit)(e)}>
        <div className="flex flex-col gap-y-5">
          <FormField
            control={rateForm.control}
            name="rate_selection_id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Rate Selection</FormLabel>

                <FormControl>
                  <>
                    {availableRates && (
                      <Select
                        value={field.value}
                        onValueChange={(e) => {
                          setSelectedRate(
                            availableRates.find(
                              (rate) => rate.object_id === e
                            )! ?? null
                          );

                          field.onChange(e);
                        }}
                      >
                        <SelectTrigger className="flex h-20 w-full text-left">
                          <SelectValue placeholder="Select a shipping rate..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-96 ">
                          <SelectGroup>
                            {availableRates?.map((rate, idx) => (
                              <SelectItem
                                className="flex"
                                value={rate?.object_id}
                                key={idx}
                              >
                                <div className="flex items-center gap-4">
                                  <Image
                                    src={rate?.provider_image_75}
                                    className={cn(
                                      rate?.provider === "USPS" ? "h-3" : "h-6"
                                    )}
                                    alt=""
                                    width={rate?.provider === "USPS" ? 56 : 24}
                                    height={rate?.provider === "USPS" ? 24 : 24}
                                  />
                                  <div className="flex flex-col justify-start">
                                    <span className="flex gap-2">
                                      {rate?.servicelevel?.name} ${rate?.amount}
                                      {rate?.attributes?.map(
                                        (attr: unknown, idx: number) => (
                                          <Badge key={idx} className="text-xs">
                                            {attr as string}
                                          </Badge>
                                        )
                                      )}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {rate?.duration_terms}
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}

                    <FormDescription>
                      {selectedRate
                        ? `Estimated to take ${selectedRate.estimated_days} day(s). Cost to be charged to Shippo account: $${selectedRate.amount}`
                        : "Select a rate to continue"}
                    </FormDescription>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
        </div>
        <div className="flex w-full items-center justify-end space-x-2 pt-6">
          <Button variant={"outline"} onClick={() => shippingModal.onClose()}>
            Cancel
          </Button>{" "}
          <Button disabled={loading} type="submit">
            Review
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RatesForm;
