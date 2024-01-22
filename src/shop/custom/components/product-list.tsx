import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import Container from "~/components/core/ui/container";
import NoResults from "~/components/core/ui/no-results";
import ProductCard from "~/components/core/ui/product-card";
import type { DetailedProductFull } from "~/types";

interface ProductListProps {
  title?: string;
  subtitle?: string;
  items: DetailedProductFull[];
}

const ProductList: FC<ProductListProps> = ({ title, subtitle, items }) => {
  return (
    <Container>
      {" "}
      <section className="py-8">
        <div className="flex w-full justify-between max-lg:flex-col max-lg:flex-wrap">
          <Link
            className="group relative aspect-square h-full w-full overflow-hidden px-4 md:block lg:w-2/3"
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
          </Link>
          <div className=" flex h-auto w-full flex-col md:flex-row  lg:w-1/3 lg:flex-col lg:justify-between lg:space-y-10 lg:px-4 ">
            <Link
              className="relative flex w-full overflow-hidden py-8 max-lg:h-96 max-lg:w-full md:w-1/2 lg:aspect-square lg:h-full lg:w-full"
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
              className="relative flex w-full overflow-hidden py-8 max-lg:h-96 max-lg:w-full md:w-1/2 lg:aspect-square lg:h-full lg:w-full "
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
      </section>
      {/* <div className=" grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 xl:gap-8">
        <a
          href="#"
          className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80"
        >
          <img
            src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&q=75&fit=crop&w=600"
            loading="lazy"
            alt="Photo by Minh Pham"
            className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>

          <div className="absolute bottom-0 left-0 bg-white bg-opacity-60 p-4 dark:bg-gray-950 dark:bg-opacity-60">
            <h3 className="text-lg font-semibold text-black dark:text-white md:text-xl">
              Unique Product 1
            </h3>
          </div>
        </a>

        <a
          href="#"
          className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:col-span-2 md:h-80"
        >
          <img
            src="https://images.unsplash.com/photo-1542759564-7ccbb6ac450a?auto=format&q=75&fit=crop&w=1000"
            loading="lazy"
            alt="Photo by Magicle"
            className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>

          <span className="relative mb-3 ml-4 inline-block text-sm text-white md:ml-5 md:text-lg">
            Tech
          </span>
        </a>

        <a
          href="#"
          className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:col-span-2 md:h-80"
        >
          <img
            src="https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?auto=format&q=75&fit=crop&w=1000"
            loading="lazy"
            alt="Photo by Martin Sanchez"
            className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>

          <span className="relative mb-3 ml-4 inline-block text-sm text-white md:ml-5 md:text-lg">
            Dev
          </span>
        </a>

        <a
          href="#"
          className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80"
        >
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&q=75&fit=crop&w=600"
            loading="lazy"
            alt="Photo by Lorenzo Herrera"
            className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>

          <span className="relative mb-3 ml-4 inline-block text-sm text-white md:ml-5 md:text-lg">
            Retro
          </span>
        </a>
      </div>
      <div className="space-y-4 py-8">
        <div>
          {subtitle ? (
            <h3 className="text-xl font-extrabold tracking-tight text-purple-500  ">
              {subtitle}
            </h3>
          ) : null}

          <h2 className="text-default text-5xl font-extrabold tracking-tight text-purple-500 sm:text-[5rem]">
            {title}
          </h2>
        </div>
        {items.length === 0 && <NoResults />}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <ProductCard key={item.id} data={item} />
          ))}
        </div>
      </div> */}
    </Container>
  );
};

export default ProductList;
