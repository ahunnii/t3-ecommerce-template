import axios from "axios";
import StorefrontLayout from "~/components/layouts/storefront-layout";

import { storeTheme } from "~/data/config.custom";
import { env } from "~/env.mjs";
import { CustomRequestForm } from "~/modules/custom-orders/components/custom-request-form";
import { CustomRequestFormValues } from "~/modules/custom-orders/types";
import { useEmail } from "~/services/email/hooks/use-email";
import { toastService } from "~/services/toast";
import { api } from "~/utils/api";

const metadata = {
  title: "Contact Us | Trend Anomaly",
  description: "Contact Us for any questions, concerns, or custom orders.",
};

export const CustomRequestPage = () => {
  const { sendEmail, isSending } = useEmail();

  const createCustomRequest = (data: CustomRequestFormValues) => {
    axios
      .post(env.NEXT_PUBLIC_API_URL + "/custom", data)
      .then(() => {
        toastService.success("Your request has been submitted!");
      })
      .catch((error: unknown) => {
        toastService.error(
          "You can only submit a total of three requests per day. Please try again tomorrow.",
          error
        );
      });
  };

  return (
    <StorefrontLayout
      bodyStyle="items-center justify-center flex"
      {...storeTheme.layout}
      metadata={metadata}
    >
      <div className="flex h-full flex-grow place-content-center items-center justify-center ">
        <div className=" my-auto flex flex-col-reverse gap-y-8 space-y-10  px-4  py-10  max-md:items-center sm:px-6  md:flex-row lg:px-8">
          <div className="justify-left mx-auto flex w-full flex-col gap-y-3 max-md:p-4 md:max-w-3xl ">
            <>
              {" "}
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Custom Request
              </h1>
              <p className="leading-7 ">
                Have a custom request? We&apos;d love to hear from you! Please
                fill out the form below.
              </p>
              <CustomRequestForm
                onSubmit={createCustomRequest}
                loading={isSending}
              />
            </>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};
