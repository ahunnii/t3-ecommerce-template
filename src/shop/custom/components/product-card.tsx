import { Expand, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type MouseEventHandler } from "react";

import Currency from "~/components/core/ui/currency";
import IconButton from "~/components/core/ui/icon-button";
import useCart from "~/features/cart/hooks/use-cart";
import usePreviewModal from "~/hooks/core/use-preview-modal";
import type { DetailedProductFull } from "~/types";
import { cn } from "~/utils/styles";

interface ProductCard {
  data: DetailedProductFull;
}

const ProductCard: React.FC<ProductCard> = ({ data }) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const previewModal = usePreviewModal();
  const cart = useCart();

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
    <Link
      href={`/product/${data?.id}`}
      className="group cursor-pointer space-y-4 rounded-xl  border border-white/50 bg-black p-3"
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image & actions */}
      <div className="relative aspect-[1/1.6] rounded-xl bg-white/70">
        <Image
          src={data.images?.[1]?.url ?? data.images?.[0]?.url ?? ""}
          alt=""
          fill
          className="aspect-square rounded-md object-cover transition-all duration-500 ease-in-out"
        />
        <Image
          src={data.images?.[0]?.url ?? ""}
          alt=""
          fill
          className={cn(
            "aspect-square rounded-md object-cover transition-all duration-500 ease-in-out",
            hovered ? "opacity-0" : "opacity-100"
          )}
        />
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
      <div className="text-left">
        <p className="text-lg font-semibold text-white">{data.name}</p>
        <p className="text-sm text-gray-500">{data.category?.name}</p>
      </div>
      {/* Price & Reiew */}
      <div className="justify-left mx-auto  flex items-center">
        <Currency value={data?.price} className="font-extrabold  text-white" />
      </div>
    </Link>
  );
};

export default ProductCard;
