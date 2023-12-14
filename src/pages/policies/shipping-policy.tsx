import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Head from "next/head";
import getProducts from "~/actions/core/get-products";
import ProductList from "~/components/core/product/product-list";
import { env } from "~/env.mjs";

import StorefrontLayout from "~/layouts/StorefrontLayout";

const DynamicShippingPolicyPage = dynamic(
  () =>
    import(
      `~/components/${env.NEXT_PUBLIC_SITE_DIRECTORY}/pages/ShippingPolicyPage`
    ),
  {
    ssr: false,
  }
);

const ShippingPolicyPage = () => {
  return (
    <>
      <Head>
        <title>Shipping Policy | DreamWalker Studios</title>
        <meta name="description" content="Admin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DynamicShippingPolicyPage />
    </>
  );
};

export default ShippingPolicyPage;
