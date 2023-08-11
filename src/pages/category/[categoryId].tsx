import type { GetStaticPropsContext } from "next";
import type { ParsedUrlQuery } from "querystring";
import type { FC } from "react";
import type { Category, Color, Product, Size } from "~/types";

import getCategories from "~/actions/app/get-categories";
import getCategory from "~/actions/app/get-category";
import getColors from "~/actions/app/get-colors";
import getProducts from "~/actions/app/get-products";
import getSizes from "~/actions/app/get-sizes";

import Filter from "~/components/app/category/filter";
import MobileFilters from "~/components/app/category/mobile-filters";
import Billboard from "~/components/app/ui/billboard";
import NoResults from "~/components/app/ui/no-results";
import ProductCard from "~/components/app/ui/product-card";
import StorefrontLayout from "~/layouts/StorefrontLayout";

interface IProps {
  category: Category;
  products: Product[];
  sizes: Size[];
  colors: Color[];
}

interface Params extends ParsedUrlQuery {
  colorId: string;
  sizeId: string;
  categoryId: string;
}

const CategoryPage: FC<IProps> = ({ products, sizes, colors, category }) => {
  return (
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
              {products.map((item: Product) => (
                <ProductCard key={item.id} data={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
  const { colorId, sizeId, categoryId } = ctx.params as Params;

  const products = await getProducts({
    categoryId,
    colorId,
    sizeId,
  });
  const sizes = await getSizes();
  const colors = await getColors();
  const category = await getCategory(categoryId);

  return {
    props: {
      products,
      sizes,
      colors,
      category,
    },
  };
};

export const getStaticPaths = async () => {
  const slugs = await getCategories();

  const paths = slugs.map((slug) => ({ params: { categoryId: slug.id } }));

  return {
    paths,
    fallback: "blocking",
  };
};

export default CategoryPage;
