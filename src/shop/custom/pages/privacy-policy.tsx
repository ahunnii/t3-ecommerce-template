import StorefrontLayout from "~/layouts/storefront-layout";

import { SEO } from "~/shop/custom/components/seo-head";
import { storeTheme } from "~/shop/custom/config";
export const PrivacyPolicyPage = () => {
  return (
    <>
      <SEO
        title={`Privacy Policy | Trend Anomaly`}
        description={
          "Learn more about our we use your data and how we protect your privacy."
        }
      />

      <StorefrontLayout {...storeTheme.layout}>
        <div className="space-y-10 py-10 ">
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Privacy Policy
              </h1>

              <p className="leading-7 [&:not(:first-child)]:mt-6">
                This Privacy Policy explains how <strong>Trend Anomaly</strong>{" "}
                collects, uses, and protects the personal information of
                individuals who use our services, including those who sign in
                through Auth0 for a streamlined and secure experience during the
                checkout process.
              </p>

              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                1. Information We Collect:
              </h2>

              <p className="leading-7 [&:not(:first-child)]:mt-6">
                <strong>a. Auth0 Information:</strong>
                <br /> When you sign in through Auth0, we collect limited
                information to facilitate a secure and personalized experience.
                This may include your name, email address, and any other
                information provided during the authentication process.
              </p>

              <p className="leading-7 [&:not(:first-child)]:mt-6">
                <strong>b. Checkout Information:</strong>
                <br /> During the checkout process, we collect necessary
                information to fulfill your order, such as your shipping
                address, billing information, and contact details.
              </p>

              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                2. How We Use Your Information:
              </h2>

              <p className="leading-7 [&:not(:first-child)]:mt-6">
                <strong>a. Order Fulfillment:</strong>
                <br /> We use the information provided during checkout to
                process and fulfill your orders, ensuring that your products are
                delivered to the correct address in a timely manner.
              </p>

              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                3. Data Security:
              </h2>

              <p className="leading-7 [&:not(:first-child)]:mt-6">
                a. We prioritize the security of your personal information and
                employ industry-standard measures to protect it against
                unauthorized access, disclosure, alteration, or destruction.
              </p>

              <p className="leading-7 [&:not(:first-child)]:mt-6">
                b. Auth0 handles the authentication process securely, and we do
                not store sensitive authentication data, such as passwords.
              </p>

              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                4. Changes to this Privacy Policy:
              </h2>

              <p className="leading-7 [&:not(:first-child)]:mt-6">
                We may update this Privacy Policy periodically to reflect
                changes in our practices. Any substantial changes will be
                communicated to you via email or through our website.
              </p>

              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                5. Contact Us:
              </h2>

              <p className="leading-7 [&:not(:first-child)]:mt-6">
                If you have any questions, concerns, or requests regarding your
                privacy or this policy, please contact us at{" "}
                <a href="#!" className="text-blue-500">
                  <strong> [customer support email/phone number]</strong>
                </a>
                .
              </p>

              <p className="leading-7 [&:not(:first-child)]:mt-6">
                Thank you for choosing <strong>Trend Anomaly</strong>! We value
                your trust and are committed to protecting your privacy.
              </p>
            </div>
          </div>
        </div>
      </StorefrontLayout>
    </>
  );
};
