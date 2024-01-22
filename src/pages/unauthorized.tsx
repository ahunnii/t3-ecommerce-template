import { UnauthorizedPage as DefaultUnauthorizedPage } from "~/shop/core/pages/unauthorized";
import { UnauthorizedPage as CustomUnauthorizedPage } from "~/shop/custom/pages/unauthorized";

import useStorePageRender from "~/hooks/use-store-page-render";

const UnauthorizedPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultUnauthorizedPage />;

  return <CustomUnauthorizedPage />;
};

export default UnauthorizedPage;
