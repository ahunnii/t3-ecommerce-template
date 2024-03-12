/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

import Container from "~/components/core/ui/container";
import StorefrontLayout from "~/components/layouts/storefront-layout";
import { api } from "~/utils/api";

import { TaHero } from "~/components/custom/ta-hero";
import { InsideTrendAnomaly } from "~/components/custom/ta-inside-trend-anomaly.custom";
import ProductCard from "~/components/custom/ta-product-card.custom";
import { TaProductGrid } from "~/components/custom/ta-product-grid.custom";

import Marquee from "~/components/wip/marquee/ta-marquee.wip";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { storeTheme } from "~/data/config.custom";

import { CategoryCard } from "~/packages/ui/components/category-card";

import { type contentSwitchWrapperVariants } from "~/packages/ui/components/content-switch-wrapper";

const metadata = {
  title: "Trend Anomaly",
  description: "Break out the system!",
};

const HomePage = () => {
  const getAllProducts = api.products.getAllProducts.useQuery(
    { isArchived: false },
    { enabled: false }
  );

  useEffect(() => void getAllProducts.refetch(), []);

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
              <ProductCard
                key={product.id + idx}
                data={product}
                className="h-full"
                variant="marquee"
                size="square"
                discounts={[]}
              />
            ))}
          </Marquee>
        </section>

        <h2 className="text-7xl font-bold text-purple-600 max-md:hidden">
          Collections
        </h2>

        <Container>
          <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col gap-4 max-md:space-y-4 md:flex-row">
            {categoryCards.map((card, idx) => (
              <Link
                key={idx}
                href={card.link}
                className="relative overflow-hidden max-md:w-11/12 md:w-1/3"
              >
                <CategoryCard {...card} className="rounded-md" />
              </Link>
            ))}
          </div>
        </Container>
        <InsideTrendAnomaly />
      </StorefrontLayout>
    </>
  );
};

const categoryCards = [
  {
    link: "/collections/clthr3eij0001gv08sekv32ij",
    title: "Bleach Collection",
    primaryContentUrl: "/custom/ta_bleach.jpg",
    secondaryContentUrl: "/custom/ta_bleach.gif",
    subtitle: "Featured Collection",
    overlay: "tinted" as keyof typeof contentSwitchWrapperVariants,
    variant: "image" as keyof typeof contentSwitchWrapperVariants,
  },
  {
    link: "/collections/all-products",
    title: "New Arrivals",
    primaryContentUrl: "/custom/ta_embroidery_still_alt.png",
    variant: "video" as keyof typeof contentSwitchWrapperVariants,
    overlay: "tinted" as keyof typeof contentSwitchWrapperVariants,
    subtitle: "Featured Collection",
    secondaryContentUrl:
      "https://res.cloudinary.com/dsdmjwmxy/video/upload/v1710175136/ta_embroidery_dqiqcj.mp4",
  },
  {
    link: "/custom-request",
    title: "Custom Clothing",
    primaryContentUrl: "/custom/ta_custom.png",
    variant: "video" as keyof typeof contentSwitchWrapperVariants,
    overlay: "tinted" as keyof typeof contentSwitchWrapperVariants,
    subtitle: "Featured Collection",
    secondaryContentUrl:
      "https://res.cloudinary.com/dsdmjwmxy/video/upload/v1710168061/request-images/yczhhqr340bhegsjipfu.mp4",
  },
];

export default HomePage;
