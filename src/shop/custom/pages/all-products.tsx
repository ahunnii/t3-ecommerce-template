import { useRouter, useSearchParams } from "next/navigation";

import { AbsolutePageLoader } from "~/components/core/absolute-page-loader";

import NoResults from "~/components/core/ui/no-results";

import MobileFilters from "~/modules/categories/core/mobile-filters";

import StorefrontLayout from "~/layouts/storefront-layout";

import { api } from "~/utils/api";

import ProductCard from "~/shop/custom/components/product-card";
import { storeTheme } from "~/shop/custom/config";

import { Button } from "~/components/ui/button";
import Breadcrumbs from "~/modules/categories/core/breadcrumbs";
import { useConfig } from "~/providers/style-config-provider";
import type { DetailedProductFull } from "~/types";
import { cn } from "~/utils/styles";
import { SelectableFilter } from "../components/selectable-filter";

const metadata = {
  title: "All Products | Trend Anomaly",
  description: "Browse all products available in our shop.",
};

export const AllProductsPage = () => {
  const searchParams = useSearchParams();

  const { data: products, isLoading: areProductsLoading } =
    api.products.getAllStoreProducts.useQuery({
      queryString: searchParams.toString(),
    });

  const { data: attributes } =
    api.categories.getAllStoreCategoryAttributes.useQuery();

  const config = useConfig();
  const router = useRouter();
  return (
    <StorefrontLayout {...storeTheme.layout} metadata={metadata}>
      {areProductsLoading && <AbsolutePageLoader />}
      {!areProductsLoading && (
        <>
          <Breadcrumbs pathway={[{ name: "All Products" }]} />
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {products?.map((item: DetailedProductFull) => (
                <ProductCard key={item.id} data={item} />
              ))}
            </div>
          </div>
        </>
      )}
    </StorefrontLayout>
  );
};

import { FilterIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export function PopoverDemo({ children }: { children: ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          Filter <FilterIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-screen">{children}</PopoverContent>
    </Popover>
  );
}
