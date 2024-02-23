import { useEffect, useState } from "react";

import Image from "next/image";
import Container from "~/components/core/ui/container";
import StorefrontLayout from "~/components/layouts/storefront-layout";
import { api } from "~/utils/api";

import { TaHero } from "~/components/custom/ta-hero";

import { InsideTrendAnomaly } from "~/components/custom/ta-inside-trend-anomaly.custom";
import { TaProductList } from "~/components/custom/ta-product-list.custom";

import Link from "next/link";

import { Prisma } from "@prisma/client";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { FeaturedBanner } from "~/components/wip/featured-banner.wip";
import Marquee from "~/components/wip/marquee/ta-marquee.wip";
import {
  BentoGrid,
  BentoGridItem,
} from "~/components/wip/product-bento-grid.wip";
import ProductCard from "~/components/wip/product-card.wip";
// import ProductCard from "~/components/wip/product-card/ta-product-card.wip";
import { ProductCardMarquee } from "~/components/wip/product-card-marquee.wip";
import Grid from "~/components/wip/product-grid/ta-product-grid.wip";
import { LayoutGrid } from "~/components/wip/product-layout-grid.wip";
import { storeTheme } from "~/data/config.custom";
import { DetailedProductFull } from "~/types";

const metadata = {
  title: "Trend Anomaly",
  description: "Break out the system!",
};

export const HomePage = () => {
  const [hover, setHover] = useState(false);
  const [bleach, setBleach] = useState(false);
  const [custom, setCustom] = useState(false);
  const getAllProducts = api.products.getAllProducts.useQuery(
    {
      // isFeatured: true,
    },
    {
      enabled: false,
    }
  );
  useEffect(() => {
    void getAllProducts.refetch();
  }, []);
  function randomNoRepeats(
    array: Prisma.ProductGetPayload<{
      include: { images: true; variants: true };
    }>[]
  ) {
    let copy = array.slice(0);
    return function () {
      if (copy.length < 1) {
        copy = array.slice(0);
      }
      const index = Math.floor(Math.random() * copy.length);
      const item = copy[index];
      copy.splice(index, 1);
      return item;
    };
  }

  const randomProducts = randomNoRepeats(getAllProducts.data ?? []);

  const cards = [
    {
      id: 1,
      content: <SkeletonOne />,
      className: "md:col-span-2 max-md:aspect-square max-md:h-full",
      thumbnail: "/product-img-placeholder.svg",
      product: randomProducts() as DetailedProductFull,
    },
    {
      id: 2,
      content: <SkeletonTwo />,
      className: "col-span-1 max-md:aspect-square max-md:h-full",
      thumbnail: "/product-img-placeholder.svg",
      product: randomProducts() as DetailedProductFull,
    },
    {
      id: 3,
      content: <SkeletonThree />,
      className: "col-span-1 max-md:aspect-square max-md:h-full",
      thumbnail: "/product-img-placeholder.svg",
      product: randomProducts() as DetailedProductFull,
    },
    {
      id: 4,
      content: <SkeletonFour />,
      className: "md:col-span-2 max-md:aspect-square max-md:h-full",
      thumbnail: "/product-img-placeholder.svg",
      product: randomProducts() as DetailedProductFull,
    },
  ];

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

        <div className=" w-full md:h-screen">
          <LayoutGrid cards={cards} />
        </div>

        {/* <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <LayoutGrid cards={cards} className="flex h-96 flex-row" />

          <ScrollBar orientation="horizontal" />
        </ScrollArea> */}

        {/* <TaProductList items={products ?? []} /> */}
        {/* <Grid variant="filled">
          {products?.slice(0, 3).map((product, i: number) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="default"
              imgProps={{
                width: i === 0 ? 1080 : 540,
                height: i === 0 ? 1080 : 540,
                priority: true,
                alt: `${product.name} - ${product.id}`,
              }}
            />
          ))}
        </Grid>{" "} */}
        {/* <BentoGrid className="mx-auto max-w-4xl">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid> */}
        <Marquee variant="secondary" className="bg-purple-300/90">
          {getAllProducts.data?.slice(0, 3).map((product, i: number) => (
            <ProductCardMarquee
              key={product.id}
              data={product}
              className="h-full"
            />
          ))}
        </Marquee>
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
const SkeletonOne = () => {
  return (
    <div>
      <p className="text-4xl font-bold text-white">House in the woods</p>
      <p className="text-base font-normal text-white"></p>
      <p className="my-4 max-w-lg text-base font-normal text-neutral-200">
        A serene and tranquil retreat, this house in the woods offers a peaceful
        escape from the hustle and bustle of city life.
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="text-4xl font-bold text-white">House above the clouds</p>
      <p className="text-base font-normal text-white"></p>
      <p className="my-4 max-w-lg text-base font-normal text-neutral-200">
        Perched high above the world, this house offers breathtaking views and a
        unique living experience. It&apos;s a place where the sky meets home,
        and tranquility is a way of life.
      </p>
    </div>
  );
};
const SkeletonThree = () => {
  return (
    <div>
      <p className="text-4xl font-bold text-white">Greens all over</p>
      <p className="text-base font-normal text-white"></p>
      <p className="my-4 max-w-lg text-base font-normal text-neutral-200">
        A house surrounded by greenery and nature&apos;s beauty. It&apos;s the
        perfect place to relax, unwind, and enjoy life.
      </p>
    </div>
  );
};
const SkeletonFour = () => {
  return (
    <div>
      <p className="text-4xl font-bold text-white">Rivers are serene</p>
      <p className="text-base font-normal text-white"></p>
      <p className="my-4 max-w-lg text-base font-normal text-neutral-200">
        A house by the river is a place of peace and tranquility. It&apos;s the
        perfect place to relax, unwind, and enjoy life.
      </p>
    </div>
  );
};

// const Skeleton = () => (
//   <div className="flex h-full min-h-[6rem] w-full flex-1 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800"></div>
// );
// const items = [
//   {
//     title: "The Dawn of Innovation",
//     description: "Explore the birth of groundbreaking ideas and inventions.",
//     header: <Skeleton />,
//     icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
//   },
//   {
//     title: "The Digital Revolution",
//     description: "Dive into the transformative power of technology.",
//     header: <Skeleton />,
//     icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
//   },
//   {
//     title: "The Art of Design",
//     description: "Discover the beauty of thoughtful and functional design.",
//     header: <Skeleton />,
//     icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
//   },
//   {
//     title: "The Power of Communication",
//     description:
//       "Understand the impact of effective communication in our lives.",
//     header: <Skeleton />,
//     icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
//   },
//   {
//     title: "The Pursuit of Knowledge",
//     description: "Join the quest for understanding and enlightenment.",
//     header: <Skeleton />,
//     icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
//   },
//   {
//     title: "The Joy of Creation",
//     description: "Experience the thrill of bringing ideas to life.",
//     header: <Skeleton />,
//     icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
//   },
//   {
//     title: "The Spirit of Adventure",
//     description: "Embark on exciting journeys and thrilling discoveries.",
//     header: <Skeleton />,
//     icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
//   },
// ];
