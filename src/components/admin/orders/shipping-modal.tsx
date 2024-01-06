/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Shippo from "shippo";
import * as z from "zod";
import { Badge } from "~/components/ui/badge";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Modal } from "~/components/ui/modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import useShippingLabel, {
  ShippingAddress,
  ShippingResponse,
} from "~/hooks/admin/use-shipping-label";
import { useShippingModal } from "~/hooks/admin/use-shipping-modal";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";
import AddressForm from "./address-form";
import { OrderColumn } from "./columns";

const formSchema = z.object({
  package_length: z.number().min(1),
  package_width: z.number().min(1),
  package_height: z.number().min(1),
  package_weight_lbs: z.number(),
  package_weight_oz: z.number(),
});
const states = [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "District Of Columbia", value: "DC" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Puerto Rico", value: "PR" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" },
] as const;

const selectionSchema = z.object({
  rate_selection_id: z.string(),
});

const shippingFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  street: z.string(),
  additional: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip: z.number(),
});

type LabelValues = z.infer<typeof selectionSchema>;
type ShippingFormValues = z.infer<typeof shippingFormSchema>;
type PackageFormValues = z.infer<typeof formSchema>;

export const ShippingModal = ({ data }: { data: OrderColumn | undefined }) => {
  const { validateAddress, setCustomerAddress, setBusinessAddress } =
    useShippingLabel();

  const params = useRouter();
  const storeId = params?.query?.storeId as string;

  console.log(storeId);
  const shippingModal = useShippingModal();

  const order = useShippingModal((state) => state.data);

  const [loading, setLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rates, setRates] = useState<any[]>([]);

  const [selectedRate, setSelectedRate] = useState<Shippo.Rate | null>(null);
  const [label, setLabel] = useState<Shippo.Transaction | null>(null);

  const customerAddress = data
    ? data?.address?.split(", ").length > 5
      ? {
          name: data?.name ?? undefined,
          street: data?.address?.split(", ")[0] ?? undefined,
          additional: data?.address?.split(", ")[1] ?? undefined,
          city: data?.address?.split(", ")[2] ?? undefined,
          state: data?.address?.split(", ")[3] ?? undefined,
          zip: data?.address?.split(", ")[4] ?? undefined,
        }
      : {
          name: data?.name ?? undefined,
          street: data?.address?.split(", ")[0] ?? undefined,
          additional: "",
          city: data?.address?.split(", ")[1] ?? undefined,
          state: data?.address?.split(", ")[2] ?? undefined,
          zip: data?.address?.split(", ")[3] ?? undefined,
        }
    : {
        name: "",
        street: "",
        additional: "",
        city: "",
        state: "",
        zip: "",
      };

  const { data: storeInfo } = api.store.getStore.useQuery({ storeId });

  const businessAddress = storeInfo
    ? storeInfo?.businessAddress?.split(", ").length > 5
      ? {
          name: storeInfo?.name ?? undefined,
          street: storeInfo?.businessAddress?.split(", ")[0] ?? undefined,
          additional: storeInfo?.businessAddress?.split(", ")[1] ?? undefined,
          city: storeInfo?.businessAddress?.split(", ")[2] ?? undefined,
          state: storeInfo?.businessAddress?.split(", ")[3] ?? undefined,
          zip: storeInfo?.businessAddress?.split(", ")[4] ?? undefined,
        }
      : {
          name: storeInfo?.name ?? undefined,
          street: storeInfo?.businessAddress?.split(", ")[0] ?? undefined,
          additional: "",
          city: storeInfo?.businessAddress?.split(", ")[1] ?? undefined,
          state: storeInfo?.businessAddress?.split(", ")[2] ?? undefined,
          zip: storeInfo?.businessAddress?.split(", ")[3] ?? undefined,
        }
    : {
        name: "",
        street: "",
        additional: "",
        city: "",
        state: "",
        zip: "",
      };

  console.log(businessAddress);
  const defaultValues: Partial<ShippingFormValues> = {};

  const defaultBusinessAddress: Partial<ShippingFormValues> = {
    name: "John Doe",
    street: "673 Lakewood Dr.",
    additional: "",
    city: "South Lyon",
    state: "MI",
    zip: 48178,
  };

  const shippingForm = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues,
  });
  const businessShippingForm = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: defaultBusinessAddress,
  });

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      package_length: 0,
      package_width: 0,
      package_height: 0,
      package_weight_lbs: 0,
      package_weight_oz: 0,
    },
  });

  const rateForm = useForm<z.infer<typeof selectionSchema>>({
    resolver: zodResolver(selectionSchema),
    defaultValues: {
      rate_selection_id: order?.address,
    },
  });

  useEffect(() => {
    if (order) {
      const address: string[] = (order?.address).split(", ") ?? [];
      const hasAdditional = address.length > 5;
      shippingForm.setValue("name", "John Doe");
      shippingForm.setValue("street", address[0] ?? "");
      shippingForm.setValue(
        "additional",
        hasAdditional ? address[1] ?? "" : ""
      );
      shippingForm.setValue("city", address[hasAdditional ? 2 : 1] ?? "");

      shippingForm.setValue("state", address[hasAdditional ? 3 : 2] ?? "");
      shippingForm.setValue("zip", Number(address[hasAdditional ? 4 : 3]) ?? 0);
    }
  }, [order]);

  const onCopy = (id: string) => {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        toast.success("Tracking link copied to clipboard.");
      })
      .catch(() => {
        toast.error("Failed to copy tracking link to clipboard.");
      });
  };

  const onSubmit = async (data: LabelValues) => {
    setLoading(true);
    const label = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/shipping/label`,
      {
        rate: selectedRate?.object_id,
      }
    );

    if (label.status === 200) {
      setLabel(label.data as Shippo.Transaction);
    }
    setLoading(false);
    console.log(label);
  };

  const onAddressSubmit = (data: ShippingFormValues) => {
    setLoading(true);

    validateAddress({
      name: data.name,
      street: data.street,
      additional: data.additional,
      city: data.city,
      state: data.state,
      zip: data.zip.toString(),
    })
      .then((res: ShippingResponse) => {
        if (res.isValid) toast.success("customer address  is valid.");
        else toast.error("customer address  is invalid.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onPackageSubmit = async (data: PackageFormValues) => {
    console.log("yeet");
    const rates = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/shipping/rates`,
      {
        customer_name: shippingForm.getValues("name"),
        customer_street: shippingForm.getValues("street"),
        customer_additional: shippingForm.getValues("additional"),
        customer_city: shippingForm.getValues("city"),
        customer_state: shippingForm.getValues("state"),
        customer_zip: shippingForm.getValues("zip"),
        business_name: businessShippingForm.getValues("name"),
        business_street: businessShippingForm.getValues("street"),
        business_additional: businessShippingForm.getValues("additional"),
        business_city: businessShippingForm.getValues("city"),
        business_state: businessShippingForm.getValues("state"),
        business_zip: businessShippingForm.getValues("zip"),
        weight_lb: data.package_weight_lbs,
        weight_oz: data.package_weight_oz,
        length: data.package_length,
        width: data.package_width,
        height: data.package_height,
      }
    );

    if (rates.status === 200) {
      console.log(rates);
      setRates(rates?.data?.rates as Shippo.Rate[]);
    }
  };

  const [tabValue, setTabValue] = useState<string>("customer_address");
  return (
    <Modal
      title="Create shipping label"
      description="Add a new store to manage products and categories."
      isOpen={shippingModal.isOpen}
      onClose={shippingModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            {label && (
              <div>
                <Label>
                  Successful! Your account has been charged{" "}
                  <strong>${selectedRate?.amount}</strong>
                </Label>

                <Link
                  href={label?.label_url}
                  target="_blank"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 "
                >
                  Click to download the label
                </Link>

                <Button onClick={() => onCopy(label?.tracking_url_provider)}>
                  Click here to copy the tracking number
                </Button>
              </div>
            )}
            {!label && (
              <Tabs
                value={tabValue}
                onValueChange={setTabValue}
                className="w-full"
                // onValueChange={(e) => {
                //   if (e === "rates") {
                //     axios
                //       .post(
                //         `${process.env.NEXT_PUBLIC_API_URL}/shipping/parcel`,
                //         {}
                //       )

                //       .then((res) => {
                //         console.log(res?.data?.rates);
                //         setRates(res?.data?.rates);
                //       })
                //       .catch((err) => {
                //         console.log(err);
                //       });
                //   }
                // }}
              >
                <TabsList>
                  <TabsTrigger value="customer_address">Customer</TabsTrigger>{" "}
                  <TabsTrigger value="business_address">Business</TabsTrigger>
                  <TabsTrigger value="package">Package</TabsTrigger>
                  <TabsTrigger value="rates">Get Rates</TabsTrigger>
                </TabsList>
                <TabsContent value="customer_address">
                  {customerAddress && (
                    <AddressForm
                      successCallback={(data) => {
                        toast.success("Customer address is valid.");
                        setCustomerAddress(data as ShippingAddress);
                        setTabValue("business_address");
                      }}
                      errorCallback={() =>
                        toast.error("Customer address is invalid.")
                      }
                      initialData={customerAddress ?? null}
                    />
                  )}
                </TabsContent>
                <TabsContent value="business_address">
                  {businessAddress && (
                    <AddressForm
                      successCallback={(data) => {
                        toast.success("Business address is valid.");
                        setBusinessAddress(data as ShippingAddress);
                        setTabValue("package");
                      }}
                      errorCallback={() =>
                        toast.error("Business address is invalid.")
                      }
                      initialData={businessAddress ?? null}
                    />
                  )}
                </TabsContent>
                <TabsContent value="package">
                  {" "}
                  <Form {...form}>
                    <form
                      onSubmit={(e) =>
                        void form.handleSubmit(onPackageSubmit)(e)
                      }
                    >
                      <div className="flex flex-col gap-y-5">
                        <div className="flex gap-3">
                          <FormField
                            control={form.control}
                            name="package_length"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Length (in)</FormLabel>

                                <FormControl>
                                  <Input
                                    disabled={loading}
                                    {...field}
                                    type="number"
                                    min={0}
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
                                    }}
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
                                  <Input
                                    disabled={loading}
                                    {...field}
                                    type="number"
                                    min={0}
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
                                    }}
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
                                  <Input
                                    disabled={loading}
                                    {...field}
                                    type="number"
                                    min={0}
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex gap-3">
                          <FormField
                            control={form.control}
                            name="package_weight_lbs"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Lbs</FormLabel>

                                <FormControl>
                                  <Input
                                    disabled={loading}
                                    {...field}
                                    type="number"
                                    min={0}
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
                                    }}
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
                                  <Input
                                    disabled={loading}
                                    {...field}
                                    type="number"
                                    min={0}
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="flex w-full items-center justify-end space-x-2 pt-6">
                        <Button
                          disabled={loading}
                          variant="outline"
                          onClick={shippingModal.onClose}
                        >
                          Cancel
                        </Button>{" "}
                        <Button disabled={loading} type="submit">
                          Continue
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
                <TabsContent value="rates">
                  {" "}
                  <Form {...rateForm}>
                    <form
                      onSubmit={(e) => void rateForm.handleSubmit(onSubmit)(e)}
                    >
                      <div className="flex flex-col gap-y-5">
                        <FormField
                          control={rateForm.control}
                          name="rate_selection_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rate Selection</FormLabel>

                              <FormControl>
                                <>
                                  <Select
                                    onValueChange={(e) => {
                                      setSelectedRate(
                                        (rates.find(
                                          (rate) => rate.object_id === e
                                        ) as Shippo.Rate) ?? null
                                      );

                                      field.onChange(e);
                                    }}
                                  >
                                    <SelectTrigger className="flex h-20 w-full text-left">
                                      <SelectValue placeholder="No variant selected" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {rates?.map((rate, idx) => (
                                        <SelectItem
                                          className="flex"
                                          value={rate?.object_id}
                                          key={idx}
                                        >
                                          <div className="flex items-center gap-4">
                                            <img
                                              src={rate?.provider_image_75}
                                              className={cn(
                                                rate?.provider === "USPS"
                                                  ? "h-3"
                                                  : "h-6"
                                              )}
                                              alt=""
                                            />
                                            <div className="flex flex-col justify-start">
                                              <span className="flex gap-2">
                                                {rate?.servicelevel?.name} $
                                                {rate?.amount}
                                                {rate?.attributes?.map(
                                                  (attr: any, idx: any) => (
                                                    <Badge
                                                      key={idx}
                                                      className="text-xs"
                                                    >
                                                      {attr}
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
                                    </SelectContent>
                                  </Select>

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
                        <Button
                          disabled={loading}
                          variant="outline"
                          onClick={shippingModal.onClose}
                        >
                          Cancel
                        </Button>{" "}
                        <Button disabled={loading} type="submit">
                          Get Label
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
