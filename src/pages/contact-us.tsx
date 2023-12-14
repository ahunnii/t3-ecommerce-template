import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Head from "next/head";
import getProducts from "~/actions/core/get-products";
import ProductList from "~/components/core/product/product-list";
import GalleryCard from "~/components/core/ui/gallery-card";
import { env } from "~/env.mjs";

import StorefrontLayout from "~/layouts/StorefrontLayout";
import { api } from "~/utils/api";

const DynamicContactUsPage = dynamic(
  () =>
    import(
      `~/components/${env.NEXT_PUBLIC_SITE_DIRECTORY}/pages/ContactUsPage`
    ),
  {
    ssr: false,
  }
);

const ContactUsPage = () => {
  return (
    <>
      <Head>
        <title>Contact Us | DreamWalker Studios</title>
        <meta name="description" content="Admin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DynamicContactUsPage />
    </>
  );
};

export default ContactUsPage;
