import { useSearchParams } from "next/navigation";

import AttributeFilter from "~/components/core/category/attribute-filter";
import MobileFilters from "~/components/core/category/mobile-filters";
import Billboard from "~/components/core/ui/billboard";
import NoResults from "~/components/core/ui/no-results";
import ProductCard from "~/components/core/ui/product-card";

import StorefrontLayout from "~/layouts/storefront-layout";

import { api } from "~/utils/api";

import { useSession } from "next-auth/react";
import type { DetailedProductFull } from "~/types";

const AllProductsPage = () => {
  const searchParams = useSearchParams();

  const { data: products } = api.products.getAllStoreProducts.useQuery({
    queryString: searchParams.toString(),
  });

  const { data: attributes } =
    api.categories.getAllStoreCategoryAttributes.useQuery();

  const { data: billboard } = api.billboards.getBillboard.useQuery({
    billboardId: "d8f46e99-7e5d-474e-9577-8418b9653afd",
  });

  return (
    <StorefrontLayout>
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
    </StorefrontLayout>
  );
};

export default AllProductsPage;
