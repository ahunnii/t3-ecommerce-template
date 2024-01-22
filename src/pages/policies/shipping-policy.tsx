import { ShippingPolicyPage as DefaultShippingPolicyPage } from "~/shop/core/pages/shipping-policy";
import { ShippingPolicyPage as CustomShippingPolicyPage } from "~/shop/custom/pages/shipping-policy";

import useStorePageRender from "~/hooks/use-store-page-render";

const ShippingPolicyPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultShippingPolicyPage />;

  return <CustomShippingPolicyPage />;
};

export default ShippingPolicyPage;
