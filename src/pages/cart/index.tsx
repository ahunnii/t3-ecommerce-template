import { CartPage as DefaultCartPage } from "~/shop/core/pages/cart-page";
import { CartPage as CustomCartPage } from "~/shop/custom/pages/cart-page";

import useStorePageRender from "~/hooks/use-store-page-render";

const CartPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultCartPage />;

  return <CustomCartPage />;
};

export default CartPage;
