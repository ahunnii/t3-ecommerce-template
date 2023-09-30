"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Store } from "@prisma/client";
import axios from "axios";
import { LoaderIcon, Trash } from "lucide-react";

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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Heading } from "~/components/ui/heading";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { useOrigin } from "~/hooks/use-origin";
import { api } from "~/utils/api";
import { decrypt, encrypt } from "~/utils/encryption";

const formSchema = z.object({
  name: z.string().min(2),
  stripeSk: z.string().min(2),
  stripeWebhook: z.string().min(2),
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

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      stripeSk: initialData?.stripeSk
        ? decrypt(initialData?.stripeSk as string)
        : "",
      stripeWebhook: initialData?.stripeWebhook
        ? decrypt(initialData?.stripeWebhook as string)
        : "",
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
    updateStore({
      storeId: params.query.storeId as string,
      name: data.name,
      stripeSk: encrypt(data.stripeSk),
      stripeWebhook: encrypt(data.stripeWebhook),
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
          onSubmit={form.handleSubmit(onSubmit)}
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

            {/* <FormField
              control={form.control}
              name="stripeSk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stripe Secret Key</FormLabel>{" "}
                  <FormDescription>
                    You will not be able to sell until you get this key.
                  </FormDescription>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="secret key"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stripeWebhook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stripe Webhook</FormLabel>{" "}
                  <FormDescription>
                    You will not be able to sell until you get this webhook.
                  </FormDescription>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="secret key"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
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
