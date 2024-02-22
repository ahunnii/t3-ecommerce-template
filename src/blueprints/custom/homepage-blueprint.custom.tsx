import { useState } from "react";

import Image from "next/image";
import Container from "~/components/core/ui/container";
import StorefrontLayout from "~/components/layouts/storefront-layout";
import { api } from "~/utils/api";

import { TaHero } from "~/components/custom/ta-hero";

import { InsideTrendAnomaly } from "~/components/custom/ta-inside-trend-anomaly.custom";
import { TaProductList } from "~/components/custom/ta-product-list.custom";

import Link from "next/link";

import { FeaturedBanner } from "~/components/wip/featured-banner.wip";
import { storeTheme } from "~/data/config.custom";

const metadata = {
  title: "Trend Anomaly",
  description: "Break out the system!",
};

export const HomePage = () => {
  const [hover, setHover] = useState(false);
  const [bleach, setBleach] = useState(false);
  const [custom, setCustom] = useState(false);
  const { data: products } = api.products.getAllProducts.useQuery({
    // isFeatured: true,
  });

  return (
    <>
      <StorefrontLayout
        {...storeTheme.layout}
        mainStyle="bg-black"
        metadata={metadata}
      >
        {/* <FeaturedBanner /> */}
        <div className="mx-auto my-8  max-w-7xl bg-black py-4">
          <TaHero />
        </div>

        <TaProductList items={products ?? []} />

        <h2 className="text-7xl font-bold text-purple-600">Collections</h2>
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
              className="relative aspect-square h-96 w-1/3 overflow-hidden bg-purple-500 bg-[url(/custom/ta_custom.png)] bg-cover bg-center transition-all duration-500 ease-in-out"
              onMouseOver={() => setCustom(true)}
              onMouseLeave={() => setCustom(false)}
            >
              <p className="absolute bottom-0 text-2xl font-bold text-white">
                Custom Clothing
              </p>
              {custom ? (
                <video
                  src="/custom/ta_custom.mp4"
                  className=" z-20 aspect-square object-cover object-center transition-all duration-500 ease-in-out"
                  autoPlay
                  loop
                  muted
                />
              ) : (
                <div className="h-full w-full bg-black/20 "></div>
              )}{" "}
            </Link>
          </div>
        </Container>
        <InsideTrendAnomaly />
      </StorefrontLayout>
    </>
  );
};