import GalleryCard from "~/components/core/ui/gallery-card";

import StorefrontLayout from "~/layouts/storefront-layout";

import { api } from "~/utils/api";

import { SEO } from "~/shop/custom/components/seo-head";
import { storeTheme } from "~/shop/custom/config";
export const GalleryPage = () => {
  const { data: products } = api.products.getAllProducts.useQuery({});

  const items = products?.map((product) => product.images[0]?.url) ?? [];

  return (
    <>
      <SEO
        title={`Gallery | Trend Anomaly`}
        description={
          "Browse our gallery of products, events, and other coolness! "
        }
      />
      <StorefrontLayout {...storeTheme.layout}>
        <div className="space-y-10 py-10">
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <h1 className="mb-6 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Gallery
              </h1>
              <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {items.map((item, idx) => (
                  <GalleryCard key={idx} data={item!} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </StorefrontLayout>
    </>
  );
};