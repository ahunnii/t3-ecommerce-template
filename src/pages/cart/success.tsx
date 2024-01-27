import { SuccessfulPurchasePage as DefaultSuccessPage } from "~/blueprints/core/cart-success-blueprint";
import { SuccessfulPurchasePage as CustomSuccessPage } from "~/blueprints/custom/cart-success-blueprint.custom";

import useStorePageRender from "~/hooks/use-store-page-render";

const SuccessPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultSuccessPage />;
  return <CustomSuccessPage />;
};

export default SuccessPage;
