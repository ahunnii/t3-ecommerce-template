import type { FC } from "react";

import type { Prisma, Product } from "@prisma/client";
import Link from "next/link";

import Image, { type ImageProps } from "next/image";

// import usePrice from '@framework/product/use-price'
import { cn } from "~/utils/styles";
import ProductTag from "../product-tag/ta-product-tag.wip";
import s from "./ta-product-card.wip.module.css";

interface Props {
  className?: string;
  product: Prisma.ProductGetPayload<{
    include: { images: true; variants: true };
  }>;
  noNameTag?: boolean;
  imgProps?: Omit<ImageProps, "src" | "layout" | "placeholder" | "blurDataURL">;
  variant?: "default" | "slim" | "simple";
}

const placeholderImg = "/product-img-placeholder.svg";

const ProductCard: FC<Props> = ({
  product,
  imgProps,
  className,
  noNameTag = false,
  variant = "default",
}) => {
  const { price, id } = product;

  const rootClassName = cn(
    s.root,
    { [s.slim!]: variant === "slim", [s.simple!]: variant === "simple" },
    className,
    "thing"
  );

  return (
    <Link
      href={`/product/${product.id}`}
      className={rootClassName}
      aria-label={product.name}
    >
      <>
        {variant === "slim" && (
          <>
            <div className={s.header}>
              <span>{product.name}</span>
            </div>
            {product?.images && (
              <div>
                <Image
                  quality="85"
                  src={product.images[0]?.url ?? placeholderImg}
                  alt={product.name || "Product Image"}
                  height={320}
                  width={320}
                  layout="fixed"
                  {...imgProps}
                />
              </div>
            )}
          </>
        )}

        {variant === "simple" && (
          <>
            {/* {process.env.COMMERCE_WISHLIST_ENABLED && (
              <WishlistButton
                className={s.wishlistButton}
                productId={product.id}
                variant={product.variants[0]}
              /> */}
            {/* )} */}
            {!noNameTag && (
              <div className={s.header}>
                <h3 className={s.name}>
                  <span>{product.name}</span>
                </h3>
                <div className={s.price}>{`$ ${price} `}</div>
              </div>
            )}
            <div className={s.imageContainer}>
              {product?.images && (
                <div>
                  <Image
                    alt={product.name || "Product Image"}
                    className={s.productImage}
                    src={product.images[0]?.url ?? placeholderImg}
                    height={540}
                    width={540}
                    quality="85"
                    layout="responsive"
                    {...imgProps}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {variant === "default" && (
          <>
            {/* {process.env.COMMERCE_WISHLIST_ENABLED && (
              <WishlistButton
                className={s.wishlistButton}
                productId={product.id}
                variant={product.variants[0] as any}
              />
            )} */}
            <ProductTag name={product.name} price={`$ ${price}`} />
            <div className={s.imageContainer}>
              {product?.images && (
                <div>
                  <Image
                    alt={product.name || "Product Image"}
                    className={s.productImage}
                    src={product.images[0]?.url ?? placeholderImg}
                    height={540}
                    width={540}
                    quality="85"
                    layout="responsive"
                    {...imgProps}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </>
    </Link>
  );
};

export default ProductCard;
