import { PageHeader } from "~/components/common/layout/page-header";
import StorefrontLayout from "~/components/layouts/storefront-layout";

import { storeTheme } from "~/data/config.custom";

const metadata = {
  title: `Refund Policy | Trend Anomaly`,
  description:
    "Learn more about our refund policy and how we handle the shipment of your orders.",
};

const RefundPolicy = () => {
  return (
    <>
      <StorefrontLayout {...storeTheme.layout} metadata={metadata}>
        <PageHeader>Refund Policy</PageHeader>
        <section className="flex flex-col space-y-4">
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Thank you for choosing <strong>Trend Anomaly</strong>! We are
            committed to providing you with quality products and a delightful
            shopping experience. Please take a moment to review our shipping
            policy for information on how we handle the shipment of your orders.
          </p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Processing Time:
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            All orders are typically processed within one week (7 days) from the
            date of purchase. Our dedicated team ensures that your items are
            crafted or prepared with care before being dispatched.
          </p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Shipping Fees:
          </h3>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>
              Orders under $100: A flat shipping fee of $15 will be applied to
              all orders with a total value below $100.
            </li>
            <li>
              Orders $100 and above: Enjoy free shipping on all orders totaling
              $100 or more.
            </li>
          </ul>

          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Shipping Carriers:
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            We primarily use trusted carriers such as USPS (United States Postal
            Service) and UPS (United Parcel Service) to ensure the secure and
            timely delivery of your items. The choice of carrier may depend on
            your location and the nature of the products ordered.
          </p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Shipping Methods:
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Standard shipping methods will be employed unless expedited options
            are selected during checkout. The shipping method may vary based on
            your location and the carrier chosen.
          </p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Delivery Time:
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Once your order has been processed and shipped, the estimated
            delivery time will depend on your location and the selected shipping
            method. Please note that unforeseen circumstances such as customs
            clearance or extreme weather conditions may impact delivery times.
          </p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Order Tracking:
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            A confirmation email with tracking information will be sent to you
            once your order has been shipped. This will enable you to monitor
            the progress of your delivery and estimate the arrival date.
          </p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            International Shipping:
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            At this time, we only offer shipping within [your country/region].
            We apologize for any inconvenience to our international customers
            and hope to expand our shipping services in the future.
          </p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Address Accuracy:
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Please ensure that you provide accurate shipping information during
            checkout. We cannot be held responsible for delays or undeliverable
            packages due to incorrect addresses provided by customers.
          </p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Order Changes and Cancellations:
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            If you need to make changes to your order or cancel it, please
            contact our customer support team as soon as possible. Once an order
            has been processed, changes may not be possible.
          </p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Questions or Concerns:
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            If you have any questions or concerns regarding your order or our
            shipping policy, please don&apos;t hesitate to contact our customer
            support team at{" "}
            <strong>[customer support email/phone number]</strong>.
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Thank you for choosing <strong>Trend Anomaly</strong>! We appreciate
            your business.
          </p>
        </section>
      </StorefrontLayout>
    </>
  );
};

export default RefundPolicy;
