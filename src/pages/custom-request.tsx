import { ContactUsPage as DefaultContactUsPage } from "~/blueprints/core/contact-us-blueprint";
import { CustomRequestPage as CustomCustomRequestPage } from "~/blueprints/custom/custom-request-blueprint.custom";

import useStorePageRender from "~/hooks/use-store-page-render";

const CustomRequestPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultContactUsPage />;

  return <CustomCustomRequestPage />;
};

export default CustomRequestPage;
