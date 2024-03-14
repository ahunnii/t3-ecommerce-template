import { ArrowBigRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import Container from "~/components/common/layout/container";

import type { DetailedProductFull } from "~/types";

interface ProductListProps {
  items: DetailedProductFull[];
}

export const TaProductList: FC<ProductListProps> = ({ items }) => {
  return (
    <Container>
      {" "}
      <section className="py-8">
        <div className="flex w-full justify-between max-lg:flex-col max-lg:flex-wrap">
          <Link
            className="group relative aspect-square h-full w-full overflow-hidden px-4 md:block lg:w-2/3"
            href={`/product/${items[3]?.id}`}
          >
            <Image
              className="inset-0 h-full w-full rounded  object-cover  object-top shadow-md transition duration-200 group-hover:scale-110"
              src={items[3]?.images[0]?.url ?? ""}
              alt={items[3]?.name ?? "Featured Product"}
              fill
            />
            <div className="absolute bottom-0 left-0 bg-gray-950 bg-opacity-60 p-4">
              <h3 className="text-lg font-semibold text-white md:text-xl">
                {items[3]?.name ?? "Featured Product"}
              </h3>{" "}
              <h3 className="w-fit text-lg font-semibold text-white  md:text-xl">
                $ {items[3]?.price ?? "..."}
              </h3>
            </div>
          </Link>{" "}
          <div className=" flex h-auto w-full flex-col md:flex-row  lg:w-1/3 lg:flex-col lg:justify-between lg:space-y-4 lg:pl-4  ">
            <Link
              className="relative flex w-full overflow-hidden py-8 max-lg:h-96 max-lg:w-full md:w-1/2 lg:aspect-auto lg:h-1/2 lg:w-full"
              href={`/product/${items[1]?.id}`}
            >
              <Image
                className="rounded object-cover object-top shadow-md"
                src={items[1]?.images[0]?.url ?? ""}
                alt=""
                fill
              />{" "}
              <div className="absolute bottom-0 left-0 bg-gray-950 bg-opacity-60 p-4">
                <h3 className="text-lg font-semibold text-white md:text-xl">
                  {items[1]?.name ?? "Featured Product"}
                </h3>{" "}
                <h3 className="w-fit text-lg font-semibold text-white  md:text-xl">
                  $ {items[1]?.price ?? "..."}
                </h3>
              </div>
            </Link>
            <Link
              className="relative flex w-full overflow-hidden py-8 max-lg:h-96 max-lg:w-full md:w-1/2 lg:aspect-auto lg:h-1/2  lg:w-full "
              href={`/product/${items[2]?.id}`}
            >
              <Image
                className="rounded object-cover shadow-md"
                src={items[2]?.images[0]?.url ?? ""}
                alt=""
                fill
              />{" "}
              <div className="absolute bottom-0 left-0 bg-gray-950 bg-opacity-60 p-4">
                <h3 className="text-lg font-semibold text-white md:text-xl">
                  {items[2]?.name ?? "Featured Product"}
                </h3>{" "}
                <h3 className="w-fit text-lg font-semibold text-white  md:text-xl">
                  $ {items[2]?.price ?? "..."}
                </h3>
              </div>
            </Link>
          </div>
        </div>

        <div className="flex w-full justify-between gap-4 py-4 max-lg:flex-col max-lg:flex-wrap">
          <Link
            className="group relative aspect-video h-full w-full overflow-hidden px-4 md:block lg:w-2/3"
            href={`/product/${items[0]?.id}`}
          >
            <Image
              className="inset-0 h-full w-full rounded  object-cover  object-top shadow-md transition duration-200 group-hover:scale-110"
              src={items[0]?.images[0]?.url ?? ""}
              alt={items[0]?.name ?? "Featured Product"}
              fill
            />
            <div className="absolute bottom-0 left-0 bg-gray-950 bg-opacity-60 p-4">
              <h3 className="text-lg font-semibold text-white md:text-xl">
                {items[0]?.name ?? "Featured Product"}
              </h3>{" "}
              <h3 className="w-fit text-lg font-semibold text-white  md:text-xl">
                $ {items[0]?.price ?? "..."}
              </h3>
            </div>
          </Link>{" "}
          <Link
            className="group relative aspect-video h-full w-full overflow-hidden px-4 md:block lg:w-2/3"
            href={`/product/${items[0]?.id}`}
          >
            <Image
              className="inset-0 h-full w-full rounded  object-cover  object-top shadow-md transition duration-200 group-hover:scale-110"
              src={items[0]?.images[0]?.url ?? ""}
              alt={items[0]?.name ?? "Featured Product"}
              fill
            />
            <div className="absolute bottom-0 left-0 bg-gray-950 bg-opacity-60 p-4">
              <h3 className="text-lg font-semibold text-white md:text-xl">
                {items[0]?.name ?? "Featured Product"}
              </h3>{" "}
              <h3 className="w-fit text-lg font-semibold text-white  md:text-xl">
                $ {items[0]?.price ?? "..."}
              </h3>
            </div>
          </Link>{" "}
          <Link
            className="group flex aspect-video h-full w-full flex-col items-center bg-purple-500 px-4 md:flex lg:w-2/3"
            href={`/collections/all-products`}
          >
            <div className=" my-auto flex  w-full items-center bg-opacity-60 p-4">
              <h3 className="text-3xl font-semibold text-white ">
                Check out our other products
              </h3>{" "}
              <ArrowBigRight className="h-24 w-24 text-white" />
            </div>
          </Link>{" "}
        </div>
      </section>
    </Container>
  );
};
