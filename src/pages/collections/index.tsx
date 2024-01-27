import { CollectionPage as DefaultCollectionPage } from "~/shop/core/pages/all-collections";
import { CollectionPage as CustomCollectionPage } from "~/shop/custom/pages/all-collections";

import useStorePageRender from "~/hooks/use-store-page-render";

const CollectionPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultCollectionPage />;
  return <CustomCollectionPage />;
};

export default CollectionPage;
