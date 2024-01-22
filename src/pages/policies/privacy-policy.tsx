import { PrivacyPolicyPage as DefaultPrivacyPolicyPage } from "~/shop/core/pages/privacy-policy";
import { PrivacyPolicyPage as CustomPrivacyPolicyPage } from "~/shop/custom/pages/privacy-policy";

import useStorePageRender from "~/hooks/use-store-page-render";

const PrivacyPolicyPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultPrivacyPolicyPage />;

  return <CustomPrivacyPolicyPage />;
};

export default PrivacyPolicyPage;
