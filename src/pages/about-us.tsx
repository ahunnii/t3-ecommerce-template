import { AboutUsPage as DefaultAboutUsPage } from "~/shop/core/pages/about-us";
import { AboutUsPage as CustomAboutUsPage } from "~/shop/custom/pages/about-us";

import useStorePageRender from "~/hooks/use-store-page-render";

const AboutUsPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultAboutUsPage />;

  return <CustomAboutUsPage />;
};

export default AboutUsPage;
