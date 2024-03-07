/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

import Container from "~/components/core/ui/container";
import StorefrontLayout from "~/components/layouts/storefront-layout";
import { api } from "~/utils/api";

import { TaHero } from "~/components/custom/ta-hero";

import { InsideTrendAnomaly } from "~/components/custom/ta-inside-trend-anomaly.custom";

import Marquee from "~/components/wip/marquee/ta-marquee.wip";

import { ProductCardMarquee } from "~/components/wip/product-card-marquee.wip";

import { TaProductGrid } from "~/components/custom/ta-product-grid.custom";

import Link from "next/link";
import { TaVideoCategoryCard } from "~/components/custom/ta-video-category-card.wip";
import { Button } from "~/components/ui/button";
import { storeTheme } from "~/data/config.custom";

const metadata = {
  title: "Trend Anomaly",
  description: "Break out the system!",
};

export const HomePage = () => {
  const getAllProducts = api.products.getAllProducts.useQuery(
    { isArchived: false },
    { enabled: false }
  );

  useEffect(() => void getAllProducts.refetch(), []);

  const categoryCards = [
    {
      link: "/collections/clthr3eij0001gv08sekv32ij",
      title: "Bleach Collection",
      imageURL: "/custom/ta_bleach.jpg",
      gifURL: "/custom/ta_bleach.gif",
    },
    {
      link: "/collections/all-products",
      title: "New Arrivals",
      imageURL: "/custom/ta_embroidery_still_alt.png",
      videoURL: "/custom/ta_embroidery.mp4",
    },
    {
      link: "/custom-request",
      title: "Custom Clothing",
      imageURL: "/custom/ta_custom.png",
      videoURL: "/custom/ta_custom.mp4",
    },
  ];

  return (
    <>
      <StorefrontLayout
        {...storeTheme.layout}
        mainStyle={storeTheme.body.primary}
        metadata={metadata}
      >
        <div className="mx-auto my-8  max-w-7xl bg-white py-4 ">
          <TaHero />
        </div>

        <TaProductGrid products={getAllProducts.data ?? []} />

        <Link href="/collections/all-products">
          <Button className="w-full md:hidden" variant={"outline"} size={"lg"}>
            Shop Products
          </Button>
        </Link>
        <section className="max-md:py-8">
          <Marquee variant="secondary" className="bg-purple-300/90">
            {getAllProducts.data?.slice(0, 3).map((product, idx) => (
              <ProductCardMarquee
                key={product.id + idx}
                data={product}
                className="h-full"
              />
            ))}
          </Marquee>
        </section>

        <h2 className="text-7xl font-bold text-purple-600 max-md:hidden">
          Collections
        </h2>

        <Container>
          <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col gap-4 max-md:space-y-4 md:flex-row">
            {categoryCards.map((card) => (
              <TaVideoCategoryCard key={card.link} {...card} />
            ))}
          </div>
        </Container>
        <InsideTrendAnomaly />
      </StorefrontLayout>
    </>
  );
};
