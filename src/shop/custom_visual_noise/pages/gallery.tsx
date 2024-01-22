import Head from "next/head";

import GalleryCard from "~/components/core/ui/gallery-card";
import StorefrontLayout from "~/layouts/storefront-layout";

import Container from "~/components/core/ui/container";
import { api } from "~/utils/api";
import Footer from "../components/footer";
import Navbar from "../modules/navigation/navbar";
export const GalleryPage = () => {
  const { data: products } = api.products.getAllProducts.useQuery({});

  const items = products?.map((product) => product.images[0]?.url) ?? [];

  return (
    <>
      <Head>
        <title>Gallery | DreamWalker Studios</title>
        <meta name="description" content="Admin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StorefrontLayout
        mainStyle="bg-black"
        bodyStyle="max-w-full"
        navStyles="bg-black border-b-black"
        NavBar={Navbar}
        Footer={Footer}
      >
        <Container>
          {" "}
          <div className="space-y-10 py-10">
            <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-white">Gallery</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {items.map((item, idx) => (
                    <GalleryCard key={idx} data={item!} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </StorefrontLayout>
    </>
  );
};
