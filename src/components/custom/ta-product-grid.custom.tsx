import { LayoutGrid } from "~/components/wip/product-layout-grid.wip";
import type { DetailedProductFull } from "~/types";

import { randomNoRepeats } from "~/utils/random";

export const TaProductGrid = ({
  products,
}: {
  products: DetailedProductFull[];
  isFeatured?: boolean;
}) => {
  const randomProducts = randomNoRepeats(products ?? []);

  const cards = [
    {
      id: 1,
      content: <></>,
      className: "md:col-span-2 max-md:aspect-square max-md:h-full",
      thumbnail: "/product-img-placeholder.svg",
      product: randomProducts() as DetailedProductFull,
    },
    {
      id: 2,
      content: <></>,
      className: "col-span-1 max-md:aspect-square max-md:h-full",
      thumbnail: "/product-img-placeholder.svg",
      product: randomProducts() as DetailedProductFull,
    },
    {
      id: 3,
      content: <></>,
      className: "col-span-1 max-md:aspect-square max-md:h-full",
      thumbnail: "/product-img-placeholder.svg",
      product: randomProducts() as DetailedProductFull,
    },
    {
      id: 4,
      content: <></>,
      className: "md:col-span-2 max-md:aspect-square max-md:h-full",
      thumbnail: "/product-img-placeholder.svg",
      product: randomProducts() as DetailedProductFull,
    },
  ];

  if (products.length === 0) return null;

  return (
    <div className=" w-full md:h-screen">
      <LayoutGrid cards={cards} />
    </div>
  );
};
