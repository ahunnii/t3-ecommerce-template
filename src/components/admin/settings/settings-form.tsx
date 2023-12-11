import { zodResolver } from "@hookform/resolvers/zod";
import type { Store } from "@prisma/client";
import axios from "axios";
import { CheckIcon, ChevronsUpDown, LoaderIcon, Trash } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { AlertModal } from "~/components/admin/modals/alert-modal";
import { ApiAlert } from "~/components/ui/api-alert";
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
import { Heading } from "~/components/ui/heading";
import ImageUpload from "~/components/ui/image-upload";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { useOrigin } from "~/hooks/use-origin";
import { api } from "~/utils/api";
import { states } from "~/utils/shipping";
import { cn } from "~/utils/styles";

const formSchema = z.object({
  name: z.string().min(2),

  street: z.string().optional(),
  additional: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.coerce.number().positive().int().optional(),
});

type SettingsFormValues = z.infer<typeof formSchema>;

interface SettingsFormProps {
  initialData: Store;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useRouter();
  const router = useNavigationRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const address = initialData.businessAddress?.split(", ") ?? [];

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,

      street: address[0] ?? undefined,
      additional: address.length > 5 ? address[1] ?? undefined : undefined,
      city:
        address.length > 5 ? address[2] ?? undefined : address[1] ?? undefined,
      state:
        address.length > 5 ? address[3] ?? undefined : address[2] ?? undefined,
      zip:
        address.length > 5
          ? Number(address[4]) ?? undefined
          : Number(address[3]) ?? undefined,
    },
  });

  const { mutate: updateStore } = api.store.updateStore.useMutation({
    onSuccess: () => {
      router.refresh();
      toast.success("Store updated.");
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error(error);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const { mutate: deleteStore } = api.store.deleteStore.useMutation({
    onSuccess: () => {
      router.push("/admin");
      toast.success("Store deleted.");
    },
    onError: (error) => {
      toast.error("Make sure you removed all products using this color first.");
      console.error(error);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
      setOpen(false);
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    console.log(data);
    updateStore({
      storeId: params.query.storeId as string,
      name: data.name,
      businessAddress: `${data.street}, ${
        data.additional ? data.additional + ", " : ""
      }${data.city}, ${data.state}, ${data.zip}, US`,
    });
  };

  const onDelete = () => {
    deleteStore({
      storeId: params.query.storeId as string,
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title="Store settings"
          description="Manage store preferences"
        />
        <Button
          disabled={loading}
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>{" "}
                  <FormDescription>
                    Give your store a unique name that will be displayed to your
                    customers.
                  </FormDescription>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
            />{" "}
            <FormField
              control={form.control}
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
                control={form.control}
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
                              ? states.find(
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
                            {states.map((state) => (
                              <CommandItem
                                value={state.label}
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
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 44444"
                        {...field}
                        type="number"
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
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {loading && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        variant="public"
        description={`${origin}/api/${params.query.storeId as string}`}
      />
    </>
  );
};
