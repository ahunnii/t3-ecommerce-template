import { zodResolver } from "@hookform/resolvers/zod";
import type { Prisma } from "@prisma/client";

import { LoaderIcon, Trash } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";

import { AddressSectionForm } from "./address-section.form";
import { ContentSectionForm } from "./content-section.form";
import { storeFormSchema } from "./schema";
import { ShippingSectionForm } from "./shipping-section.form";
import type { SettingsFormValues } from "./types";

interface SettingsFormProps {
  initialData: Prisma.StoreGetPayload<{
    include: {
      gallery: true;
      address: true;
      socialMedia: true;
      content: true;
    };
  }>;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useRouter();
  const router = useNavigationRouter();
  const origin = useOrigin();

  const apiContext = api.useContext();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: initialData.name,
      street: initialData?.address?.street ?? "",
      additional: initialData?.address?.additional ?? "",
      city: initialData?.address?.city ?? "",
      state: initialData?.address?.state ?? "",
      zip: initialData?.address?.postal_code ?? "",
      country: initialData?.address?.country ?? "US",
      hasFreeShipping: initialData?.hasFreeShipping,
      minFreeShipping: initialData?.minFreeShipping ?? 0,
      hasPickup: initialData?.hasPickup,
      maxPickupDistance: initialData?.maxPickupDistance ?? 0,
      hasFlatRate: initialData?.hasFlatRate,
      flatRateAmount: initialData?.flatRateAmount ?? 0,
      socialMedia: {
        facebook: initialData?.socialMedia?.facebook ?? "",
        instagram: initialData?.socialMedia?.instagram ?? "",
        twitter: initialData?.socialMedia?.twitter ?? "",
        tikTok: initialData?.socialMedia?.tikTok ?? "",
      },
      content: {
        aboutPage: initialData?.content?.aboutPage ?? "",
      },
    },
  });

  const { mutate: updateStore } = api.store.updateStore.useMutation({
    onSuccess: () => {
      toastService.success("Store successfully updated.");
    },
    onError: (error) => {
      toastService.error("Something went wrong", error);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
      void apiContext.store.getStore.invalidate();
    },
  });

  const { mutate: deleteStore } = api.store.deleteStore.useMutation({
    onSuccess: () => {
      router.push("/admin");
      toastService.success("Store deleted.");
    },
    onError: (error) => {
      toastService.error(
        "Something went wrong with deleting your store. Please try again.",
        error
      );
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
      address: {
        street: data.street,
        additional: data.additional,
        city: data.city,
        state: data.state,
        postalCode: data.zip,
        country: data.country,
      },
      hasFreeShipping: data.hasFreeShipping,
      minFreeShipping: data.minFreeShipping ?? undefined,
      hasPickup: data.hasPickup,
      maxPickupDistance: data.maxPickupDistance ?? undefined,
      flatRateAmount: data.flatRateAmount ?? undefined,
      hasFlatRate: data.hasFlatRate,
      content: {
        aboutPage: data.content?.aboutPage,
      },
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
          onChange={() => console.log(form.formState)}
          className="w-full space-y-8"
        >
          <div className=" gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>{" "}
                  <FormDescription>
                    Give your store a unique name that will be displayed to your
                    customers.
                  </FormDescription>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store name"
                      {...field}
                      className=""
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
          </div>
          <AddressSectionForm form={form} />
          <ShippingSectionForm form={form} />
          <ContentSectionForm form={form} />

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
