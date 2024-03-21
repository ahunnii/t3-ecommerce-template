import { zodResolver } from "@hookform/resolvers/zod";
import type { Prisma } from "@prisma/client";

import { LoaderIcon } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ApiAlert } from "~/components/ui/api-alert";
import { Button } from "~/components/ui/button";
import { AlertModal } from "~/modules/admin/components/modals/alert-modal";

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

import { Separator } from "~/components/ui/separator";

import { useOrigin } from "~/hooks/use-origin";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";

import { AdminFormBody } from "~/components/common/admin/admin-form-body";
import { AdminFormHeader } from "~/components/common/admin/admin-form-header";
import { AddressSectionForm } from "./address-section.form";
import { ContentSectionForm } from "./content-section.form";
import { storeFormSchema } from "./schema";
import { ShippingSectionForm } from "./shipping-section.form";
import { SocialsSectionForm } from "./socials-section.form";
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
        heroImg: initialData?.content?.heroImg ?? "",
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
        heroImg: data.content?.heroImg,
      },
      socialMedia: {
        facebook: data.socialMedia?.facebook,
        instagram: data.socialMedia?.instagram,
        twitter: data.socialMedia?.twitter,
        tikTok: data.socialMedia?.tikTok,
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
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          onChange={() => console.log(form.formState)}
        >
          <AdminFormHeader
            title="Store settings"
            description="Manage store preferences"
            contentName="Home"
            link={`/admin/${params.query.storeId as string}`}
          >
            {initialData && (
              <AlertModal
                isOpen={open}
                setIsOpen={setOpen}
                onConfirm={onDelete}
                loading={loading}
                asChild={true}
              />
            )}

            <Button disabled={loading} className="ml-auto" type="submit">
              {loading && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </AdminFormHeader>

          <AdminFormBody className="mx-auto w-full max-w-7xl flex-col space-y-0">
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
            <AddressSectionForm form={form} />
            <ShippingSectionForm form={form} />
            <ContentSectionForm form={form} />
            <SocialsSectionForm form={form} />
          </AdminFormBody>

          <div className="mx-auto w-full max-w-7xl space-y-4 p-8">
            <Separator />
            <ApiAlert
              title="NEXT_PUBLIC_API_URL"
              variant="public"
              description={`${origin}/api/${params.query.storeId as string}`}
            />
          </div>
        </form>
      </Form>
    </>
  );
};
