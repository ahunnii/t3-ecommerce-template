/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import type Shippo from "shippo";

import { Button } from "~/components/ui/button";

import { Label } from "~/components/ui/label";
import { Modal } from "~/components/ui/modal";

import { useShippingModal } from "~/modules/shipping/hooks/use-shipping-modal";

import { api } from "~/utils/api";

import { toastService } from "~/services/toast";

import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useShippingLabelStore } from "../store/use-shipping-label-store";
import AddressForm from "./address-form";
import PackageForm from "./package-form";
import RatesForm from "./rates-form";

export const ShippingModal = ({ data }: { data: string }) => {
  const {
    setParcel,
    selectedRate,
    setCustomerAddress,
    setBusinessAddress,
    businessAddress: fromAddress,
    customerAddress: toAddress,
    parcel,
    clearAll,
  } = useShippingLabelStore((state) => state);

  const [tabValue, setTabValue] = useState<string>("customer_address");
  const params = useRouter();
  const storeId = params?.query?.storeId as string;

  const apiContext = api.useContext();

  const shippingModal = useShippingModal();

  const [label, setLabel] = useState<Shippo.Transaction | null>(null);

  const getStoreInfo = api.store.getStore.useQuery(
    { storeId },
    { enabled: shippingModal.isOpen }
  );

  const getCurrentOrder = api.orders.getOrder.useQuery(
    { orderId: data ?? "" },
    { enabled: shippingModal.isOpen }
  );

  const getAvailableRates = api.shippingLabels.getAvailableRates.useQuery(
    {
      customerAddress: toAddress!,
      businessAddress: fromAddress!,
      parcel: parcel!,
    },
    {
      enabled:
        shippingModal.isOpen &&
        toAddress !== null &&
        fromAddress !== null &&
        parcel !== null &&
        tabValue === "rates",
    }
  );

  const createLabel = api.shippingLabels.createLabel.useMutation({
    onSuccess: (data) => {
      setLabel(data?.shippingLabel);
      toastService.success("Label created successfully");
    },
    onError: (err) => toastService.error("Failed to create label", err),
    onSettled: () => {
      void apiContext.orders.invalidate();
    },
  });

  const handleOnClose = () => {
    void apiContext.orders.getAllOrders.invalidate();
    shippingModal.onClose();
  };

  useEffect(() => {
    setTimeout(() => {
      document.body.style.pointerEvents = "";
    }, 500);

    if (!shippingModal.isOpen) {
      void getStoreInfo.refetch();
      void getCurrentOrder.refetch();
    }
  }, []);

  useEffect(() => {
    if (!shippingModal.isOpen) {
      clearAll();
      setLabel(null);
    }
  }, [shippingModal.isOpen]);

  const purchaseAndGenerateLabel = () => {
    createLabel.mutate({
      rateId: selectedRate!.object_id,
      orderId: data,
      cost: selectedRate!.amount,
      carrier: selectedRate!.provider,
      timeEstimate: selectedRate!.duration_terms,
    });
  };

  const customerAddress = useMemo(() => {
    return {
      name: toAddress?.name ?? getCurrentOrder?.data?.name ?? undefined,
      street: toAddress?.street ?? getCurrentOrder?.data?.address?.street ?? "",
      additional:
        toAddress?.additional ??
        getCurrentOrder?.data?.address?.additional ??
        "",
      city: toAddress?.city ?? getCurrentOrder?.data?.address?.city ?? "",
      state: toAddress?.state ?? getCurrentOrder?.data?.address?.state ?? "",
      zip: toAddress?.zip ?? getCurrentOrder?.data?.address?.postal_code ?? "",
    };
  }, [toAddress, getCurrentOrder?.data]);

  const businessAddress = {
    name: fromAddress?.name ?? getStoreInfo?.data?.name ?? undefined,
    street: fromAddress?.street ?? getStoreInfo?.data?.address?.street ?? "",
    additional:
      fromAddress?.additional ?? getStoreInfo?.data?.address?.additional ?? "",
    city: fromAddress?.city ?? getStoreInfo?.data?.address?.city ?? "",
    state: fromAddress?.state ?? getStoreInfo?.data?.address?.state ?? "",
    zip: fromAddress?.zip ?? getStoreInfo?.data?.address?.postal_code ?? "",
  };

  const onCopy = (id: string) => {
    navigator.clipboard
      .writeText(id)
      .then(() => toastService.success("Tracking link copied to clipboard."))
      .catch((err: unknown) =>
        toastService.error("Failed to copy tracking link to clipboard.", err)
      );
  };

  return (
    <Modal
      title={
        getCurrentOrder?.data?.shippingLabel?.labelUrl
          ? "Download Shipping Label"
          : "Create Shipping Label"
      }
      description="Add a new store to manage products and categories."
      isOpen={shippingModal.isOpen}
      onClose={handleOnClose}
    >
      <div className="space-y-4 py-2 pb-4">
        {(label ?? getCurrentOrder?.data?.shippingLabel?.labelUrl) && (
          <div>
            {label && (
              <Label>
                Successful! Your account has been charged{" "}
                <strong>${selectedRate?.amount}</strong>
              </Label>
            )}

            <Link
              href={
                label?.label_url ??
                (getCurrentOrder?.data?.shippingLabel?.labelUrl as string)
              }
              target="_blank"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 "
            >
              Click to download the label
            </Link>

            <Button
              onClick={() =>
                onCopy(
                  label?.tracking_url_provider ??
                    (getCurrentOrder?.data?.shippingLabel
                      ?.trackingNumber as string)
                )
              }
            >
              Click here to copy the tracking number url
            </Button>
          </div>
        )}
        {!label && !getCurrentOrder?.data?.shippingLabel?.labelUrl && (
          <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="customer_address">Customer</TabsTrigger>{" "}
              <TabsTrigger value="business_address" disabled={!toAddress}>
                Business
              </TabsTrigger>
              <TabsTrigger
                value="package"
                disabled={!toAddress || !fromAddress}
              >
                Package
              </TabsTrigger>
              <TabsTrigger
                value="rates"
                disabled={!toAddress || !fromAddress || !parcel}
              >
                Get Rates
              </TabsTrigger>
              <TabsTrigger
                value="review"
                disabled={
                  !toAddress || !fromAddress || !parcel || !selectedRate
                }
              >
                Review
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customer_address">
              {customerAddress && getCurrentOrder?.isFetched && (
                <AddressForm
                  successCallback={(data) => {
                    setCustomerAddress(data);
                    setTabValue("business_address");
                  }}
                  initialData={customerAddress}
                />
              )}
            </TabsContent>
            <TabsContent value="business_address">
              {businessAddress && getStoreInfo?.isFetched && (
                <AddressForm
                  successCallback={(data) => {
                    setBusinessAddress(data);
                    setTabValue("package");
                  }}
                  initialData={businessAddress ?? null}
                />
              )}
            </TabsContent>
            <TabsContent value="package">
              <PackageForm
                successCallback={(data) => {
                  toastService.success("Package details saved to cache");
                  setParcel(data);
                  setTabValue("rates");
                }}
                errorCallback={(error: unknown) =>
                  toastService.error("Business address is invalid.", error)
                }
                initialData={parcel ?? null}
              />
            </TabsContent>

            <TabsContent value="rates">
              {getAvailableRates?.isLoading && <p>Getting rates ...</p>}
              {getAvailableRates?.isFetched && (
                <RatesForm
                  successCallback={() => {
                    toastService.success("Rate selected");
                    setTabValue("review");
                  }}
                  errorCallback={(error: unknown) => {
                    toastService.error(
                      "There was an issue selecting the rate. Please try again.",
                      error
                    );
                  }}
                  initialData={selectedRate ?? null}
                  availableRates={getAvailableRates?.data ?? []}
                />
              )}
            </TabsContent>
            <TabsContent value="review">
              <div className="flex flex-col gap-4 text-left">
                {fromAddress && (
                  <div className="justify-left  items-left flex w-full flex-col rounded-lg border p-4">
                    <h3 className={"font-semibold "}>From: </h3>
                    <p>{fromAddress.name}</p>
                    <p>{fromAddress.street}</p>
                    <p>{fromAddress.additional}</p>
                    <p>
                      {fromAddress.city}, {fromAddress.state} {fromAddress.zip}
                    </p>
                  </div>
                )}

                {toAddress && (
                  <div className="justify-left  items-left flex w-full flex-col rounded-lg border p-4">
                    <h3 className={"font-semibold "}>To: </h3>
                    <p>{toAddress.name}</p>
                    <p>{toAddress.street}</p>
                    <p>{toAddress.additional}</p>
                    <p>
                      {toAddress.city}, {toAddress.state} {toAddress.zip}
                    </p>
                  </div>
                )}

                {parcel && (
                  <div className="justify-left  items-left flex w-full flex-col rounded-lg border p-4">
                    <h3 className={"font-semibold "}>Package: </h3>
                    <p>
                      {parcel.package_length} x {parcel.package_width} x{" "}
                      {parcel.package_height} in
                    </p>

                    <p>
                      {parcel.package_weight_lbs} lbs {parcel.package_weight_oz}{" "}
                      oz
                    </p>
                  </div>
                )}

                {selectedRate && (
                  <div className="justify-left  items-left flex w-full flex-col rounded-lg border p-4">
                    <h3 className="font-bold">Rate: </h3>
                    <p>Cost: ${selectedRate.amount}</p>

                    <p>
                      {selectedRate.provider} --{" "}
                      {selectedRate.servicelevel?.name}
                    </p>
                    <p>{selectedRate.duration_terms}</p>
                  </div>
                )}

                <div className="flex w-full items-center justify-end space-x-2 pt-6">
                  <Button
                    variant={"outline"}
                    onClick={() => shippingModal.onClose()}
                  >
                    Cancel
                  </Button>{" "}
                  <Button
                    onClick={purchaseAndGenerateLabel}
                    disabled={createLabel.isLoading}
                    variant={"default"}
                  >
                    {createLabel.isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Purchase
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Modal>
  );
};
