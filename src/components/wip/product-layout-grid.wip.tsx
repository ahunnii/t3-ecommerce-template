"use client";
import { motion } from "framer-motion";

import { Expand, ShoppingCart } from "lucide-react";
// import Image from "next/image";
import React, { Fragment, useState } from "react";

import { DirectionAwareHover } from "./direction-aware-card.wip";

// import { useRouter } from "next/navigation";
import { type MouseEventHandler } from "react";

import { uniqueId } from "lodash";
import IconButton from "~/components/common/buttons/icon-button";
import { useMediaQuery } from "~/hooks/use-media-query";
import useCart from "~/modules/cart/hooks/use-cart";
import usePreviewModal from "~/modules/products/hooks/use-preview-modal";

import { DetailedProductFull } from "~/modules/products/types";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";
import { TaProductCard } from "../custom/ta-product-card.custom";
import ProductCard from "./product-card/ta-product-card.wip";

type Card = {
  id: number;
  content: JSX.Element | React.ReactNode | string;
  className: string;
  thumbnail: string;
  product: DetailedProductFull;
};

export const LayoutGrid = ({
  cards,
  className,
}: {
  cards: Card[];
  className?: string;
}) => {
  const [selected] = useState<Card | null>(null);
  const [lastSelected] = useState<Card | null>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const { data: sales } = api.discounts.getActiveSiteSales.useQuery({});
  // const handleClick = (card: Card) => {
  //   setLastSelected(selected);
  //   setSelected(card);
  // };

  return (
    <>
      {isDesktop ? (
        <div
          className={cn(
            "mx-auto grid h-full w-full max-w-7xl grid-cols-2  gap-4 py-10 md:grid-cols-3 ",
            className
          )}
        >
          {cards.map((card, i) => (
            <div key={i} className={cn(card.className, "")}>
              <motion.div
                // onClick={() => handleClick(card)}
                className={cn(
                  card.className,
                  "relative overflow-hidden",
                  selected?.id === card.id
                    ? "absolute inset-0 z-[45] m-auto flex h-1/2 w-full cursor-pointer flex-col flex-wrap items-center justify-center rounded-lg md:w-1/2"
                    : lastSelected?.id === card.id
                    ? "z-40 h-full w-full rounded-xl bg-white"
                    : "h-full w-full rounded-xl bg-white"
                )}
                layout
              >
                <SelectedProduct selected={card} />
              </motion.div>
            </div>
          ))}
          {/* <motion.div
        onClick={handleOutsideClick}
        className={cn(
          "absolute left-0 top-0 z-10 h-full w-full bg-black opacity-0",
          selected?.id ? "pointer-events-auto" : "pointer-events-none"
        )}
        animate={{ opacity: selected?.id ? 0.3 : 0 }}
      /> */}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {cards.map((card, i) => (
            <TaProductCard
              data={card?.product}
              size={"square"}
              imageClassName="h-auto w-full"
              key={uniqueId()}
              discounts={[...(sales ?? []), ...card?.product?.discounts] ?? []}
            />
          ))}
        </div>
      )}
    </>
  );
};

// const BlurImage = ({ card }: { card: Card }) => {
//   const [loaded, setLoaded] = useState(false);
//   return (
//     <Image
//       src={card?.product?.featuredImage ?? card.thumbnail}
//       height="500"
//       width="500"
//       onLoad={() => setLoaded(true)}
//       className={cn(
//         "absolute inset-0 h-full w-full object-cover object-top transition duration-200",
//         loaded ? "blur-none" : "blur-md"
//       )}
//       alt="thumbnail"
//     />
//   );
// };

// const SelectedCard = ({ selected }: { selected: Card | null }) => {
//   return (
//     <div className="relative z-[60] flex h-full w-full flex-col justify-end rounded-lg bg-transparent shadow-2xl">
//       <motion.div
//         initial={{
//           opacity: 0,
//         }}
//         animate={{
//           opacity: 0.6,
//         }}
//         className="absolute inset-0 z-10 h-full w-full bg-black opacity-60"
//       />
//       <motion.div
//         initial={{
//           opacity: 0,
//           y: 100,
//         }}
//         animate={{
//           opacity: 1,
//           y: 0,
//         }}
//         transition={{
//           duration: 0.3,
//           ease: "easeInOut",
//         }}
//         className="relative z-[70] px-8 pb-4"
//       >
//         {selected?.content}
//       </motion.div>
//     </div>
//   );
// };

const SelectedProduct = ({ selected }: { selected: Card }) => {
  const imageUrl = selected?.product?.featuredImage ?? selected.thumbnail;
  const [loaded, setLoaded] = useState(false);
  const previewModal = usePreviewModal();
  const cart = useCart();
  // const router = useRouter();

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    previewModal.onOpen(selected.product);
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    cart.addCartItem({
      product: selected.product,
      quantity: 1,
      variant: null,
    });

    cart.setIsShoppingBagOpen(true);
  };

  // const goToProduct = () => router.push(`/product/${selected?.product?.id}`);

  const quickActions = {
    preview: {
      icon: <Expand size={20} className="text-gray-600" />,
      onClick: onPreview,
      renderIf: true,
    },
    addToCart: {
      icon: <ShoppingCart size={20} className="text-gray-600" />,
      onClick: onAddToCart,
      renderIf: selected.product?.variants?.length === 0,
    },
  };

  const Actions = (
    <ProductCardQuickActions
      actions={[quickActions.preview, quickActions.addToCart]}
      productId={selected?.product?.id}
    />
  );

  return (
    // <div className="relative flex  h-[500px] w-[500px] items-center justify-center">
    <DirectionAwareHover
      imageUrl={imageUrl}
      Additional={Actions}
      imageOnLoad={() => setLoaded(true)}
      className={"relative z-[45] h-full w-full md:h-full md:w-full"}
      imageClassName={cn(
        "absolute inset-0 h-full w-full object-cover object-top transition duration-200",
        loaded ? "blur-none" : "blur-md"
      )}
    >
      <p className="text-xl font-bold">{selected?.product?.name}</p>
      <p className="text-sm font-normal">${selected?.product?.price} </p>
    </DirectionAwareHover>
    // </div>
  );
};

type QuickAction = {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  icon: React.ReactElement;
  className?: string;
  renderIf: boolean;
};

const ProductCardQuickActions = ({
  actions,
}: // productId,
{
  actions: QuickAction[];
  productId: string;
}) => {
  return (
    <div className="z-[45] flex w-full justify-center gap-x-6">
      {actions.map((action, index) => (
        <Fragment key={index}>
          {action?.renderIf && (
            <IconButton
              onClick={action.onClick}
              icon={action.icon}
              className="size-14 "
            />
          )}
        </Fragment>
      ))}
    </div>
  );
};
