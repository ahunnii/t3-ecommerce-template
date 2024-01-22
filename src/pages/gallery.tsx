import { GalleryPage as DefaultGalleryPage } from "~/shop/core/pages/gallery";
import { GalleryPage as CustomGalleryPage } from "~/shop/custom/pages/gallery";

import useStorePageRender from "~/hooks/use-store-page-render";

const GalleryPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultGalleryPage />;

  return <CustomGalleryPage />;
};

export default GalleryPage;
