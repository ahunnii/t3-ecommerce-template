import { ContactUsPage as DefaultContactUsPage } from "~/shop/core/pages/contact-us";
import { ContactUsPage as CustomContactUsPage } from "~/shop/custom/pages/contact-us";

import useStorePageRender from "~/hooks/use-store-page-render";

const ContactUsPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultContactUsPage />;

  return <CustomContactUsPage />;
};

export default ContactUsPage;
