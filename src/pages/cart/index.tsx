import { CartPageBlueprint as DefaultCartPage } from "~/blueprints/core/cart-page-blueprint";
import { CartPageBlueprint as CustomCartPage } from "~/blueprints/custom/cart-page-blueprint.custom";

import useStorePageRender from "~/hooks/use-store-page-render";

const CartPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultCartPage />;
  return <CustomCartPage />;
};

export default CartPage;
