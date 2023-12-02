import ProductList from "~/components/core/product/product-list";
import Billboard from "~/components/core/ui/billboard";
import StorefrontLayout from "~/layouts/StorefrontLayout";
import { api } from "~/utils/api";

import type { DetailedProduct, DetailedProductFull } from "~/types";

const HomePage = () => {
  const { data: products, isLoading } =
    api.products.getAllStoreProducts.useQuery({ isFeatured: true });

  return (
    <StorefrontLayout>
      <div className="space-y-10 pb-10">
        <Billboard data={{ id: "000", label: "hero", imageUrl: "/hero.png" }} />
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <ProductList
              title="Featured Products"
              items={(products as DetailedProductFull[]) ?? []}
            />
          )}
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default HomePage;
