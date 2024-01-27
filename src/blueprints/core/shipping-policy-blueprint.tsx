import Head from "next/head";

import StorefrontLayout from "~/components/layouts/storefront-layout";

export const ShippingPolicyPage = () => {
  return (
    <>
      <StorefrontLayout>
        <div className="space-y-10 py-10">
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold">Shipping Policy</h3>
              <p>
                Thank you for choosing [Your Company Name]! We are committed to
                providing you with quality products and a delightful shopping
                experience. Please take a moment to review our shipping policy
                for information on how we handle the shipment of your orders.
              </p>
              <h4 className="text-xl">Processing Time:</h4>
              <p>
                All orders are typically processed within one week (7 days) from
                the date of purchase. Our dedicated team ensures that your items
                are crafted or prepared with care before being dispatched.
              </p>
              <h4 className="text-xl">Shipping Fees:</h4>- Orders under $100: A
              flat shipping fee of $15 will be applied to all orders with a
              total value below $100. - Orders $100 and above: Enjoy free
              shipping on all orders totaling $100 or more.
              <h4 className="text-xl">Shipping Carriers:</h4>
              <p>
                We primarily use trusted carriers such as USPS (United States
                Postal Service) and UPS (United Parcel Service) to ensure the
                secure and timely delivery of your items. The choice of carrier
                may depend on your location and the nature of the products
                ordered.
              </p>
              <h4 className="text-xl">Shipping Methods:</h4>
              <p>
                Standard shipping methods will be employed unless expedited
                options are selected during checkout. The shipping method may
                vary based on your location and the carrier chosen.
              </p>
              <h4 className="text-xl">Delivery Time:</h4>
              <p>
                Once your order has been processed and shipped, the estimated
                delivery time will depend on your location and the selected
                shipping method. Please note that unforeseen circumstances such
                as customs clearance or extreme weather conditions may impact
                delivery times.
              </p>
              <h4 className="text-xl">Order Tracking:</h4>
              <p>
                A confirmation email with tracking information will be sent to
                you once your order has been shipped. This will enable you to
                monitor the progress of your delivery and estimate the arrival
                date.
              </p>
              <h4 className="text-xl">International Shipping:</h4>
              <p>
                At this time, we only offer shipping within [your
                country/region]. We apologize for any inconvenience to our
                international customers and hope to expand our shipping services
                in the future.
              </p>
              <h4 className="text-xl">Address Accuracy:</h4>
              <p>
                Please ensure that you provide accurate shipping information
                during checkout. We cannot be held responsible for delays or
                undeliverable packages due to incorrect addresses provided by
                customers.
              </p>
              <h4 className="text-xl">Order Changes and Cancellations:</h4>
              <p>
                If you need to make changes to your order or cancel it, please
                contact our customer support team as soon as possible. Once an
                order has been processed, changes may not be possible.
              </p>
              <h4 className="text-xl">Questions or Concerns:</h4>
              <p>
                If you have any questions or concerns regarding your order or
                our shipping policy, please don&apos;t hesitate to contact our
                customer support team at [customer support email/phone number].
              </p>
              <p>
                Thank you for choosing [Your Company Name]! We appreciate your
                business.
              </p>
            </div>
          </div>
        </div>
      </StorefrontLayout>
    </>
  );
};
