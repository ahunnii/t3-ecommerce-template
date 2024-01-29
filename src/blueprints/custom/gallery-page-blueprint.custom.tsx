import GalleryCard from "~/components/core/ui/gallery-card";

import StorefrontLayout from "~/components/layouts/storefront-layout";

import { api } from "~/utils/api";

import { storeTheme } from "~/data/config.custom";

const metadata = {
  title: `Gallery | Trend Anomaly`,
  description: "Browse our gallery of products, events, and other coolness! ",
};
export const GalleryPage = () => {
  const { data: galleryImages } = api.gallery.getAllGalleryImages.useQuery({});

  const items = galleryImages?.map((image) => image.url) ?? [];

  return (
    <>
      <StorefrontLayout {...storeTheme.layout} metadata={metadata}>
        <div className="space-y-10 py-10">
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <h1 className="mb-6 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Gallery
              </h1>
              <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {items.map((item, idx) => (
                  <GalleryCard key={idx} data={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </StorefrontLayout>
    </>
  );
};
