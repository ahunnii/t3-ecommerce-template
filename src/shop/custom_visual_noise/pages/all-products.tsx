import Head from "next/head";
import { useSearchParams } from "next/navigation";

import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import AttributeFilter from "~/components/core/category/attribute-filter";
import MobileFilters from "~/components/core/category/mobile-filters";
import Billboard from "~/components/core/ui/billboard";
import NoResults from "~/components/core/ui/no-results";
import ProductCard from "~/components/core/ui/product-card";

import StorefrontLayout from "~/layouts/storefront-layout";

import { api } from "~/utils/api";

import { storeTheme } from "~/shop/custom/config";

import type { DetailedProductFull } from "~/types";

export const AllProductsPage = () => {
  const searchParams = useSearchParams();

  const { data: products, isLoading: areProductsLoading } =
    api.products.getAllStoreProducts.useQuery({
      queryString: searchParams.toString(),
    });

  const { data: attributes } =
    api.categories.getAllStoreCategoryAttributes.useQuery();

  const { data: billboard } = api.billboards.getBillboard.useQuery({
    billboardId: "3889d79c-f6ee-46c6-8259-d207a3279df7",
  });

  return (
    <>
      <Head>
        <title>All Products | Trend Anomaly</title>
        <meta
          name="description"
          content="Browse all products available in our shop."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StorefrontLayout {...storeTheme.layout}>
        {areProductsLoading && <AbsolutePageLoader />}
        {!areProductsLoading && (
          <>
            {billboard && (
              <Billboard
                data={billboard}
                textStyle="text-white mx-0"
                bgStyle="bg-center"
              />
            )}
            <div className="px-4 pb-24 sm:px-6 lg:px-8">
              <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
                {attributes && <MobileFilters data={attributes} />}
                <div className="hidden lg:block">
                  {attributes?.map((attribute, idx) => (
                    <AttributeFilter
                      key={idx}
                      valueKey={`${attribute.name.toLowerCase()}Variant`}
                      data={attribute}
                    />
                  ))}
                </div>
                <div className="mt-6 lg:col-span-4 lg:mt-0">
                  {products?.length === 0 && <NoResults />}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {products?.map((item: DetailedProductFull) => (
                      <ProductCard key={item.id} data={item} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </StorefrontLayout>
    </>
  );
};
