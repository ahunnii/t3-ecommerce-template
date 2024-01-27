import { GalleryPage as DefaultGalleryPage } from "~/blueprints/core/gallery-page-blueprint";
import { GalleryPage as CustomGalleryPage } from "~/blueprints/custom/gallery-page-blueprint.custom";

import useStorePageRender from "~/hooks/use-store-page-render";

const GalleryPage = () => {
  const { isTemplate } = useStorePageRender();

  if (isTemplate) return <DefaultGalleryPage />;

  return <CustomGalleryPage />;
};

export default GalleryPage;
