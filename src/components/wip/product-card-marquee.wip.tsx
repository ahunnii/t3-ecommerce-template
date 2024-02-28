import { Expand, ShoppingCart } from "lucide-react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { useState, type MouseEventHandler } from "react";

import Currency from "~/components/core/ui/currency";
import IconButton from "~/components/core/ui/icon-button";
import useCart from "~/modules/cart/hooks/use-cart";
import usePreviewModal from "~/modules/products/hooks/use-preview-modal";
import type { DetailedProductFull } from "~/types";
import { cn } from "~/utils/styles";

interface ProductCard {
  data: DetailedProductFull;
  className?: string;
  imgClassName?: string;
}

export const ProductCardMarquee: React.FC<ProductCard> = ({
  data,
  className,
  imgClassName,
}) => {
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

  return (
    <div
      className={cn(
        "group mx-4 flex h-60 w-auto cursor-pointer items-center space-x-4 rounded-xl  border bg-black  p-3",
        className
      )}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ProductCardImage {...data} goToProduct={goToProduct} hovered={hovered}>
        {/* Quick Actions */}
        <ProductCardQuickActions
          actions={[quickActions.preview, quickActions.addToCart]}
        />
      </ProductCardImage>
      <ProductCardDescription {...data} onClick={goToProduct} />
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
    "/placeholder-image.webp";

  const imageStyle =
    "aspect-square rounded-md object-cover transition-all duration-500 ease-in-out h-60 w-60";
  return (
    <div className="relative aspect-square h-60 w-60  rounded-xl bg-white/70">
      <>
        <Image
          src={fallbackImage}
          alt={props.name}
          fill
          className={cn(imageStyle, "")}
          onClick={props.goToProduct}
        />
        <Image
          src={featuredImage}
          alt={props.name}
          fill
          className={cn(
            imageStyle,
            props.hovered ? "opacity-0" : "opacity-100"
          )}
          onClick={props.goToProduct}
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
};
const ProductCardDescription = ({
  onClick,
  name,
  price,
  category,
}: TProductCardDescription) => {
  return (
    <div
      className="flex h-full w-60 flex-col items-center justify-center text-center"
      onClick={onClick}
    >
      <p className="text-lg font-semibold text-white">{name}</p>
      <p className="text-sm text-gray-500">{category?.name}</p>
      <Currency value={price} className="mt-2  font-extrabold text-white" />
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
          <>
            {action?.renderIf && (
              <IconButton
                key={index}
                onClick={action.onClick}
                icon={action.icon}
              />
            )}
          </>
        ))}
      </div>
    </div>
  );
};
