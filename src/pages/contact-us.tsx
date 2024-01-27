import { ContactUsPage as DefaultContactUsPage } from "~/blueprints/core/contact-us-blueprint";
import { ContactUsPage as CustomContactUsPage } from "~/blueprints/custom/contact-us-blueprint.custom";

import useStorePageRender from "~/hooks/use-store-page-render";

const ContactUsPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultContactUsPage />;

  return <CustomContactUsPage />;
};

export default ContactUsPage;
