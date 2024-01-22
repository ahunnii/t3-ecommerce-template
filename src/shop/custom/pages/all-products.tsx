import Head from "next/head";
import { useSearchParams } from "next/navigation";

import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";
import AttributeFilter from "~/components/core/category/attribute-filter";
import MobileFilters from "~/components/core/category/mobile-filters";
import Billboard from "~/components/core/ui/billboard";
import NoResults from "~/components/core/ui/no-results";

import StorefrontLayout from "~/layouts/storefront-layout";

import { api } from "~/utils/api";

import ProductCard from "~/shop/custom/components/product-card";
import { storeTheme } from "~/shop/custom/config";

import type { DetailedProductFull } from "~/types";
import { cn } from "~/utils/styles";
import { SelectableFilter } from "../components/selectable-filter";

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
            {/* {billboard && (
              <Billboard
                data={billboard}
                textStyle="text-black mx-0"
                bgStyle="bg-center h-36 w-full "
                disableImage={true}
              />
            )} */}

            <div
              className={cn(
                "mx-auto w-full   px-4  py-8 text-left  text-3xl font-bold sm:text-5xl lg:text-6xl"
              )}
            >
              All Products
            </div>

            <div className="px-4 pb-24 sm:px-6 lg:px-8">
              <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
                {attributes && <MobileFilters data={attributes} />}

                <div className="mt-6 pb-8 lg:col-span-4 lg:mt-0 ">
                  <div className="hidden items-center gap-4 pb-4 lg:flex ">
                    <h2 className="py-4 text-lg text-slate-700">Filters</h2>
                    {attributes?.map((attribute, idx) => (
                      <SelectableFilter
                        key={idx}
                        valueKey={`${attribute.name.toLowerCase()}Variant`}
                        data={attribute}
                        // {...storeTheme.filter}
                      />
                    ))}
                  </div>

                  {products?.length === 0 && <NoResults />}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4">
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
