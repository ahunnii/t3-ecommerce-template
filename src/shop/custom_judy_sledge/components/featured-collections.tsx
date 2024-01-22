import type { Product } from "@prisma/client";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import type Stripe from "stripe";
import { Button } from "~/components/ui/button";

import { api } from "~/utils/api";

const DEFAULT_COLLECTION_IMGS = [
  "/custom/dress_stock.png",
  "/custom/art_stock.png",
  "/custom/stock_6.png",
];

const FeaturedCollections = () => {
  const { data: collections } = api.collections.getAllCollections.useQuery({
    isFeatured: true,
  });

  if (!collections) return null;

  return (
    <div className="relative z-20 mx-auto mt-28 flex w-full  max-w-7xl flex-col justify-between gap-x-11">
      <div className="flex  w-full flex-row items-center justify-between">
        <h2 className="text-default text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Featured Collections
        </h2>{" "}
        <Button
          size={"lg"}
          className="bg-purple-500 shadow  transition-all duration-150 ease-in hover:bg-purple-600 max-md:w-full"
        >
          View All <ArrowRight />
        </Button>
      </div>

      <div className="my-5 grid grid-cols-2 gap-4">
        {" "}
        <div className="col-span-1 ">
          <div className="relative aspect-[9/12] ">
            <Link href={`/collections/${collections[0]?.id}`}>
              <Image
                layout="fill"
                src={
                  collections[0]?.billboard?.imageUrl ??
                  "/custom/dress_stock.png"
                }
                alt="hero"
                objectFit="cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded"
              />
              <button className="absolute bottom-0 right-0 m-4 rounded-full border-4 border-white/80 bg-primary p-4  font-extrabold tracking-tight  transition ">
                <span className="sr-only">
                  Go to {collections[0]?.name ?? "Clothing"}
                </span>
                <ArrowUpRight className=" h-8 w-8 text-white" />
              </button>
              <h3 className="absolute left-0 top-0 p-4  text-6xl font-bold tracking-tight text-white">
                {collections[0]?.name ?? "Clothing"}
              </h3>{" "}
              <div className="absolute left-0 top-0  z-20 flex h-full w-full bg-black/40 transition-all duration-150 ease-in hover:bg-transparent"></div>
            </Link>
          </div>
        </div>{" "}
        <div className="relative col-span-1 grid grid-rows-2 gap-4">
          <div className="relative row-span-1 ">
            {" "}
            <Link href={`/collections/${collections[1]?.id}`}>
              <Image
                layout="fill"
                src={
                  collections[1]?.billboard?.imageUrl ?? "/custom/art_stock.png"
                }
                alt="hero"
                objectFit="cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded"
              />
              <button className="absolute bottom-0 right-0 z-30 m-4 rounded-full border-4 border-white/80 bg-primary p-4  font-extrabold tracking-tight  transition">
                <span className="sr-only">
                  Go to {collections[1]?.name ?? "Art"}
                </span>
                <ArrowUpRight className="h-8 w-8 text-white" />
              </button>{" "}
              <h3 className="absolute bottom-0 left-0 z-30  p-4 text-6xl font-bold tracking-tight text-white">
                {collections[1]?.name ?? "Art"}
              </h3>{" "}
              <div className="absolute left-0 top-0  z-20 flex h-full w-full bg-black/40 transition-all duration-150 ease-in hover:bg-transparent"></div>
            </Link>
          </div>

          <div className="relative row-span-1 ">
            <Link href={`/collections/${collections[2]?.id}`}>
              <Image
                layout="fill"
                src={
                  collections[2]?.billboard?.imageUrl ?? "/custom/stock_6.png"
                }
                alt="hero"
                objectFit="cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded"
              />
              <button className="absolute bottom-0 right-0 m-4 rounded-full border-4 border-white/80 bg-primary p-4  font-extrabold tracking-tight  transition">
                <span className="sr-only">
                  Go to {collections[2]?.name ?? "Home Decor"}
                </span>
                <ArrowUpRight className="h-8 w-8 text-white" />
              </button>{" "}
              <h3 className="right-left absolute bottom-0 p-4  text-6xl font-bold tracking-tight text-white">
                {collections[2]?.name ?? "Home Decor"}
              </h3>{" "}
              <div className="absolute left-0 top-0  z-20 flex h-full w-full bg-black/40 transition-all duration-150 ease-in hover:bg-transparent"></div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCollections;
