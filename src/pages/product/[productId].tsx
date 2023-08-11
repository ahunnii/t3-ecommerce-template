import getProduct from "~/actions/app/get-product";
import getProducts from "~/actions/app/get-products";
import Gallery from "~/components/app/gallery";
import Info from "~/components/app/info";
import ProductList from "~/components/app/product-list";

import StorefrontLayout from "~/layouts/StorefrontLayout";

export const revalidate = 0;

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export const getServerSideProps = async ({ params }: ProductPageProps) => {
  const product = await getProduct(params.productId);
  console.log(product);
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

const ProductPage = ({ product, suggestedProducts }) => {
  if (!product) {
    return null;
  }

  return (
    <div className="bg-white">
      <StorefrontLayout>
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
      </StorefrontLayout>
    </div>
  );
};

export default ProductPage;
