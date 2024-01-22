import { SuccessfulPurchasePage as DefaultSuccessPage } from "~/shop/core/pages/success";
import { SuccessfulPurchasePage as CustomSuccessPage } from "~/shop/custom/pages/success";

import useStorePageRender from "~/hooks/use-store-page-render";

const SuccessPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultSuccessPage />;

  return <CustomSuccessPage />;
};

export default SuccessPage;
