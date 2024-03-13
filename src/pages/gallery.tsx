import GalleryCard from "~/components/core/ui/gallery-card";

import StorefrontLayout from "~/components/layouts/storefront-layout";

import { api } from "~/utils/api";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";
import { PageHeader } from "~/components/common/layout/page-header";
import { storeTheme } from "~/data/config.custom";

const metadata = {
  title: `Gallery | Trend Anomaly`,
  description: "Browse our gallery of products, events, and other coolness! ",
};
const GalleryPage = () => {
  const getGalleryImages = api.gallery.getGalleryImages.useQuery();

  return (
    <>
      <StorefrontLayout {...storeTheme.layout} metadata={metadata}>
        <PageHeader>Gallery</PageHeader>

        {getGalleryImages.isLoading && <AbsolutePageLoader />}

        {!getGalleryImages.isLoading && (
          <>
            {getGalleryImages?.data?.length === 0 ? (
              <p>
                We haven&apos;t posted anything yet, but check back later to see
                what we got going on!
              </p>
            ) : (
              <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {getGalleryImages?.data?.map((image, idx) => (
                  <GalleryCard key={idx} imageLink={image.url} />
                ))}
              </div>
            )}
          </>
        )}
      </StorefrontLayout>
    </>
  );
};

export default GalleryPage;
