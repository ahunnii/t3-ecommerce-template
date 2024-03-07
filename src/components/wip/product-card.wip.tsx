import type { Discount } from "@prisma/client";
import { Expand, ShoppingCart } from "lucide-react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { Fragment, useState, type MouseEventHandler } from "react";

import Currency from "~/components/core/ui/currency";
import IconButton from "~/components/core/ui/icon-button";
import useCart from "~/modules/cart/hooks/use-cart";
import { getBestDiscount } from "~/modules/discounts/utils/get-best-discount";
import usePreviewModal from "~/modules/products/hooks/use-preview-modal";
import type { DetailedProductFull } from "~/types";
import { cn } from "~/utils/styles";
import { Button } from "../ui/button";

interface ProductCard {
  data: DetailedProductFull;
  discounts: Discount[];
  className?: string;
}

const ProductCard: React.FC<ProductCard> = ({ data, className, discounts }) => {
  const previewModal = usePreviewModal();
  const cart = useCart();
  const router = useRouter();

  const [hovered, setHovered] = useState<boolean>(false);

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

    cart.setIsShoppingBagOpen(true);
  };

  const goToProduct = () => router.push(`/product/${data?.id}`);

  const quickActions = {
    preview: {
      icon: <Expand size={20} className="text-gray-600" />,
      onClick: onPreview,
      renderIf: true,
    },
    addToCart: {
      icon: <ShoppingCart size={20} className="text-gray-600" />,
      onClick: onAddToCart,
      renderIf: data.variants?.length === 0,
    },
  };

  const bestDiscount =
    discounts?.length > 0 ? getBestDiscount(data.price, discounts) : null;

  return (
    <div
      className={cn(
        "group cursor-pointer space-y-4 rounded-xl  border border-white/50 bg-black p-3",
        className
      )}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ProductCardImage {...data} goToProduct={goToProduct} hovered={hovered}>
        {(data?.discounts?.length > 0 || discounts?.length > 0) && (
          <div className="absolute right-3 top-3 z-50">
            <span className="rounded-md border border-white bg-purple-500 px-2 py-1 text-xs font-semibold text-white shadow">
              SALE
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <ProductCardQuickActions
          actions={[quickActions.preview, quickActions.addToCart]}
        />
      </ProductCardImage>
      <ProductCardDescription
        {...data}
        onClick={goToProduct}
        discountBundle={bestDiscount ?? null}
      />

      {data?.variants?.length > 0 ? (
        <Button
          className="w-full bg-purple-700 hover:bg-purple-500"
          onClick={goToProduct}
        >
          View Product
        </Button>
      ) : (
        <Button
          className="w-full bg-purple-700 hover:bg-purple-500"
          onClick={onAddToCart}
        >
          Add to Cart
        </Button>
      )}
    </div>
  );
};

type TProductCardImage = {
  name: string;
  hovered?: boolean;
  featuredImage?: string | null;
  images?: { url: string }[];
  goToProduct: () => void;
  children: React.ReactNode;
};
const ProductCardImage = ({ children, ...props }: TProductCardImage) => {
  const featuredImage =
    props?.featuredImage ??
    props?.images?.[0]?.url ??
    "/placeholder-image.webp";
  const fallbackImage =
    props.images?.[1]?.url ??
    props.images?.[0]?.url ??
    props?.featuredImage ??
    "/placeholder-image.webp";

  const imageStyle =
    "aspect-square rounded-md object-cover transition-all duration-500 ease-in-out";
  return (
    <div className="relative aspect-[1/1.6] rounded-xl bg-white/70">
      <>
        <Image
          src={fallbackImage ?? featuredImage ?? "/placeholder-image.webp"}
          alt={props.name}
          fill
          className={cn(imageStyle, "")}
          onClick={props.goToProduct}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <Image
          src={featuredImage ?? "/placeholder-image.webp"}
          alt={props.name}
          fill
          className={cn(
            imageStyle,
            props.hovered ? "opacity-0" : "opacity-100"
          )}
          onClick={props.goToProduct}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </>

      {children}
    </div>
  );
};

type TProductCardDescription = {
  onClick: () => void;
  name: string;
  price: number;
  category?: { name: string };
  discountBundle?: { price: number; discount: Discount | null } | null;
};
const ProductCardDescription = ({
  onClick,
  name,
  price,
  category,
  discountBundle,
}: TProductCardDescription) => {
  return (
    <div className="text-left" onClick={onClick}>
      <p className="text-lg font-semibold text-white">{name}</p>
      <p className="text-sm text-gray-500">{category?.name}</p>

      <div className="flex gap-2">
        {discountBundle && (
          <Currency
            value={discountBundle.price}
            className="mt-2  font-extrabold text-white"
          />
        )}

        <Currency
          value={price}
          className={cn(
            "mt-2  font-extrabold text-white",
            discountBundle && "font-medium text-muted-foreground line-through"
          )}
        />
      </div>
    </div>
  );
};

type QuickAction = {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  icon: React.ReactElement;
  className?: string;
  renderIf: boolean;
};

const ProductCardQuickActions = ({ actions }: { actions: QuickAction[] }) => {
  return (
    <div className="absolute bottom-5 z-50 w-full px-6 opacity-0 transition group-hover:opacity-100">
      <div className="flex justify-center gap-x-6">
        {actions.map((action, index) => (
          <Fragment key={index}>
            {action?.renderIf && (
              <IconButton onClick={action.onClick} icon={action.icon} />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
