import { ShippingPolicyPage as DefaultShippingPolicyPage } from "~/blueprints/core/shipping-policy-blueprint";
import { ShippingPolicyPage as CustomShippingPolicyPage } from "~/blueprints/custom/shipping-policy-blueprint.custom";

import useStorePageRender from "~/hooks/use-store-page-render";

const ShippingPolicyPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultShippingPolicyPage />;

  return <CustomShippingPolicyPage />;
};

export default ShippingPolicyPage;
