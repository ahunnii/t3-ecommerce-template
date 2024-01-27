import { Facebook, Instagram, Twitter } from "lucide-react";

import StorefrontLayout from "~/components/layouts/storefront-layout";

import { ContactFormBasic } from "~/modules/contact/components/contact-form-basic";
import { ContactInfo } from "~/modules/contact/components/contact-info";

import { storeTheme } from "~/data/config.custom";
import { useEmail } from "~/services/email/hooks/use-email";

const metadata = {
  title: "Contact Us | Trend Anomaly",
  description: "Contact Us for any questions, concerns, or custom orders.",
};

const contactData = {
  location: "Southfield, MI 48034",
  hours: ["Sunday CLOSED", "Mon - Sat 10am - 6pm"],
  socials: [
    {
      Icon: Facebook,
      href: "/",
      name: "Facebook",
    },
    {
      Icon: Instagram,
      href: "https://www.instagram.com/trendanomaly/?hl=en",
      name: "Instagram",
    },
    {
      Icon: Twitter,
      href: "/",
      name: "Twitter",
    },
  ],
};

export const ContactUsPage = () => {
  const { sendEmail, isSending } = useEmail();

  return (
    <StorefrontLayout
      bodyStyle="items-center justify-center flex"
      {...storeTheme.layout}
      metadata={metadata}
    >
      <div className="flex h-full flex-grow place-content-center items-center justify-center ">
        <div className=" my-auto flex flex-col-reverse gap-y-8 space-y-10  px-4  py-10  max-md:items-center sm:px-6  md:flex-row lg:px-8">
          <div className="justify-left mx-auto flex w-full flex-col gap-y-3 max-md:p-4 md:w-6/12">
            <>
              {" "}
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Contact Us
              </h1>
              <p className="leading-7 ">
                Got a question? Need help with an order? Want to let us know
                your thoughts on a product or collection? Send us a message
                using the contact form below, or just shoot an email to
                store@trendanomaly.com.
              </p>
              <ContactFormBasic onSubmit={sendEmail} loading={isSending} />
            </>

            <p></p>

            <ContactInfo {...contactData} />
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};
