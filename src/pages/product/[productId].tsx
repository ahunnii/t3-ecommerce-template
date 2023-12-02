import { useParams } from "next/navigation";

import Gallery from "~/components/core/gallery";
import Info from "~/components/core/info";
import ProductList from "~/components/core/product/product-list";
import PageLoader from "~/components/ui/page-loader";

import StorefrontLayout from "~/layouts/StorefrontLayout";

import { api } from "~/utils/api";

import type { DetailedProduct, DetailedProductFull } from "~/types";

const ProductPage = () => {
  const params = useParams();

  const { data: product, isLoading } = api.products.getProduct.useQuery({
    productId: params?.productId as string,
  });

  const { data: suggested } = api.products.getAllSuggestedProducts.useQuery({
    categoryId: product?.category?.id ?? "",
  });

  return (
    <StorefrontLayout>
      {isLoading && <PageLoader />}
      {!isLoading && product && (
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Gallery images={product?.images} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <Info data={product} />
            </div>
          </div>
          <hr className="my-10" />
          {suggested && (
            <ProductList
              title="Related Items"
              items={(suggested as DetailedProductFull[]) ?? []}
            />
          )}
        </div>
      )}
    </StorefrontLayout>
  );
};

export default ProductPage;
