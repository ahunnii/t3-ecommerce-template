import { UnauthorizedPage as DefaultUnauthorizedPage } from "~/blueprints/core/unauthorized-blueprint";
import { UnauthorizedPage as CustomUnauthorizedPage } from "~/blueprints/custom/unauthorized-blueprint.custom";

import useStorePageRender from "~/hooks/use-store-page-render";

const UnauthorizedPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultUnauthorizedPage />;

  return <CustomUnauthorizedPage />;
};

export default UnauthorizedPage;
