import type { FC } from "react";
import type { Product } from "~/types";

import getProducts from "~/actions/app/get-products";

import ProductList from "~/components/app/product-list";
import Billboard from "~/components/app/ui/billboard";
import StorefrontLayout from "~/layouts/StorefrontLayout";

interface IProps {
  products: Product[];
}
const HomePage: FC<IProps> = ({ products }) => {
  return (
    <StorefrontLayout>
      <div className="space-y-10 pb-10">
        <Billboard data={{ id: "000", label: "hero", imageUrl: "/hero.png" }} />
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="Featured Products" items={products} />
        </div>
      </div>
    </StorefrontLayout>
  );
};

export const getServerSideProps = async () => {
  const products = await getProducts({ isFeatured: true });
  return {
    props: {
      products,
    },
  };
};

export default HomePage;
