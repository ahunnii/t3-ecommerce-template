import { GetServerSidePropsContext } from "next";
import getCollection from "~/actions/app/get-collection";
import getProducts from "~/actions/app/get-products";
import Billboard from "~/components/app/ui/billboard";
import Header from "~/components/app/ui/header";
import NoResults from "~/components/app/ui/no-results";
import ProductCard from "~/components/app/ui/product-card";
import StorefrontLayout from "~/layouts/StorefrontLayout";
import { Product } from "~/types";

const CollectionPage = ({ collection, products }) => {
  return (
    <StorefrontLayout>
      <Header data={collection} />
      <div className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mt-6 lg:col-span-4 lg:mt-0">
          {products.length === 0 && <NoResults />}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {products.map((item: Product) => (
              <ProductCard key={item.id} data={item} />
            ))}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default CollectionPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { collectionId } = ctx.query;

  const collection = await getCollection(collectionId as string);
  const products = await getProducts({
    collectionId: collection?.id,
  });

  return {
    props: {
      collection,
      products,
    },
  };
};
