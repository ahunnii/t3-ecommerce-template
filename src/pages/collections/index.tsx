import { CollectionPage as DefaultCollectionPage } from "~/blueprints/core/collections-blueprint";
import { CollectionPage as CustomCollectionPage } from "~/blueprints/custom/collections-blueprint.custom";

import useStorePageRender from "~/hooks/use-store-page-render";

const CollectionPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultCollectionPage />;
  return <CustomCollectionPage />;
};

export default CollectionPage;
