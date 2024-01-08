import Head from "next/head";

import ProductList from "~/components/core/product/product-list";
import StorefrontLayout from "~/layouts/storefront-layout";

import { api } from "~/utils/api";

const HomePage = () => {
  const { data: products, isLoading } = api.products.getAllProducts.useQuery({
    isFeatured: true,
  });
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Check out iPhone 12 XR Pro and iPhone 12 Pro Max. Visit your local store and for expert advice."
        />
      </Head>

      <StorefrontLayout>
        <div className="space-y-10 pb-10">
          <div className="overflow-hidden rounded-xl p-4 sm:p-6 lg:p-8">
            <div
              style={{ backgroundImage: `url(${"/hero.png"})` }}
              className="relative aspect-square overflow-hidden rounded-xl bg-cover md:aspect-[2.4/1]"
            ></div>
          </div>

          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <ProductList title="Featured Products" items={products! ?? []} />
            )}
          </div>
        </div>
      </StorefrontLayout>
    </>
  );
};

export default HomePage;
