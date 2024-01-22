import { HomePage as DefaultHomePage } from "~/shop/core/pages/homepage";
import { HomePage as CustomHomePage } from "~/shop/custom/pages/homepage";

import useStorePageRender from "~/hooks/use-store-page-render";

const HomePage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultHomePage />;

  return <CustomHomePage />;
};

export default HomePage;
