import type { DetailedProductFull } from "~/types";

import AttributeFilter from "~/modules/categories/core/attribute-filter";

import { useParams, useSearchParams } from "next/navigation";
import NoResults from "~/components/common/no-results";
import StorefrontLayout from "~/components/layouts/storefront-layout";
import Billboard from "~/modules/billboards/components/billboard";
import MobileFilters from "~/modules/categories/core/mobile-filters";
import ProductCard from "~/modules/products/components/product-card.core";
import { api } from "~/utils/api";

const CategoryPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: category } = api.categories.getCategory.useQuery({
    categoryId: params?.categoryId as string,
  });

  const { data: products } = api.products.getAllStoreProducts.useQuery({
    categoryId: params?.categoryId as string,
    queryString: searchParams.toString(),
  });
  return (
    <StorefrontLayout>
      {category?.billboard && <Billboard data={category.billboard} />}
      {category && (
        <div className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            <MobileFilters data={category?.attributes} />
            <div className="hidden lg:block">
              {category?.attributes?.map((attribute, idx) => (
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
      )}
    </StorefrontLayout>
  );
};

export default CategoryPage;
