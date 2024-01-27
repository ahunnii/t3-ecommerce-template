import { AboutUsPage as DefaultAboutUsPage } from "~/blueprints/core/about-us-blueprint";
import { AboutUsPage as CustomAboutUsPage } from "~/blueprints/custom/about-us-blueprint.custom";

import useStorePageRender from "~/hooks/use-store-page-render";

const AboutUsPage = () => {
  const { isTemplate } = useStorePageRender();
  if (isTemplate) return <DefaultAboutUsPage />;
  return <CustomAboutUsPage />;
};

export default AboutUsPage;
