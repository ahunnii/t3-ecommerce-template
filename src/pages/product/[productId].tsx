import type { GetStaticPropsContext } from "next";
import type { ParsedUrlQuery } from "querystring";
import type { FC } from "react";
import type { Product } from "~/types";

import getProduct from "~/actions/app/get-product";
import getProducts from "~/actions/app/get-products";

import Gallery from "~/components/app/gallery";
import Info from "~/components/app/info";
import ProductList from "~/components/app/product-list";
import PageLoader from "~/components/ui/page-loader";
import StorefrontLayout from "~/layouts/StorefrontLayout";

interface IProps {
  product: Product;
  suggestedProducts: Product[];
}

interface Params extends ParsedUrlQuery {
  productId: string;
}

const ProductPage: FC<IProps> = ({ product, suggestedProducts }) => {
  return (
    <StorefrontLayout>
      {!product && <PageLoader />}
      {product && (
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Gallery images={product.images} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <Info data={product} />
            </div>
          </div>
          <hr className="my-10" />
          <ProductList title="Related Items" items={suggestedProducts} />
        </div>
      )}
    </StorefrontLayout>
  );
};

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
  const { productId } = ctx.params as Params;

  const product = await getProduct(productId);
  const suggestedProducts = await getProducts({
    categoryId: product?.category?.id,
  });

  return {
    props: {
      product,
      suggestedProducts,
    },
  };
};

export const getStaticPaths = async () => {
  const slugs = await getProducts({});
  const paths = slugs.map((slug) => ({ params: { productId: slug.id } }));

  return {
    paths,
    fallback: "blocking",
  };
};

export default ProductPage;
