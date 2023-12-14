import { useQuery } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { FC } from "react";
import getProducts from "~/actions/core/get-products";
import ProductList from "~/components/core/product/product-list";
import { env } from "~/env.mjs";

import StorefrontLayout from "~/layouts/StorefrontLayout";

import { api } from "~/utils/api";

const DynamicHomePage = dynamic(
  () => import(`~/components/${env.NEXT_PUBLIC_SITE_DIRECTORY}/pages/HomePage`),
  {
    ssr: false,
  }
);

const HomePage = () => {
  return (
    <>
      <Head>
        <title>Homepage | DreamWalker Studios</title>
        <meta name="description" content="Admin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DynamicHomePage />
    </>
  );
};

export default HomePage;
