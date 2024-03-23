import { PageHeader } from "~/components/common/layout/page-header";
import StorefrontLayout from "~/components/layouts/storefront-layout";

import { storeTheme } from "~/data/config.custom";

const metadata = {
  title: `Refund Policy | Trend Anomaly`,
  description: "Learn more about our refund policy.",
};

const RefundPolicy = () => {
  return (
    <>
      <StorefrontLayout {...storeTheme.layout} metadata={metadata}>
        <PageHeader>Refund Policy</PageHeader>
        <section className="flex flex-col space-y-4">
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Thank you for shopping at Trend Anomaly, where we strive to provide
            you with unique handmade and customized items. We understand that
            sometimes you may need to make changes to your order, and we want to
            make that process as smooth as possible. Please read our return
            policy carefully:
          </p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            All Sales Are Final:
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            We take great care in crafting and customizing each item to meet
            your specifications. Due to the personalized nature of our products,
            all sales are considered final at the time of purchase. We encourage
            you to review your order details thoroughly before completing your
            purchase to ensure accuracy.
          </p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Exchanges:
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            In the rare event that you receive a damaged or defective item, or
            if there is a mistake on our part, we will gladly offer an exchange
            for the same item within one week of delivery. Please notify us of
            any issues with your order within this time frame by contacting our
            customer support team at [insert contact information].
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            To be eligible for an exchange, the item must be unused and in the
            same condition that you received it. It must also be in its original
            packaging. Once your exchange request is approved, we will provide
            you with instructions on returning the item and processing the
            exchange.
          </p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Non-Exchangeable Items:
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Please note that certain items, such as personalized or custom-made
            products, may not be eligible for exchange unless they are damaged
            or defective upon arrival. Additionally, items that have been used
            or altered in any way will not be accepted for exchange.
          </p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Shipping Costs:
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Customers are responsible for shipping costs associated with
            returning the item for exchange. However, if the exchange is due to
            an error on our part or if the item is damaged or defective, we will
            cover the return shipping costs.
          </p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Refunds:
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            As per our policy, we do not offer refunds for change of mind or
            buyer&apos;s remorse. Refunds will only be issued if we are unable
            to provide a suitable replacement for a damaged or defective item.
          </p>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Contact Us:
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            If you have any questions or concerns about our return policy,
            please don&apos;t hesitate to contact our customer support team at
            [insert contact information]. We are here to assist you and ensure
            your shopping experience with Trend Anomaly is enjoyable and
            hassle-free.
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            By making a purchase on our website, you acknowledge that you have
            read and agree to abide by our return policy.
          </p>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Thank you for choosing Trend Anomaly!
          </p>
        </section>
      </StorefrontLayout>
    </>
  );
};

export default RefundPolicy;
