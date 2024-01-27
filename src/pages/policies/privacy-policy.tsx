import { PrivacyPolicyPage as DefaultPrivacyPolicyPage } from "~/blueprints/core/privacy-policy-blueprint";
import { PrivacyPolicyPage as CustomPrivacyPolicyPage } from "~/blueprints/custom/privacy-policy-blueprint.custom";

import useStorePageRender from "~/hooks/use-store-page-render";

const PrivacyPolicyPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultPrivacyPolicyPage />;

  return <CustomPrivacyPolicyPage />;
};

export default PrivacyPolicyPage;
