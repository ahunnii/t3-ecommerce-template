import Image from "next/image";
import Link from "next/link";

import Currency from "~/components/common/currency";

import { Button } from "~/components/ui/button";

import { ScrollArea } from "~/components/ui/scroll-area";

import { ViewSection } from "~/components/common/sections/view-section.admin";
import type { CategoryProduct } from "../../../products/types";

export const ViewCategoryProducts = ({
  products,
}: {
  products: CategoryProduct[];
}) => {
  return (
    <ViewSection
      title="Products"
      description="These are all the products associated with this category"
    >
      <ScrollArea className="relative my-8 h-96 border border-slate-100 p-2 shadow-inner">
        <div className="flex flex-col space-y-4 ">
          {products.map((product) => (
            <div
              className="flex items-center p-4 odd:bg-slate-200 even:bg-slate-50"
              key={product.id}
            >
              <div className="h-10 w-10 flex-shrink-0">
                <Image
                  className="h-10 w-10 rounded-md object-cover"
                  src={product.featuredImage ?? "/placeholder-image.webp"}
                  alt={product.name}
                  height={40}
                  width={40}
                />
              </div>
              <div className="ml-4">
                <Link
                  href={`/admin/${product.storeId}/products/${product.id}`}
                  className="text-sm font-medium text-gray-900"
                >
                  <Button variant={"link"} className="mx-0 px-0">
                    {product.name}
                  </Button>
                </Link>
                <div className="text-sm text-gray-500">
                  <Currency value={product.price} />
                </div>
              </div>
            </div>
          ))}{" "}
        </div>
      </ScrollArea>
    </ViewSection>
  );
};
