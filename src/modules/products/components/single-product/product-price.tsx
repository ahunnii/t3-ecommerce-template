import { useMemo, type FC } from "react";
import Currency from "~/components/common/currency";
import { cn } from "~/utils/styles";
import type { ProductVariant } from "../../types";

type Props = {
  selectedVariant: ProductVariant | null;
  variants: ProductVariant[];
  price: number;
  discountPrice?: number;
};
export const ProductPrice: FC<Props> = ({
  selectedVariant,
  variants,
  price,
  discountPrice,
}) => {
  const getPriceRange = useMemo(() => {
    if (variants?.length === 0) {
      return { min: price, max: null };
    }
    const prices = variants?.map((variant) => variant.price);

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return { min, max };
  }, [variants, price]);

  return (
    <div className="flex gap-2">
      {discountPrice && (
        <div className="flex items-center">
          <Currency
            value={discountPrice}
            className="font-extrabold text-slate-800"
          />
          <span>{getPriceRange.max && !selectedVariant && "+"}</span>
        </div>
      )}

      <div className="flex">
        <Currency
          value={selectedVariant ? selectedVariant.price : price}
          className={cn(
            discountPrice && "font-medium text-muted-foreground line-through"
          )}
        />

        <span
          className={cn(
            discountPrice && "font-medium text-muted-foreground line-through"
          )}
        >
          {getPriceRange.max && !selectedVariant && "+"}
        </span>
      </div>
    </div>
  );
};
