import { useRouter, useSearchParams } from "next/navigation";

import { api } from "~/utils/api";

import { storeTheme } from "~/data/config.custom";

import { AbsolutePageLoader } from "~/components/common/absolute-page-loader";

import NoResults from "~/components/common/no-results";

import StorefrontLayout from "~/components/layouts/storefront-layout";

import { Button } from "~/components/ui/button";

import { SelectableFilter } from "~/components/wip/selectable-filter.wip";
import MobileFilters from "~/modules/categories/core/mobile-filters";

import { useConfig } from "~/providers/style-config-provider";

import { cn } from "~/utils/styles";

import { TaBreadCrumbs } from "~/components/custom/ta-breadcrumbs.custom";
import { TaProductCard } from "~/components/custom/ta-product-card.custom";
import { DetailedProductFull } from "~/modules/products/types";

const metadata = {
  title: "All Products | Trend Anomaly",
  description: "Browse all products available in our shop.",
};

const AllProductsPage = () => {
  const searchParams = useSearchParams();

  const { data: products, isLoading: areProductsLoading } =
    api.products.getAllStoreProducts.useQuery({
      queryString: searchParams.toString(),
    });

  const { data: attributes } =
    api.categories.getAllStoreCategoryAttributes.useQuery({});

  const { data: sales } = api.discounts.getActiveSiteSales.useQuery({});

  const config = useConfig();
  const router = useRouter();

  return (
    <StorefrontLayout {...storeTheme.layout} metadata={metadata}>
      {areProductsLoading && <AbsolutePageLoader />}

      {!areProductsLoading && (
        <>
          <TaBreadCrumbs pathway={[{ name: "All Products" }]} />
          <h1 className={cn("", config.typography.h1)}>All Products</h1>

          <div className="mt-6 lg:col-span-4 ">
            <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
              {attributes && <MobileFilters data={attributes} />}

              <div className="mt-6 hidden items-center gap-4 py-4 lg:col-span-4 lg:mt-0 lg:flex">
                {/* <h2 className="py-4 text-lg text-slate-700">Filters</h2> */}

                {attributes?.map((attribute, idx) => (
                  <SelectableFilter
                    key={idx}
                    valueKey={`${attribute.name.toLowerCase()}Variant`}
                    data={attribute}
                  />
                ))}

                <Button
                  onClick={() => router.replace("/collections/all-products")}
                  size={"sm"}
                >
                  Clear
                </Button>
              </div>
            </div>

            {products?.length === 0 && <NoResults />}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products?.map((item) => (
                <TaProductCard
                  key={item.id}
                  data={item as DetailedProductFull}
                  variant={"default"}
                  size={"default"}
                  discounts={[...(sales ?? []), ...item?.discounts] ?? []}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </StorefrontLayout>
  );
};

export default AllProductsPage;
