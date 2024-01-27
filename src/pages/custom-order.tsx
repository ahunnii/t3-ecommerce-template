import StorefrontLayout from "~/layouts/storefront-layout";

import { storeTheme } from "~/shop/custom/config";

const metadata = {
  title: `Custom Orders | Trend Anomaly`,
  description: "Break out the system!",
};

export const CustomOrderPage = () => {
  return (
    <StorefrontLayout {...storeTheme.layout} metadata={metadata}>
      <div className="py-10">
        <h1 className={storeTheme.layout.h1}>Custom Orders </h1>
        <p className={storeTheme.layout.p}>
          Have an idea for a custom piece? We can make it happen! Fill out the
          form below and we will get back to you with a quote.
        </p>

        <strong>Form coming soon</strong>
      </div>
    </StorefrontLayout>
  );
};
export default CustomOrderPage;
