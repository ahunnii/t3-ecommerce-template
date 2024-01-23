import CheckoutLayout from "~/layouts/CheckoutLayout";
import { PaymentForm } from "~/modules/cart/components/payment-form";
const PaymentReview = () => {
  return (
    <CheckoutLayout>
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-black">
          Choose a payment method
        </h1>
        <div className="mt-12 gap-x-12 lg:grid lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <PaymentForm />
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
};
export default PaymentReview;
