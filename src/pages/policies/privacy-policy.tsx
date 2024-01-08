import Head from "next/head";

import StorefrontLayout from "~/layouts/storefront-layout";

const PrivacyPolicyPage = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | DreamWalker Studios </title>
        <meta name="description" content="Admin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <StorefrontLayout>
        <div className="space-y-10 py-10">
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>

              <p className="mb-4">
                This Privacy Policy explains how [Your Company Name] collects,
                uses, and protects the personal information of individuals who
                use our services, including those who sign in through Auth0 for
                a streamlined and secure experience during the checkout process.
              </p>

              <h2 className="mb-4 text-2xl font-bold">
                1. Information We Collect:
              </h2>

              <p className="mb-4">
                <strong>a. Auth0 Information:</strong>
                <br /> When you sign in through Auth0, we collect limited
                information to facilitate a secure and personalized experience.
                This may include your name, email address, and any other
                information provided during the authentication process.
              </p>

              <p className="mb-4">
                <strong>b. Checkout Information:</strong>
                <br /> During the checkout process, we collect necessary
                information to fulfill your order, such as your shipping
                address, billing information, and contact details.
              </p>

              <h2 className="mb-4 text-2xl font-bold">
                2. How We Use Your Information:
              </h2>

              <p className="mb-4">
                <strong>a. Order Fulfillment:</strong>
                <br /> We use the information provided during checkout to
                process and fulfill your orders, ensuring that your products are
                delivered to the correct address in a timely manner.
              </p>

              <h2 className="mb-4 text-2xl font-bold">3. Data Security:</h2>

              <p className="mb-4">
                a. We prioritize the security of your personal information and
                employ industry-standard measures to protect it against
                unauthorized access, disclosure, alteration, or destruction.
              </p>

              <p className="mb-4">
                b. Auth0 handles the authentication process securely, and we do
                not store sensitive authentication data, such as passwords.
              </p>

              <h2 className="mb-4 text-2xl font-bold">
                6. Changes to this Privacy Policy:
              </h2>

              <p className="mb-4">
                We may update this Privacy Policy periodically to reflect
                changes in our practices. Any substantial changes will be
                communicated to you via email or through our website.
              </p>

              <h2 className="mb-4 text-2xl font-bold">7. Contact Us:</h2>

              <p className="mb-4">
                If you have any questions, concerns, or requests regarding your
                privacy or this policy, please contact our Data Protection
                Officer at{" "}
                <a href="mailto:dpo@yourcompany.com" className="text-blue-500">
                  dpo@yourcompany.com
                </a>
                .
              </p>

              <p className="mt-6 text-gray-500">
                Thank you for choosing [Your Company Name]! We value your trust
                and are committed to protecting your privacy.
              </p>
            </div>
          </div>
        </div>
      </StorefrontLayout>
    </>
  );
};

export default PrivacyPolicyPage;
