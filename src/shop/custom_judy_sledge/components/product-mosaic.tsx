import { api } from "~/utils/api";

const ProductMosaic = () => {
  const { data: items } = api.products.getAllProducts.useQuery({
    isFeatured: true,
  });

  if (!items) return null;
  return (
    <div className="mx-auto flex w-full max-w-6xl  flex-col justify-between gap-x-11 py-5">
      <div className="relative z-0 grid grid-flow-col grid-cols-3 grid-rows-2 gap-8">
        <div className="absolute left-1/3 top-1/2 z-10 w-full  translate-x-24 translate-y-4">
          <div className="z-0  w-1/2 rounded-lg bg-opacity-50 bg-gradient-to-r from-purple-500/90 from-60% to-transparent px-2 py-5 shadow-inner">
            <h2 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Products
            </h2>

            <button className="mt-2.5  border-b-2 border-transparent text-2xl font-bold text-white/75 transition ease-linear hover:border-b-white hover:text-white">
              View All →
            </button>
          </div>
        </div>
        <div className="-rotate-6 scale-110 transform">
          <img
            src={items[0]?.images[0]?.url ?? "/custom/stock_3.png"}
            alt=""
            loading="lazy"
            className="aspect-square rounded-xl object-cover shadow"
            sizes="100%"
          />
        </div>
        <div className="translate-y-15 z-10 col-start-3 translate-x-2 rotate-6 scale-75 transform">
          <img
            src={items[1]?.images[0]?.url ?? "/custom/stock_4.png"}
            alt=""
            loading="lazy"
            className="aspect-square rounded-xl object-cover shadow"
            sizes="100%"
          />
        </div>
        <div className="translate-y-11 scale-150 transform">
          <img
            src={items[2]?.images[0]?.url ?? "/custom/stock_5.png"}
            alt=""
            loading="lazy"
            className="aspect-video rounded-xl object-cover shadow"
            sizes="100%"
          />
        </div>
        <div className="translate-y-24 transform">
          <img
            src={items[3]?.images[0]?.url ?? "/custom/stock_7.png"}
            alt=""
            loading="lazy"
            className="aspect-square rounded-xl object-cover shadow"
            sizes="100%"
          />
        </div>
        <div className="col-span-2 col-start-2 row-start-1 translate-x-20 translate-y-4 transform">
          <img
            src={items[4]?.images[0]?.url ?? "/custom/stock_9.png"}
            alt=""
            loading="lazy"
            className="aspect-video rounded-xl object-cover shadow"
            sizes="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductMosaic;
