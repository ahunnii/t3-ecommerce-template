import Billboard from "~/components/app/ui/billboard";
import Container from "~/components/app/ui/container";
import NoResults from "~/components/app/ui/no-results";
import ProductCard from "~/components/app/ui/product-card";

import getCategory from "~/actions/app/get-category";
import getColors from "~/actions/app/get-colors";
import getProducts from "~/actions/app/get-products";
import getSizes from "~/actions/app/get-sizes";

import Filter from "~/components/app/category/filter";
import MobileFilters from "~/components/app/category/mobile-filters";
import StorefrontLayout from "~/layouts/StorefrontLayout";

export const revalidate = 0;

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
  query: {
    colorId?: string;
    sizeId?: string;
  };
}

export const getServerSideProps = async ({
  params,
  query,
}: CategoryPageProps) => {
  const searchParams = {
    colorId: query.colorId,
    sizeId: query.sizeId,
  };
  const products = await getProducts({
    categoryId: params.categoryId,
    colorId: searchParams.colorId,
    sizeId: searchParams.sizeId,
  });
  const sizes = await getSizes();
  const colors = await getColors();
  const category = await getCategory(params.categoryId);

  return {
    props: {
      products,
      sizes,
      colors,
      category,
    },
  };
};

const CategoryPage = ({ products, sizes, colors, category }) => {
  //   const products = await getProducts({
  //     categoryId: params.categoryId,
  //     colorId: searchParams.colorId,
  //     sizeId: searchParams.sizeId,
  //   });
  //   const sizes = await getSizes();
  //   const colors = await getColors();
  //   const category = await getCategory(params.categoryId);
  console.log(category.billboard);
  return (
    <div className="bg-white">
      <StorefrontLayout>
        <Billboard data={category.billboard} />
        <div className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            <MobileFilters sizes={sizes} colors={colors} />
            <div className="hidden lg:block">
              <Filter valueKey="sizeId" name="Sizes" data={sizes} />
              <Filter valueKey="colorId" name="Colors" data={colors} />
            </div>
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              {products.length === 0 && <NoResults />}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {products.map((item) => (
                  <ProductCard key={item.id} data={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </StorefrontLayout>
    </div>
  );
};

export default CategoryPage;
