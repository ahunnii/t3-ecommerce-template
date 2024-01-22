import useStorePageRender from "~/hooks/use-store-page-render";

import { AllProductsPage as DefaultAllProductPage } from "~/shop/core/pages/all-products";
import { AllProductsPage as CustomAllProductPage } from "~/shop/custom/pages/all-products";

const AllProductsPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultAllProductPage />;

  return <CustomAllProductPage />;
};

export default AllProductsPage;
