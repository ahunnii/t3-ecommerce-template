import type { FC } from "react";

import getProducts from "~/actions/core/get-products";

import { Product } from "@prisma/client";
import Head from "next/head";
import Image from "next/image";

import Billboard from "~/components/core/ui/billboard";

import StorefrontLayout from "~/layouts/storefront-layout";
import { api } from "~/utils/api";
import ExpressYourself from "../components/express-yourself";
import FeaturedCollections from "../components/featured-collections";
import Hero from "../components/hero";
import HomeGreetings from "../components/home-greetings";
import ProductList from "../components/product-list";
import ProductMosaic from "../components/product-mosaic";
import SiteBlurb from "../components/site-blurb";

export const HomePage = () => {
  const { data: products } = api.products.getAllProducts.useQuery({
    isFeatured: true,
  });

  return (
    <>
      <Head>
        <title>Homepage | Judy Sledge </title>
        <meta name="description" content="Admin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <StorefrontLayout
        bodyStyle="max-w-full"
        mainStyle=""
        navStyles="border-b-white"
      >
        <div className="max-w-full    bg-[url('/custom/wickedbackgroundalt.svg')] bg-cover bg-bottom bg-no-repeat">
          <Hero />
        </div>
        <div className="mx-auto flex  flex-col gap-y-8 bg-white px-4 py-16  shadow sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <ProductList
              title="Featured Products"
              items={products ?? []}
              subtitle={""}
            />
          </div>
        </div>
        <ExpressYourself />
        <ProductMosaic />
        <div className="flex  max-w-full flex-col bg-black/90">
          <FeaturedCollections />
        </div>

        <HomeGreetings />
        <div className="max-w-full   bg-[url('/custom/wickedbackgroundalt.svg')] bg-cover bg-bottom bg-no-repeat py-16">
          <SiteBlurb />
        </div>
      </StorefrontLayout>
    </>
  );
};
