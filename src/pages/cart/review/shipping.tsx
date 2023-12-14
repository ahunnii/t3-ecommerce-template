import { ShippingForm } from "~/components/core/cart/shipping-form";
import CheckoutLayout from "~/layouts/CheckoutLayout";

const ShippingReview = () => {
  return (
    <CheckoutLayout>
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-black">
          Where are we shipping to?
        </h1>
        <div className="mt-12 gap-x-12 lg:grid lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <ShippingForm />
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
};
export default ShippingReview;
