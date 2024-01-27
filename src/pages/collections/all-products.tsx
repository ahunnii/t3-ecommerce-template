import useStorePageRender from "~/hooks/use-store-page-render";

import { AllProductsPage as DefaultAllProductPage } from "~/blueprints/core/all-products-blueprint";
import { AllProductsPage as CustomAllProductPage } from "~/blueprints/custom/all-products-blueprint.custom";

const AllProductsPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultAllProductPage />;

  return <CustomAllProductPage />;
};

export default AllProductsPage;
