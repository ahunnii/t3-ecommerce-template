import { useState, type FC } from "react";

import Head from "next/head";

import Image from "next/image";
import Container from "~/components/core/ui/container";
import StorefrontLayout from "~/layouts/storefront-layout";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";
import Hero from "../components/Hero";

import { InsideTrendAnomaly } from "../components/inside-trend-anomaly";
import ProductList from "../components/product-list";

import Link from "next/link";
import { SEO } from "~/shop/custom/components/seo-head";
import { storeTheme } from "~/shop/custom/config";
export const HomePage = () => {
  const [hover, setHover] = useState(false);
  const [bleach, setBleach] = useState(false);
  const { data: products } = api.products.getAllProducts.useQuery({
    isFeatured: true,
  });

  return (
    <>
      <SEO title={`Trend Anomaly`} description={"Break out the system!"} />

      <StorefrontLayout {...storeTheme.layout}>
        <div className="mx-auto my-8  max-w-7xl bg-black py-4">
          <Hero />
        </div>

        <ProductList items={products ?? []} />

        <Container>
          {" "}
          <div className="mx-auto mb-8 flex  max-w-7xl gap-4">
            <Link
              href="/collections/ff0990fa-b6f4-4cea-a391-46b05b9b04b8"
              className="relative aspect-square h-96 w-1/3 overflow-hidden bg-purple-500 bg-[url(/custom/ta_bleach.jpg)] bg-cover bg-center transition-all duration-500 ease-in-out"
              onMouseOver={() => setBleach(true)}
              onMouseLeave={() => setBleach(false)}
            >
              <p className="absolute bottom-0 z-10 text-2xl font-bold text-white">
                The Bleach Collection
              </p>
              {bleach ? (
                <Image
                  src="/custom/ta_bleach.gif"
                  className=" z-0 aspect-square object-cover object-center transition-all duration-500 ease-in-out"
                  fill
                  alt=""
                />
              ) : (
                <div className="h-full w-full bg-black/20 "></div>
              )}{" "}
            </Link>
            <Link
              href="/collections/1bf47853-88a3-40a3-9dc8-cd5954ad9b68"
              className="relative aspect-square h-96 w-1/3 overflow-hidden bg-purple-500 bg-[url(/custom/ta_embroidery_still_alt.png)] bg-cover bg-center transition-all duration-500 ease-in-out"
              onMouseOver={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <p className="absolute bottom-0 text-2xl font-bold text-white">
                The Embroidery Collection
              </p>
              {hover ? (
                <video
                  src="/custom/ta_embroidery.mp4"
                  className=" z-20 aspect-square object-cover object-center transition-all duration-500 ease-in-out"
                  autoPlay
                  loop
                  muted
                />
              ) : (
                <div className="h-full w-full bg-black/20 "></div>
              )}{" "}
            </Link>
            <Link
              href="/contact-us"
              className="relative aspect-square h-96 w-1/3 bg-purple-500"
            >
              <p className="absolute bottom-0 text-2xl font-bold text-white">
                Custom Made
              </p>
            </Link>
          </div>
        </Container>
        <InsideTrendAnomaly />
      </StorefrontLayout>
    </>
  );
};
