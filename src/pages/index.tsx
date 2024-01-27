import { HomePage as DefaultHomePage } from "~/blueprints/core/homepage-blueprint";
import { HomePage as CustomHomePage } from "~/blueprints/custom/homepage-blueprint.custom";

import useStorePageRender from "~/hooks/use-store-page-render";

const HomePage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultHomePage />;

  return <CustomHomePage />;
};

export default HomePage;
