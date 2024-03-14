import { Expand, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { MouseEventHandler } from "react";

import IconButton from "~/components/common/buttons/icon-button";
import Currency from "~/components/common/currency";
import useCart from "~/modules/cart/hooks/use-cart";
import usePreviewModal from "~/modules/products/hooks/use-preview-modal";
import { useConfig } from "~/providers/style-config-provider";
import type { DetailedProductFull } from "~/types";
import { cn } from "~/utils/styles";

interface ProductCard {
  data: DetailedProductFull;
}

const ProductCard: React.FC<ProductCard> = ({ data }) => {
  const previewModal = usePreviewModal();
  const cart = useCart();
  const config = useConfig();

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    previewModal.onOpen(data);
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    cart.addCartItem({
      product: data,
      quantity: 1,
      variant: null,
    });
  };

  return (
    <div
      className={cn(
        "group space-y-4 rounded-xl border bg-white p-3",
        config.product.card.body
      )}
    >
      {/* Image & actions */}
      <div
        className={cn(
          "relative aspect-square rounded-xl bg-gray-100",
          config.product.card.imageBody
        )}
      >
        <Link href={`/product/${data?.id}`}>
          <>
            <Image
              src={data.images?.[0]?.url ?? "/placeholder-image.webp"}
              alt=""
              fill
              className="aspect-square rounded-md object-cover"
            />
            <Image
              src={data.featuredImage ?? "/placeholder-image.webp"}
              alt=""
              fill
              className="aspect-square rounded-md object-cover transition-opacity duration-500 ease-in-out hover:opacity-0"
            />
          </>
        </Link>

        <div className="absolute bottom-5 w-full px-6 opacity-0 transition group-hover:opacity-100">
          <div className="flex justify-center gap-x-6">
            <IconButton
              onClick={onPreview}
              icon={<Expand size={20} className="text-gray-600" />}
            />
            {data.variants?.length === 0 && (
              <IconButton
                onClick={onAddToCart}
                icon={<ShoppingCart size={20} className="text-gray-600" />}
              />
            )}
          </div>
        </div>
      </div>
      {/* Description */}
      <Link href={`/product/${data?.id}`} className="flex flex-col ">
        <h5 className={cn("text-lg font-semibold", config.product.card.name)}>
          {data.name}
        </h5>
        <p
          className={cn(
            "text-sm text-gray-500",
            config.product.card.description
          )}
        >
          {data.category?.name}
        </p>

        <Currency
          value={data?.price}
          className={cn("mt-2 ", config.product.card.price)}
        />
      </Link>
    </div>
  );
};

export default ProductCard;
